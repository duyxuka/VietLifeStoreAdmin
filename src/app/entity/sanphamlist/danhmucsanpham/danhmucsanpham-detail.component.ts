import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil, forkJoin, of } from 'rxjs';

import { DanhMucSanPhamsService } from '@/proxy/entity/san-phams';
import { DanhMucSanPhamDto } from '@/proxy/entity/san-phams-list/danh-muc-san-phams';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { MediaHttpService } from 'src/media-http.service';
import { UploadResultDto } from '@/proxy/entity/upload-file';

@Component({
  selector: 'app-danhmucsanpham-detail',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
  templateUrl: './danhmucsanpham-detail.component.html',
})
export class DanhmucsanphamDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  selectedEntity = {} as DanhMucSanPhamDto;

  blockedPanel = false;
  btnDisabled = false;

  // ✅ Preview URLs
  thumbnailPreview: string | null = null;
  bannerPreview: string | null = null;

  // ✅ Track selected files
  selectedThumbnail: File | null = null;
  selectedBanner: File | null = null;

  validationMessages = {
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên danh mục' },
      { type: 'maxlength', message: 'Không quá 255 ký tự' },
    ],
  };

  constructor(
    private mediaHttp: MediaHttpService,
    private service: DanhMucSanPhamsService,
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
      ten: new FormControl(this.selectedEntity.ten || null, [
        Validators.required,
        Validators.maxLength(255)
      ]),
      slug: new FormControl(this.selectedEntity.slug || null),
      titleSEO: new FormControl(this.selectedEntity.titleSEO || null),
      keyword: new FormControl(this.selectedEntity.keyword || null),
      descriptionSEO: new FormControl(this.selectedEntity.descriptionSEO || null),
      trangThai: new FormControl(this.selectedEntity.trangThai ?? true),
      anhThumbnail: new FormControl(this.selectedEntity.anhThumbnail || null),
      anhBanner: new FormControl(this.selectedEntity.anhBanner || null),
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
          this.loadThumbnail(res.anhThumbnail);
          this.loadBanner(res.anhBanner);
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  // ================== IMAGE SELECTION ==================

  onThumbnailSelect(event: any) {
    const file: File = event.files?.[0]; // ✅ Đổi từ event.target?.files thành event.files
    if (!file) return;

    if (!this.validateImage(file)) return;

    // ✅ Lưu file để upload sau
    this.selectedThumbnail = file;

    // ✅ Preview local
    this.cleanupThumbnail();
    this.thumbnailPreview = URL.createObjectURL(file);
  }

  onBannerSelect(event: any) {
    const file: File = event.files?.[0]; // ✅ Đổi từ event.target?.files thành event.files
    if (!file) return;

    if (!this.validateImage(file)) return;

    // ✅ Lưu file để upload sau
    this.selectedBanner = file;

    // ✅ Preview local
    this.cleanupBanner();
    this.bannerPreview = URL.createObjectURL(file);
  }

  private validateImage(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 300 * 1024;

    if (file.size > MAX_SIZE) {
      this.notification.showError('Ảnh phải nhỏ hơn hoặc bằng 300KB');
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      this.notification.showError('Chỉ cho phép JPG, PNG, WEBP');
      return false;
    }

    return true;
  }

  // ================== IMAGE LOADING ==================

  private loadThumbnail(fileName: string) {
    if (!fileName) return;

    this.mediaHttp.get(fileName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(blob => {
        this.cleanupThumbnail();
        this.thumbnailPreview = URL.createObjectURL(blob);
      });
  }

  private loadBanner(fileName: string) {
    if (!fileName) return;

    this.mediaHttp.get(fileName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(blob => {
        this.cleanupBanner();
        this.bannerPreview = URL.createObjectURL(blob);
      });
  }

  // ================== CLEANUP ==================

  private cleanupPreview() {
    this.cleanupThumbnail();
    this.cleanupBanner();
  }

  private cleanupThumbnail() {
    if (this.thumbnailPreview) {
      URL.revokeObjectURL(this.thumbnailPreview);
      this.thumbnailPreview = null;
    }
  }

  private cleanupBanner() {
    if (this.bannerPreview) {
      URL.revokeObjectURL(this.bannerPreview);
      this.bannerPreview = null;
    }
  }

  // ================== SAVE ==================

  saveChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.toggleBlockUI(true);

    // ✅ Check nếu cần upload ảnh
    const needUploadThumbnail = !!this.selectedThumbnail;
    const needUploadBanner = !!this.selectedBanner;

    if (needUploadThumbnail || needUploadBanner) {
      // ✅ Upload song song nếu có cả 2, hoặc từng cái
      const uploadThumbnail$ = needUploadThumbnail
        ? this.mediaHttp.upload(this.selectedThumbnail!)
        : of(null);

      const uploadBanner$ = needUploadBanner
        ? this.mediaHttp.upload(this.selectedBanner!)
        : of(null);

      forkJoin({
        thumbnail: uploadThumbnail$,
        banner: uploadBanner$
      })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: (results) => {
            // ✅ Update form với fileName mới
            if (results.thumbnail) {
              this.form.patchValue({
                anhThumbnail: (results.thumbnail as UploadResultDto).result
              });
            }

            if (results.banner) {
              this.form.patchValue({
                anhBanner: (results.banner as UploadResultDto).result
              });
            }

            // ✅ Save data
            this.saveDanhMuc();
          },
          error: (err) => {
            console.error('Upload error:', err);
            this.notification.showError('Upload ảnh thất bại');
            this.toggleBlockUI(false);
          }
        });
    } else {
      // ✅ Không có file mới, đảm bảo giữ nguyên ảnh cũ
      if (!this.form.value.anhThumbnail && this.selectedEntity.anhThumbnail) {
        this.form.patchValue({ anhThumbnail: this.selectedEntity.anhThumbnail });
      }

      if (!this.form.value.anhBanner && this.selectedEntity.anhBanner) {
        this.form.patchValue({ anhBanner: this.selectedEntity.anhBanner });
      }

      this.saveDanhMuc();
    }
  }

  private saveDanhMuc() {
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
            err?.error?.error?.message || 'Có lỗi xảy ra'
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