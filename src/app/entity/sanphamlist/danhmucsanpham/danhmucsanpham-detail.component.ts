import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { DanhMucSanPhamsService } from '@/proxy/entity/san-phams';
import { DanhMucSanPhamDto } from '@/proxy/entity/san-phams-list/danh-muc-san-phams';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-danhmucsanpham-detail',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
  templateUrl: './danhmucsanpham-detail.component.html',
})
export class DanhmucsanphamDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;

  form!: FormGroup;
  selectedEntity = {} as DanhMucSanPhamDto;

  thumbnailImage: any;
  bannerImage: any;

  validationMessages = {
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên danh mục' },
      { type: 'maxlength', message: 'Không quá 255 ký tự' },
    ],
  };

  constructor(
    private service: DanhMucSanPhamsService,
    private fb: FormBuilder,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private util: UtilityService,
    private notify: NotificationService,
    private sanitizer: DomSanitizer,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.initFormData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ref?.close();
  }

  buildForm() {
    this.form = this.fb.group({
      ten: new FormControl(this.selectedEntity.ten || null, [Validators.required, Validators.maxLength(255)]),
      slug: new FormControl(this.selectedEntity.slug || null),
      titleSEO: new FormControl(this.selectedEntity.titleSEO || null),
      keyword: new FormControl(this.selectedEntity.keyword || null),
      descriptionSEO: new FormControl(this.selectedEntity.descriptionSEO || null),
      trangThai: new FormControl(this.selectedEntity.trangThai ?? true),

      anhThumbnailName: [this.selectedEntity.anhThumbnail || null],
      anhThumbnailContent: [null],

      anhBannerName: [this.selectedEntity.anhBanner || null],
      anhBannerContent: [null],
    });
  }

  initFormData() {
    if (this.util.isEmpty(this.config.data?.id)) return;
    this.toggleBlockUI(true);

    this.service.get(this.config.data.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.selectedEntity = res;
        this.buildForm();
        this.loadThumbnailImage(res.anhThumbnail);
        this.loadBannerImage(res.anhBanner);
        this.toggleBlockUI(false);
      });
  }

  onThumbnailChange(event: any) {
    this.handleFile(event, 'anhThumbnailName', 'anhThumbnailContent', img => this.thumbnailImage = img);
  }

  onBannerChange(event: any) {
    this.handleFile(event, 'anhBannerName', 'anhBannerContent', img => this.bannerImage = img);
  }

  private handleFile(event: any, nameField: string, contentField: string, cb: any) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.form.patchValue({
        [nameField]: file.name,
        [contentField]: (reader.result as string).split(',')[1]
      });
      cb(this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string));
      this.cd.markForCheck();
    };
    reader.readAsDataURL(file);
  }

  saveChange() {
    this.toggleBlockUI(true);

    const obs = this.util.isEmpty(this.config.data?.id)
      ? this.service.create(this.form.value)
      : this.service.update(this.config.data.id, this.form.value);

    obs.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.toggleBlockUI(false);
        this.ref.close(this.form.value);
      },
      error: err => {
        this.notify.showError(err.error?.error?.message);
        this.toggleBlockUI(false);
      }
    });
  }

  loadThumbnailImage(fileName: string) {
    if (!fileName) return;

    this.service.getImage(fileName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.thumbnailImage =
          this.sanitizer.bypassSecurityTrustResourceUrl(
            `data:image/*;base64,${res}`
          );
        this.cd.markForCheck();
      });
  }

  loadBannerImage(fileName: string) {
    if (!fileName) return;

    this.service.getImage(fileName)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.bannerImage =
          this.sanitizer.bypassSecurityTrustResourceUrl(
            `data:image/*;base64,${res}`
          );
        this.cd.markForCheck();
      });
  }

  cancel() {
    this.ref?.close();
  }

  toggleBlockUI(enabled: boolean) {
    this.blockedPanel = enabled;
    this.btnDisabled = enabled;
  }
}
