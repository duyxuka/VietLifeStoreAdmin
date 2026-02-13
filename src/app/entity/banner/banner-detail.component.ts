import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { BannersService } from '@/proxy/entity/banners';
import { BannerDto } from '@/proxy/entity/banners';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { MediaHttpService } from 'src/media-http.service';
import { UploadResultDto } from '@/proxy/entity/upload-file';

@Component({
  selector: 'app-banner-detail',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
  templateUrl: './banner-detail.component.html',
})
export class BannerDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  selectedEntity = {} as BannerDto;

  blockedPanel = false;
  btnDisabled = false;

  previewImage: string | null = null;
  selectedFile: File | null = null;
  
  validationMessages = {
    tieuDe: [
      { type: 'required', message: 'Bạn phải nhập tiêu đề' },
      { type: 'maxlength', message: 'Không quá 255 ký tự' },
    ],
  };

  constructor(
    private mediaHttp: MediaHttpService,
    private service: BannersService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private util: UtilityService,
    private notification: NotificationService,
  ) { }

  ngOnInit(): void {
    this.buildForm();
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
      tieuDe: new FormControl(this.selectedEntity.tieuDe || null, [
        Validators.required,
        Validators.maxLength(255)
      ]),
      moTa: new FormControl(this.selectedEntity.moTa || null),
      lienKet: new FormControl(this.selectedEntity.lienKet || null),
      trangThai: new FormControl(this.selectedEntity.trangThai ?? true),
      anh: new FormControl(this.selectedEntity.anh || null),
    });
  }

  // ================== DATA ==================

  initData() {
    if (this.util.isEmpty(this.config.data?.id)) return;

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
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  // ================== IMAGE ==================

  onSelectImage(event: any) {
    const file: File = event.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 200 * 1024;

    if (file.size > MAX_SIZE) {
      this.notification.showError('Ảnh phải nhỏ hơn hoặc bằng 200KB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      this.notification.showError('Chỉ cho phép ảnh JPG, PNG, WEBP');
      return;
    }

    this.selectedFile = file;

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

    // ✅ Validation: Phải có ảnh mới hoặc ảnh cũ
    if (!this.selectedFile && !this.selectedEntity.anh) {
      this.notification.showError('Bạn phải chọn ảnh');
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
            this.saveBanner();
          },
          error: (err) => {
            console.error('Upload error:', err);
            this.notification.showError('Upload ảnh thất bại');
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
      this.saveBanner();
    }
  }

  private saveBanner() {
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
          this.notification.showError(
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