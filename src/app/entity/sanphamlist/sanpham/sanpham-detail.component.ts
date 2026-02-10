import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { DanhMucSanPhamsService, QuaTangsService, SanPhamsService } from '@/proxy/entity/san-phams';
import { SanPhamDto } from '@/proxy/entity/san-phams-list/san-phams';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { CkeditorConfigService } from 'src/ckeditor-config.service';

@Component({
  selector: 'app-sanpham-detail',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
  templateUrl: './sanpham-detail.component.html',
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
  anhDaiDienPreview: SafeResourceUrl | null = null;
  anhPhuPreviews: SafeResourceUrl[] = [];
  anhPhuOldNames: string[] = []; // Theo dõi tên file ảnh cũ để gửi anhPhuGiuLai
  danhMucOptions: any[] = [];
  quaTangOptions: any[] = [];
  validationMessages = {
    ten: [{ type: 'required', message: 'Bạn phải nhập tên sản phẩm' }],
    danhMucId: [{ type: 'required', message: 'Chọn danh mục' }],
    gia: [{ type: 'required', message: 'Nhập giá bán' }]
  };
  constructor(
    private service: SanPhamsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private util: UtilityService,
    private notify: NotificationService,
    private sanitizer: DomSanitizer,
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

  onAnhDaiDienSelect(event: any) {
    const file: File = event.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 200 * 1024;

    if (!allowedTypes.includes(file.type)) {
      this.notify.showError('Chỉ cho phép ảnh JPG, PNG, WEBP');
      return;
    }

    if (file.size > MAX_SIZE) {
      this.notify.showError('Ảnh đại diện phải ≤ 200KB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.anhDaiDienPreview =
        this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);

      this.form.patchValue({
        anhDaiDienName: file.name,
        anhDaiDienContent: reader.result
      });

      this.cd.markForCheck();
    };

    reader.readAsDataURL(file);
  }

  onAnhPhuSelect(event: any) {
    const files: File[] = event.files || [];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 200 * 1024;

    if (files.length + this.anhPhuPreviews.length > 9) {
      this.notify.showError('Tối đa 9 ảnh phụ');
      return;
    }

    files.forEach(file => {
      if (!allowedTypes.includes(file.type)) {
        this.notify.showError('Chỉ cho phép ảnh JPG, PNG, WEBP');
        return;
      }

      if (file.size > MAX_SIZE) {
        this.notify.showError(`Ảnh ${file.name} vượt quá 200KB`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.anhPhu.push(
          this.fb.group({
            fileName: file.name,
            base64: reader.result
          })
        );

        this.anhPhuPreviews.push(
          this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string)
        );

        this.cd.markForCheck();
      };

      reader.readAsDataURL(file);
    });
  }


  private prepareEditor() {
    this.editorReady = false;
    setTimeout(() => {
      this.editorReady = true;
    }, 100);
  }

  buildForm() {
    this.form = this.fb.group({
      ten: [null, [Validators.required, Validators.maxLength(120)]],
      slug: [null],
      danhMucId: [null, Validators.required],
      moTaNgan: [null],
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
      anhDaiDienName: [null],
      anhDaiDienContent: [null],
      anhPhu: this.fb.array([]),
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
        ten: ['', Validators.required], // Thêm required nếu muốn bắt buộc
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

  onThuocTinhChange() {
    this.generateVariants();
  }

  generateVariants() {
    const percent = this.form.get('phanTramKhuyenMai')?.value;

    const attrs = this.thuocTinhs.controls
      .map(tt => ({
        ten: tt.get('ten')?.value,
        giaTris: (tt.get('giaTris') as FormArray).value as string[]
      }))
      .filter(a => a.ten && a.giaTris.length > 0);

    // Không có thuộc tính hợp lệ → clear biến thể
    if (!attrs.length) {
      this.bienThes.clear();
      return;
    }

    /* ================== TẠO TỔ HỢP ================== */
    let combos: string[][] = [[]];
    for (const attr of attrs) {
      combos = combos.flatMap(c =>
        attr.giaTris.map(v => [...c, v])
      );
    }

    /* ================== MAP BIẾN THỂ CŨ ================== */
    const existingMap = new Map<string, FormGroup>();
    this.bienThes.controls.forEach(ctrl => {
      const key = ctrl.get('ten')?.value;
      if (key) existingMap.set(key, ctrl as FormGroup);
    });

    /* ================== THÊM BIẾN THỂ MỚI ================== */
    combos.forEach(c => {
      const name = c.join(' - ');

      if (!existingMap.has(name)) {
        const giaGoc = this.form.get('gia')?.value ?? 0;

        const bt = this.fb.group({
          ten: [name],
          gia: [giaGoc],
          giaKhuyenMai: [
            percent != null
              ? Math.round(giaGoc * (1 - percent / 100))
              : null
          ]
        });

        // 🔥 Auto cập nhật giá KM khi sửa giá biến thể
        bt.get('gia')?.valueChanges
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(giaBt => {
            const p = this.form.get('phanTramKhuyenMai')?.value;
            if (p == null || giaBt == null) return;

            // Nếu user đã sửa tay giá KM thì không ghi đè
            if (bt.get('giaKhuyenMai')?.dirty) return;

            bt.patchValue(
              {
                giaKhuyenMai: Math.round(giaBt * (1 - p / 100))
              },
              { emitEvent: false }
            );
          });

        this.bienThes.push(bt);
      }
    });

    /* ================== XOÁ BIẾN THỂ KHÔNG CÒN DÙNG ================== */
    for (let i = this.bienThes.length - 1; i >= 0; i--) {
      const ten = this.bienThes.at(i).get('ten')?.value;
      if (!combos.some(c => c.join(' - ') === ten)) {
        this.bienThes.removeAt(i);
      }
    }
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
    const gia = this.form.get('gia')?.value;
    const percent = this.form.get('phanTramKhuyenMai')?.value;

    if (gia == null || percent == null) return;

    const giaKm = Math.round(gia * (1 - percent / 100));

    // Giá sản phẩm chính
    this.form.patchValue(
      { giaKhuyenMai: giaKm },
      { emitEvent: false } // ❗ tránh loop
    );

    // Biến thể
    this.bienThes.controls.forEach(bt => {
      if (bt.get('giaKhuyenMai')?.dirty) return;

      const giaBt = bt.get('gia')?.value ?? gia;

      bt.patchValue(
        {
          giaKhuyenMai: Math.round(giaBt * (1 - percent / 100))
        },
        { emitEvent: false }
      );
    });

  }

  removeAnhPhu(index: number) {
    this.anhPhuPreviews.splice(index, 1);
    if (index < this.anhPhu.length) {
      // Xóa ảnh mới
      this.anhPhu.removeAt(index);
    } else {
      // Xóa ảnh cũ: loại khỏi anhPhuOldNames
      const oldIndex = index - this.anhPhu.length;
      this.anhPhuOldNames.splice(oldIndex, 1);
    }
    this.cd.markForCheck();
  }
  private loadDanhMucAndQuaTang() {
    // Danh mục
    this.serviceDanhMuc.getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.danhMucOptions = res;
      });

    // Quà tặng
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
      // Ảnh đại diện
      if (res.anh) {
        const base64 = await this.service.getImage(res.anh).toPromise();
        if (base64) {
          this.anhDaiDienPreview = this.sanitizer.bypassSecurityTrustResourceUrl(
            `data:image/jpeg;base64,${base64}`
          );
        }
      }
      // Ảnh phụ - hiển thị tất cả ảnh cũ và lưu tên file
      if (res.anhPhu?.length) {
        this.anhPhuPreviews = [];
        this.anhPhuOldNames = [...res.anhPhu]; // Sao chép để theo dõi
        for (const fileName of res.anhPhu) {
          const base64 = await this.service.getImage(fileName).toPromise();
          if (base64) {
            this.anhPhuPreviews.push(
              this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/jpeg;base64,${base64}`)
            );
          }
        }
      }
      // Thuộc tính
      if (res.thuocTinhs?.length) {
        this.thuocTinhs.clear();
        res.thuocTinhs.forEach(tt => {
          this.thuocTinhs.push(
            this.fb.group({
              ten: [tt.ten, Validators.required],
              giaTris: [tt.giaTris || [], [Validators.required, Validators.minLength(1)]]
            })
          );
        });
      }
      this.generateVariants();
      // Biến thể
      if (res.bienThes?.length) {
        this.bienThes.clear();
        res.bienThes.forEach(bt => {
          const fg = this.fb.group({
            ten: [bt.ten || '(không có tên)', Validators.required],
            gia: [bt.gia ?? 0],
            giaKhuyenMai: [bt.giaKhuyenMai ?? null],
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


  saveChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.toggleBlockUI(true);
    const rawValue = this.form.getRawValue();
    if (!rawValue.slug && rawValue.ten) {
      rawValue.slug = this.util.MakeSeoTitle(rawValue.ten);
    }
    // Xử lý ảnh phụ khi update: gửi anhPhuGiuLai (danh sách tên file cũ muốn giữ)
    if (this.config.data?.id && this.anhPhuOldNames.length > 0) {
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
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}