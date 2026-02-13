import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';

import { CamNangDto, CamNangsService } from '@/proxy/entity/cam-nangs-list/cam-nangs';
import { DanhMucCamNangsService } from '@/proxy/entity/cam-nangs';
import { CkeditorConfigService } from 'src/ckeditor-config.service';
import { MediaHttpService } from 'src/media-http.service';
import { UploadResultDto } from '@/proxy/entity/upload-file';

@Component({
  selector: 'app-camnang-detail',
  standalone: true,
  templateUrl: './camnang-detail.component.html',
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class CamnangDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  selectedEntity = {} as CamNangDto;

  blockedPanel = false;
  btnDisabled = false;

  danhMucOptions: any[] = [];
  previewImage: string | null = null;
  selectedFile: File | null = null; // ✅ Track selected file

  public Editor: any;
  public configCkeditor: any;
  editorReady = false;

  validationMessages = {
    ten: [{ type: 'required', message: 'Bạn phải nhập tên cẩm nang' }],
    slug: [{ type: 'required', message: 'Bạn phải nhập slug' }],
    mota: [{ type: 'required', message: 'Bạn phải nhập nội dung' }],
    danhMucCamNangId: [{ type: 'required', message: 'Bạn phải chọn danh mục' }]
  };

  constructor(
    private mediaHttp: MediaHttpService,
    private fb: FormBuilder,
    private service: CamNangsService,
    private danhMucService: DanhMucCamNangsService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private util: UtilityService,
    private notificationService: NotificationService,
    private ckeditorConfigService: CkeditorConfigService,
  ) { }

  ngOnInit(): void {
    this.Editor = this.ckeditorConfigService.getEditor();
    this.configCkeditor = this.ckeditorConfigService.getEditorConfig();

    this.buildForm();
    this.loadDanhMuc();
    this.initData();
  }

  ngOnDestroy(): void {
    this.cleanupPreview();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // ================== FORM ==================

  buildForm() {
    this.form = this.fb.group({
      ten: new FormControl(this.selectedEntity.ten || null, Validators.required),
      slug: new FormControl(this.selectedEntity.slug || null, Validators.required),
      mota: new FormControl(this.selectedEntity.mota || null, Validators.required),
      danhMucCamNangId: new FormControl(
        this.selectedEntity.danhMucCamNangId || null,
        Validators.required
      ),
      trangThai: new FormControl(this.selectedEntity.trangThai ?? true),
      titleSEO: new FormControl(this.selectedEntity.titleSEO || null),
      keyword: new FormControl(this.selectedEntity.keyword || null),
      descriptionSEO: new FormControl(this.selectedEntity.descriptionSEO || null),
      anh: new FormControl(this.selectedEntity.anh || null)
    });
  }

  // ================== DATA ==================

  loadDanhMuc() {
    this.danhMucService.getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => this.danhMucOptions = res);
  }

  initData() {
    if (this.util.isEmpty(this.config.data?.id)) {
      this.prepareEditor();
      return;
    }

    this.toggleBlockUI(true);
    this.loadDetail(this.config.data.id);
  }

  loadDetail(id: string) {
    this.service.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.selectedEntity = res;
          this.buildForm();
          this.loadImage(res.anh);
          this.toggleBlockUI(false);
          this.prepareEditor();
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  // ================== CKEDITOR ==================

  private prepareEditor() {
    this.editorReady = false;
    setTimeout(() => this.editorReady = true, 100);
  }

  // ================== IMAGE ==================

  onSelectImage(event: any) {
    const file: File = event.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 200 * 1024;

    if (file.size > MAX_SIZE) {
      this.notificationService.showError('Ảnh phải nhỏ hơn hoặc bằng 200KB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      this.notificationService.showError('Chỉ cho phép ảnh JPG, PNG, WEBP');
      return;
    }

    // ✅ Lưu file để upload sau khi submit
    this.selectedFile = file;

    // ✅ Preview local
    this.cleanupPreview();
    this.previewImage = URL.createObjectURL(file);
  }

  loadImage(fileName: string) {
    if (!fileName) return;

    this.mediaHttp.get(fileName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(blob => {
        this.cleanupPreview();
        this.previewImage = URL.createObjectURL(blob);
      });
  }

  private cleanupPreview() {
    if (this.previewImage) {
      URL.revokeObjectURL(this.previewImage);
      this.previewImage = null;
    }
  }

  // ================== SAVE ==================

  saveChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.toggleBlockUI(true);

    // ✅ Case 1: Có file mới → Upload rồi save
    if (this.selectedFile) {
      this.mediaHttp.upload(this.selectedFile)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (response: UploadResultDto) => {
            // ✅ Set tên file mới vào form
            this.form.patchValue({ anh: response.result });
            this.saveCamNang();
          },
          error: (err) => {
            console.error('Upload error:', err);
            this.notificationService.showError('Upload ảnh thất bại');
            this.toggleBlockUI(false);
          }
        });
    } 
    // ✅ Case 2: Không có file mới → Giữ nguyên ảnh cũ
    else {
      // ✅ Đảm bảo form có giá trị ảnh cũ
      if (!this.form.value.anh && this.selectedEntity.anh) {
        this.form.patchValue({ anh: this.selectedEntity.anh });
      }
      this.saveCamNang();
    }
  }

  private saveCamNang() {
    const request = this.util.isEmpty(this.config.data?.id)
      ? this.service.create(this.form.value)
      : this.service.update(this.config.data.id, this.form.value);

    request
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.ref.close(true);
        },
        error: err => {
          this.notificationService.showError(
            err.error?.error?.message || 'Có lỗi xảy ra'
          );
          this.toggleBlockUI(false);
        }
      });
  }

  cancel() {
    this.ref.close(false);
  }

  // ================== UI ==================

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 300);
    }
  }
}