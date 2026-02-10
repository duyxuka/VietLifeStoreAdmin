import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';

import { DanhMucChinhSachDto } from '@/proxy/entity/chinh-sachs-list/danh-muc-chinh-sachs';
import { DanhMucChinhSachsService } from '@/proxy/entity/chinh-sachs';

@Component({
  selector: 'app-danhmucchinhsach-detail',
  standalone: true,
  templateUrl: './danhmucchinhsach-detail.component.html',
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class DanhmucchinhsachDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  selectedEntity = {} as DanhMucChinhSachDto;

  blockedPanel = false;
  btnDisabled = false;

  validationMessages = {
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên danh mục' },
      { type: 'maxlength', message: 'Không quá 255 ký tự' }
    ],
    slug: [
      { type: 'required', message: 'Bạn phải nhập slug' },
      { type: 'maxlength', message: 'Không quá 255 ký tự' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private service: DanhMucChinhSachsService,
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
      ten: new FormControl(this.selectedEntity.ten || null, [
        Validators.required,
        Validators.maxLength(255)
      ]),
      slug: new FormControl(this.selectedEntity.slug || null, [
        Validators.required,
        Validators.maxLength(255)
      ]),
      trangThai: new FormControl(this.selectedEntity.trangThai ?? true),
      titleSEO: new FormControl(this.selectedEntity.titleSEO || null),
      keyword: new FormControl(this.selectedEntity.keyword || null),
      descriptionSEO: new FormControl(this.selectedEntity.descriptionSEO || null)
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
