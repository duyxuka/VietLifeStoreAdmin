import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin, of, Subject, takeUntil } from 'rxjs';
import { DanhMucSanPhamsService, QuaTangsService, SanPhamsService } from '@/proxy/entity/san-phams';
import { SanPhamDto } from '@/proxy/entity/san-phams-list/san-phams';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { CkeditorConfigService } from 'src/ckeditor-config.service';
import { MediaHttpService } from 'src/media-http.service';
import { UploadResultDto } from '@/proxy/entity/upload-file';

@Component({
  selector: 'app-sanpham-detail',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
  templateUrl: './sanpham-detail.component.html',
  styleUrl: './sanpham.component.scss'
})
export class SanphamDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;

  public Editor: any;
  public configCkeditor: any;
  editorReady = false;

  form!: FormGroup;
  selectedEntity = {} as SanPhamDto;

  // ✅ Ảnh đại diện
  anhDaiDienPreview: string | null = null;
  selectedAnhDaiDien: File | null = null;

  // ✅ Ảnh phụ
  anhPhuPreviews: string[] = [];
  selectedAnhPhuFiles: File[] = []; // Files mới chọn
  anhPhuOldNames: string[] = []; // Tên file ảnh cũ (khi edit)

  danhMucOptions: any[] = [];
  quaTangOptions: any[] = [];

  validationMessages = {
    ten: [{ type: 'required', message: 'Bạn phải nhập tên sản phẩm' }],
    danhMucId: [{ type: 'required', message: 'Chọn danh mục' }],
    gia: [{ type: 'required', message: 'Nhập giá bán' }]
  };
  constructor(
    private mediaHttp: MediaHttpService,
    private service: SanPhamsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private util: UtilityService,
    private notify: NotificationService,
    private cd: ChangeDetectorRef,
    private serviceDanhMuc: DanhMucSanPhamsService,
    private serviceQuaTang: QuaTangsService,
    private ckeditorConfigService: CkeditorConfigService
  ) { }

  ngOnInit(): void {
    this.toggleBlockUI(true);

    this.Editor = this.ckeditorConfigService.getEditor();
    this.configCkeditor = this.ckeditorConfigService.getEditorConfig();

    this.buildForm();
    this.loadDanhMucAndQuaTang();

    if (!this.config.data?.id) {
      this.addThuocTinh();
      this.prepareEditor();
      this.toggleBlockUI(false);
    } else {
      this.initFormData();
    }

    this.bindGiaAndKhuyenMaiAuto();
  }

  get hasExistingProduct(): boolean {
    return !!this.config?.data?.id;
  }

  xoaAnhDaiDien() {
    this.cleanupAnhDaiDienPreview();
    this.selectedAnhDaiDien = null;
    this.form.patchValue({ anh: null });
  }
  onAnhDaiDienSelect(event: any) {
    const file: File = event.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 300 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.notify.showError('Chỉ cho phép ảnh JPG, PNG, WEBP');
      return;
    }

    if (file.size > MAX_SIZE) {
      this.notify.showError('Ảnh đại diện phải ≤ 300KB');
      return;
    }

    // ✅ Lưu file để upload sau
    this.selectedAnhDaiDien = file;

    // ✅ Preview local
    this.cleanupAnhDaiDienPreview();
    this.anhDaiDienPreview = URL.createObjectURL(file);
  }

  private cleanupAnhDaiDienPreview() {
    if (this.anhDaiDienPreview) {
      URL.revokeObjectURL(this.anhDaiDienPreview);
      this.anhDaiDienPreview = null;
    }
  }

  loadAnhDaiDien(fileName: string) {
    if (!fileName) return;

    this.mediaHttp.get(fileName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(blob => {
        this.cleanupAnhDaiDienPreview();
        this.anhDaiDienPreview = URL.createObjectURL(blob);
      });
  }

  // ================== ẢNH PHỤ ==================

  onAnhPhuSelect(event: any) {
    const files: File[] = Array.from(event.target.files || []);
    if (!files.length) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 300 * 1024;

    // ✅ Tính tổng số ảnh hiện tại
    const currentTotalImages = this.anhPhuOldNames.length + this.selectedAnhPhuFiles.length;

    if (files.length + currentTotalImages > 9) {
      this.notify.showError('Tối đa 9 ảnh phụ');
      return;
    }

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        this.notify.showError(`File ${file.name} không hợp lệ`);
        return;
      }

      if (file.size > MAX_SIZE) {
        this.notify.showError(`Ảnh ${file.name} vượt quá 300KB`);
        return;
      }
      // ✅ Preview local
      this.selectedAnhPhuFiles.push(file);
      this.anhPhuPreviews = [
        ...this.anhPhuPreviews,
        URL.createObjectURL(file)
      ];
    });
  }

  removeAnhPhu(index: number) {
    const oldImagesCount = this.anhPhuOldNames.length;

    if (index < oldImagesCount) {
      // ✅ Xóa ảnh cũ (chỉ remove khỏi list giữ lại)
      this.anhPhuOldNames.splice(index, 1);
    } else {
      // ✅ Xóa ảnh mới
      const newImageIndex = index - oldImagesCount;
      this.selectedAnhPhuFiles.splice(newImageIndex, 1);
    }

    // ✅ Cleanup preview
    if (this.anhPhuPreviews[index]) {
      URL.revokeObjectURL(this.anhPhuPreviews[index]);
    }
    this.anhPhuPreviews.splice(index, 1);
  }

  private prepareEditor() {
    this.editorReady = false;
    setTimeout(() => {
      this.editorReady = true;
    }, 100);
  }

  // ================== FORM ==================

  buildForm() {
    this.form = this.fb.group({
      ten: [null, [Validators.required, Validators.maxLength(120)]],
      slug: [null],
      danhMucId: [null, Validators.required],
      moTaNgan: [null],
      thuTu: [null],
      luotXem: [null],
      luotMua: [null],
      moTa: [null],
      huongDanSuDung: [null],
      thongSoKyThuat: [null],
      gia: [0, Validators.required],
      giaKhuyenMai: [0],
      phanTramKhuyenMai: [null],
      titleSEO: [null, Validators.maxLength(70)],
      keyword: [null],
      descriptionSEO: [null, Validators.maxLength(160)],
      trangThai: [true],
      quaTangId: [null],
      anh: [null],
      anhPhu: [[]],
      thuocTinhs: this.fb.array([]),
      bienThes: this.fb.array([])
    });
  }
  get thuocTinhs(): FormArray { return this.form.get('thuocTinhs') as FormArray; }
  get bienThes(): FormArray { return this.form.get('bienThes') as FormArray; }
  get anhPhu(): FormArray { return this.form.get('anhPhu') as FormArray; }

  addThuocTinh() {
    this.thuocTinhs.push(
      this.fb.group({
        ten: [''],
        giaTris: this.fb.array([])
      })
    );
  }
  getGiaTris(index: number): FormArray {
    return this.thuocTinhs.at(index).get('giaTris') as FormArray;
  }

  removeThuocTinh(index: number) {
    this.thuocTinhs.removeAt(index);
    this.generateVariants();
  }

  addGiaTri(thuocTinhIndex: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    if (!value) return;

    const giaTris = this.getGiaTris(thuocTinhIndex);

    if (!giaTris.value.includes(value)) {
      giaTris.push(new FormControl(value));
      this.generateVariants();
    }

    input.value = '';
  }

  removeGiaTri(thuocTinhIndex: number, giaTriIndex: number) {
    this.getGiaTris(thuocTinhIndex).removeAt(giaTriIndex);
    this.generateVariants();
  }

  onThuocTinhChange() {
    this.generateVariants();
  }
  onGiaTriChange(thuocTinhIndex: number) {
    this.generateVariants();
  }
  generateVariants() {
    const percent = this.form.get('phanTramKhuyenMai')?.value ?? 0;
    const attrs = this.thuocTinhs.controls
      .map((tt, idx) => ({
        index: idx,
        ten: tt.get('ten')?.value?.trim(),
        giaTris: (tt.get('giaTris') as FormArray).value
          .filter(v => v?.trim())
          .map(v => v.trim())
      }))
      .filter(a => a.ten && a.giaTris.length > 0);

    if (!attrs.length) {
      while (this.bienThes.length > 0) {
        this.bienThes.removeAt(0);
      }
      return;
    }

    // Tạo tất cả tổ hợp mới
    let combos: string[][] = [[]];
    for (const attr of attrs) {
      combos = combos.flatMap(c =>
        attr.giaTris.map(v => [...c, v])
      );
    }

    const newComboKeys = new Set(combos.map(c => c.join(' - ')));

    // Xóa các biến thể không còn tồn tại trong tổ hợp mới
    for (let i = this.bienThes.length - 1; i >= 0; i--) {
      const ten = this.bienThes.at(i).get('ten')?.value;
      if (!newComboKeys.has(ten)) {
        this.bienThes.removeAt(i);
      }
    }

    const giaMacDinh = this.form.get('gia')?.value ?? 0;

    combos.forEach(combo => {
      const tenBienThe = combo.join(' - ');
      let variantGroup: FormGroup;

      // Tìm biến thể đã tồn tại theo tên
      const existingIndex = this.bienThes.controls.findIndex(
        ctrl => ctrl.get('ten')?.value === tenBienThe
      );

      if (existingIndex !== -1) {
        // Biến thể đã tồn tại → giữ nguyên, chỉ cập nhật nếu cần
        variantGroup = this.bienThes.at(existingIndex) as FormGroup;

        // Đảm bảo có control isGiaCustomized (nếu thiếu)
        if (!variantGroup.get('isGiaCustomized')) {
          variantGroup.addControl('isGiaCustomized', this.fb.control(false));
        }
        // KHÔNG subscribe lại valueChanges (đã subscribe lúc tạo/load)
        // KHÔNG patch giá KM ở đây nữa → để recalculateGiaKhuyenMai() xử lý
      } else {
        // Tạo biến thể mới
        variantGroup = this.fb.group({
          ten: [tenBienThe, Validators.required],
          gia: [giaMacDinh],
          giaKhuyenMai: [percent > 0 ? Math.round(giaMacDinh * (1 - percent / 100)) : 0],
          isGiaCustomized: [false]
        });

        // Subscribe để phát hiện người dùng chỉnh tay
        variantGroup.get('gia')?.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
          variantGroup.patchValue({ isGiaCustomized: true }, { emitEvent: false });
        });

        variantGroup.get('giaKhuyenMai')?.valueChanges.subscribe(() => {
          variantGroup.patchValue({ isGiaCustomized: true }, { emitEvent: false });
        });

        // Auto update giá KM khi đổi giá biến thể (chỉ nếu chưa customize)
        variantGroup.get('gia')?.valueChanges
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(giaBt => {
            const p = this.form.get('phanTramKhuyenMai')?.value ?? 0;
            if (variantGroup.get('isGiaCustomized')?.value) return; // Đã customize → không auto update
            variantGroup.patchValue({
              giaKhuyenMai: Math.round((giaBt ?? giaMacDinh) * (1 - p / 100))
            }, { emitEvent: false });
          });

        this.bienThes.push(variantGroup);
      }

      // KHÔNG patch giá KM ở đây nữa → tránh reset khi generate lại
    });
  }

  bindGiaAndKhuyenMaiAuto() {
    const giaCtrl = this.form.get('gia');
    const percentCtrl = this.form.get('phanTramKhuyenMai');

    if (!giaCtrl || !percentCtrl) return;

    // Khi đổi giá hoặc %
    giaCtrl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.recalculateGiaKhuyenMai());

    percentCtrl.valueChanges
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => this.recalculateGiaKhuyenMai());
  }

  recalculateGiaKhuyenMai() {
    const giaGocSp = this.form.get('gia')?.value ?? 0;
    const percent = this.form.get('phanTramKhuyenMai')?.value ?? 0;

    // Chỉ tính giá KM khi có phần trăm giảm giá > 0
    let giaKmSp = 0;
    if (percent > 0 && giaGocSp > 0) {
      giaKmSp = Math.round(giaGocSp * (1 - percent / 100));
    }

    this.form.patchValue({ giaKhuyenMai: giaKmSp }, { emitEvent: false });

    // Cập nhật biến thể
    this.bienThes.controls.forEach(btCtrl => {
      const fg = btCtrl as FormGroup;
      const isCustom = fg.get('isGiaCustomized')?.value === true;

      if (isCustom) {
        // Giữ nguyên giá người dùng đã chỉnh tay
        return;
      }

      const giaBt = fg.get('gia')?.value ?? giaGocSp;

      // Chỉ tính giá KM cho biến thể khi có phần trăm > 0
      let giaKmMoi = 0;
      if (percent > 0 && giaBt > 0) {
        giaKmMoi = Math.round(giaBt * (1 - percent / 100));
      }

      fg.patchValue(
        { giaKhuyenMai: giaKmMoi },
        { emitEvent: false }
      );
    });
  }

  // ================== LOAD DATA ==================

  private loadDanhMucAndQuaTang() {
    this.serviceDanhMuc.getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.danhMucOptions = res;
      });

    this.serviceQuaTang.getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.quaTangOptions = res;
      });
  }

  async initFormData() {
    if (!this.config.data?.id) return;

    try {
      const res = await this.service.get(this.config.data.id).toPromise();
      this.selectedEntity = res;
      this.form.patchValue(res);
      if (res.gia > 0 && res.giaKhuyenMai > 0 && res.giaKhuyenMai < res.gia) {
        const percent = Math.round((res.gia - res.giaKhuyenMai) / res.gia * 100);
        this.form.patchValue({ phanTramKhuyenMai: percent }, { emitEvent: false });
      }
      // ✅ Ảnh đại diện
      if (res.anh) {
        this.loadAnhDaiDien(res.anh);
      }

      // ✅ Ảnh phụ - hiển thị tất cả ảnh cũ
      if (res.anhPhu?.length) {
        this.anhPhuOldNames = [...res.anhPhu];

        const requests = res.anhPhu.map(fileName =>
          this.mediaHttp.get(fileName)
        );

        forkJoin(requests)
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(blobs => {
            this.anhPhuPreviews = blobs.map(blob =>
              URL.createObjectURL(blob),
            );
          });
      }
      // Thuộc tính
      if (res.thuocTinhs?.length) {
        this.thuocTinhs.clear();

        res.thuocTinhs.forEach(tt => {
          this.thuocTinhs.push(
            this.fb.group({
              ten: [tt.ten, Validators.required],
              giaTris: this.fb.array(
                (tt.giaTris || []).map(gt => new FormControl(gt)),
                [Validators.required, Validators.minLength(1)]
              )
            })
          );
        });
      }
      // Biến thể
      if (res.bienThes?.length) {
        this.bienThes.clear();
        res.bienThes.forEach(bt => {
          const percent = this.form.get('phanTramKhuyenMai')?.value ?? 0;
          const autoGiaKm = Math.round((bt.gia ?? 0) * (1 - percent / 100));
          const fg = this.fb.group({
            ten: [bt.ten || '(không có tên)', Validators.required],
            gia: [bt.gia ?? 0],
            giaKhuyenMai: [bt.giaKhuyenMai ?? null],
            isGiaCustomized: [bt.giaKhuyenMai != null && bt.giaKhuyenMai !== autoGiaKm]
          });
          fg.get('gia')?.valueChanges.subscribe(() => {
            fg.patchValue({ isGiaCustomized: true }, { emitEvent: false });
          });

          fg.get('giaKhuyenMai')?.valueChanges.subscribe(() => {
            fg.patchValue({ isGiaCustomized: true }, { emitEvent: false });
          });
          fg.get('gia')?.valueChanges
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(giaBt => {
              const p = this.form.get('phanTramKhuyenMai')?.value;
              if (p == null || giaBt == null) return;
              if (fg.get('giaKhuyenMai')?.dirty) return;

              fg.patchValue(
                { giaKhuyenMai: Math.round(giaBt * (1 - p / 100)) },
                { emitEvent: false }
              );
            });

          this.bienThes.push(fg);
        });

      } else if (res.thuocTinhs?.length) {
        this.generateVariants();
      }
      this.cd.detectChanges();
    } catch (err) {
      this.notify.showError('Không tải được thông tin sản phẩm');
      console.error(err);
    } finally {
      this.prepareEditor();
      this.toggleBlockUI(false);
    }
  }

  // ================== SAVE ==================
  saveChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.toggleBlockUI(true);

    // ✅ Check xem cần upload ảnh không
    const needUploadAnhDaiDien = !!this.selectedAnhDaiDien;
    const needUploadAnhPhu = this.selectedAnhPhuFiles.length > 0;

    if (needUploadAnhDaiDien || needUploadAnhPhu) {
      // ✅ Upload ảnh đại diện
      const uploadAnhDaiDien$ = needUploadAnhDaiDien
        ? this.mediaHttp.upload(this.selectedAnhDaiDien!)
        : of(null);

      // ✅ Upload tất cả ảnh phụ
      const uploadAnhPhuRequests = this.selectedAnhPhuFiles.map(file =>
        this.mediaHttp.upload(file)
      );

      // ✅ Upload song song
      forkJoin({
        anhDaiDien: uploadAnhDaiDien$,
        anhPhu: uploadAnhPhuRequests.length > 0
          ? forkJoin(uploadAnhPhuRequests)
          : of([])
      })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (results) => {
            // ✅ Set ảnh đại diện mới
            if (results.anhDaiDien) {
              this.form.patchValue({
                anh: (results.anhDaiDien as UploadResultDto).result
              });
            }

            // ✅ Set ảnh phụ mới
            if (results.anhPhu && results.anhPhu.length > 0) {
              const newFileNames = (results.anhPhu as UploadResultDto[])
                .map(r => r.result);

              // ✅ Clear FormArray và thêm file names mới
              this.form.patchValue({
                anhPhu: newFileNames
              });
            }

            // ✅ Save data
            this.saveSanPham();
          },
          error: (err) => {
            console.error('Upload error:', err);
            this.notify.showError('Upload ảnh thất bại');
            this.toggleBlockUI(false);
          }
        });
    } else {
      // ✅ Không có file mới, giữ nguyên ảnh cũ
      if (!this.form.value.anh && this.selectedEntity.anh) {
        this.form.patchValue({ anh: this.selectedEntity.anh });
      }

      this.saveSanPham();
    }
  }

  private saveSanPham() {
    const rawValue = this.form.getRawValue();
    rawValue.bienThes = this.bienThes.getRawValue().map((bt: any) => ({
      ten: bt.ten,
      gia: bt.gia ?? 0,
      giaKhuyenMai: bt.giaKhuyenMai ?? 0,
      isGiaCustomized: bt.isGiaCustomized ?? false
    }));
    // ✅ Auto generate slug
    if (!rawValue.slug && rawValue.ten) {
      rawValue.slug = this.util.MakeSeoTitle(rawValue.ten);
    }

    // ✅ Xử lý ảnh phụ khi update
    if (this.config.data?.id) {

      // ✅ Chỉ gửi ảnh mới (KHÔNG gửi ảnh cũ lại)
      rawValue.anhPhu = this.selectedAnhPhuFiles.length > 0
        ? rawValue.anhPhu
        : [];

      // ✅ Danh sách ảnh giữ lại
      rawValue.anhPhuGiuLai = this.anhPhuOldNames;
    }

    const obs = this.config.data?.id
      ? this.service.update(this.config.data.id, rawValue)
      : this.service.create(rawValue);

    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.toggleBlockUI(false);
        this.notify.showSuccess('Lưu sản phẩm thành công!');
        this.ref.close(true);
      },
      error: (err) => {
        this.notify.showError(err.error?.error?.message || 'Lưu thất bại');
        this.toggleBlockUI(false);
      }
    });
  }

  cancel() {
    this.ref.close();
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 800);
    }
  }
  ngOnDestroy(): void {

    this.cleanupAnhDaiDienPreview();

    this.anhPhuPreviews.forEach(url => {
      URL.revokeObjectURL(url);
    });

    this.anhPhuPreviews = [];

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}