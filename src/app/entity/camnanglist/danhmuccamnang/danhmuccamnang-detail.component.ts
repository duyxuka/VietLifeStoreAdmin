import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';

import {
  DanhMucCamNangDto
} from '@/proxy/entity/cam-nangs-list/danh-muc-cam-nangs';
import { DanhMucCamNangsService } from '@/proxy/entity/cam-nangs';

@Component({
  selector: 'app-danhmuccamnang-detail',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent],
  templateUrl: './danhmuccamnang-detail.component.html',
})
export class DanhmuccamnangDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;

  form: FormGroup;
  selectedEntity = {} as DanhMucCamNangDto;

  validationMessages = {
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên danh mục' },
      { type: 'maxlength', message: 'Không quá 255 ký tự' }
    ],
  };

  constructor(
    private service: DanhMucCamNangsService,
    private fb: FormBuilder,
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

  private buildForm() {
    this.form = this.fb.group({
      ten: new FormControl(
        this.selectedEntity.ten || null,
        [Validators.required, Validators.maxLength(255)]
      ),
      slug: new FormControl(this.selectedEntity.slug || null),
      titleSEO: new FormControl(this.selectedEntity.titleSEO || null),
      keyword: new FormControl(this.selectedEntity.keyword || null),
      descriptionSEO: new FormControl(this.selectedEntity.descriptionSEO || null),
      trangThai: new FormControl(this.selectedEntity.trangThai ?? true)
    });
  }

  initData() {
    this.toggleBlockUI(true);

    if (this.util.isEmpty(this.config.data?.id)) {
      this.toggleBlockUI(false);
    } else {
      this.loadDetails(this.config.data.id);
    }
  }

  loadDetails(id: string) {
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
    const slug = this.form.get('slug')?.value?.trim();
    if (!slug && this.form.get('ten')?.value?.trim()) {
      this.form.patchValue({ slug: this.util.MakeSeoTitle(this.form.get('ten')!.value.trim()) });
    }
    const payload = this.form.value;

    if (this.util.isEmpty(this.config.data?.id)) {
      this.service.create(payload)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(payload);
          },
          error: err => {
            this.notificationService.showError(err.error.error.message);
            this.toggleBlockUI(false);
          }
        });
    } else {
      this.service.update(this.config.data.id, payload)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(payload);
          },
          error: err => {
            this.notificationService.showError(err.error.error.message);
            this.toggleBlockUI(false);
          }
        });
    }
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
      }, 1000);
    }
  }
}
