import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { BannersService } from '@/proxy/entity/banners';
import { BannerDto } from '@/proxy/entity/banners';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';

@Component({
  selector: 'app-banner-detail',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
  templateUrl: './banner-detail.component.html',
})
export class BannerDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;

  form!: FormGroup;
  selectedEntity = {} as BannerDto;

  bannerImage: any;

  validationMessages = {
    tieuDe: [
      { type: 'required', message: 'Bạn phải nhập tiêu đề' },
      { type: 'maxlength', message: 'Không quá 255 ký tự' },
    ],
  };

  constructor(
    private service: BannersService,
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
      tieuDe: new FormControl(this.selectedEntity.tieuDe || null, [
        Validators.required,
        Validators.maxLength(255)
      ]),
      moTa: new FormControl(this.selectedEntity.moTa || null),
      lienKet: new FormControl(this.selectedEntity.lienKet || null),
      trangThai: new FormControl(this.selectedEntity.trangThai ?? true),

      anhName: [this.selectedEntity.anh || null],
      anhContent: [null],
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
        this.loadImage(res.anh);
        this.toggleBlockUI(false);
      });
  }

  onSelectImage(event: any) {
    const file: File = event.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const MAX_SIZE = 200 * 1024; // 200KB

    if (file.size > MAX_SIZE) {
      this.notify.showError('Ảnh phải nhỏ hơn hoặc bằng 200KB');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      this.notify.showError('Chỉ cho phép ảnh JPG, PNG, WEBP');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.bannerImage = reader.result as string;

      this.form.patchValue({
        anhName: file.name,
        anhContent: this.bannerImage
      });
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

  loadImage(fileName: string) {
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
