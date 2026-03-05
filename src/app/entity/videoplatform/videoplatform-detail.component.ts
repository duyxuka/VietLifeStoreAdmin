import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';

import { SocialVideosService } from '@/proxy/entity/social-videos';
import { SocialVideoDto } from '@/proxy/entity/videoplatform';

@Component({
  selector: 'app-videoplatform-detail',
  standalone: true,
  templateUrl: './videoplatform-detail.component.html',
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class VideoplatformDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  selectedEntity = {} as SocialVideoDto;

  blockedPanel = false;
  btnDisabled = false;

  platformOptions = [
    { label: 'YouTube', value: 'YouTube' },
    { label: 'TikTok', value: 'TikTok' },
    { label: 'Facebook', value: 'Facebook' }
  ];

  validationMessages = {
    title: [
      { type: 'required', message: 'Bạn phải nhập tiêu đề' },
      { type: 'maxlength', message: 'Không quá 255 ký tự' }
    ],
    platform: [
      { type: 'required', message: 'Bạn phải chọn nền tảng' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private service: SocialVideosService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private util: UtilityService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.initData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ref.close();
  }

  buildForm() {
    this.form = this.fb.group({
      title: new FormControl(this.selectedEntity.title || null, [
        Validators.required,
        Validators.maxLength(255)
      ]),
      description: new FormControl(this.selectedEntity.description || null),
      platform: new FormControl(this.selectedEntity.platform || null, [
        Validators.required
      ]),
      videoId: new FormControl(this.selectedEntity.videoId || null),
      videoUrl: new FormControl(this.selectedEntity.videoUrl || null),
      thumbnailUrl: new FormControl(this.selectedEntity.thumbnailUrl || null),
      section: new FormControl(this.selectedEntity.section || null),
      displayOrder: new FormControl(this.selectedEntity.displayOrder ?? 0),
      isActive: new FormControl(this.selectedEntity.isActive ?? true)
    });
  }

  initData() {
    this.toggleBlockUI(true);

    if (this.util.isEmpty(this.config.data?.id)) {
      this.toggleBlockUI(false);
    } else {
      this.loadDetail(this.config.data.id);
    }
  }

  loadDetail(id: string) {
    this.service.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.selectedEntity = res;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  saveChange() {
    this.toggleBlockUI(true);

    const request = this.util.isEmpty(this.config.data?.id)
      ? this.service.create(this.form.value)
      : this.service.update(this.config.data.id, this.form.value);

    request
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.ref.close(this.form.value);
        },
        error: err => {
          this.notificationService.showError(err.error?.error?.message);
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
      }, 500);
    }
  }
}