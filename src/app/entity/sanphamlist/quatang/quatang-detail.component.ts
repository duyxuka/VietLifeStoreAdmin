import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { QuaTangDto } from '@/proxy/entity/san-phams-list/qua-tangs';
import { QuaTangsService } from '@/proxy/entity/san-phams';

@Component({
  selector: 'app-quatang-detail',
  templateUrl: './quatang-detail.component.html',
  standalone: true,
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class QuatangDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;
  btnDisabled = false;

  form: FormGroup;
  selectedEntity = {} as QuaTangDto;

  validationMessages = {
    ten: [
      { type: 'required', message: 'Bạn phải nhập tên quà tặng' },
      { type: 'maxlength', message: 'Không được nhập quá 255 ký tự' }
    ],
    gia: [
      { type: 'required', message: 'Bạn phải nhập giá quà tặng' },
      { type: 'min', message: 'Giá phải lớn hơn hoặc bằng 0' }
    ]
  };

  constructor(
    private quaTangsService: QuaTangsService,
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
      gia: new FormControl(
        this.selectedEntity.gia ?? 0,
        [Validators.required, Validators.min(0)]
      ),
      trangThai: new FormControl(
        this.selectedEntity.trangThai ?? true
      )
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
    this.quaTangsService.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res) => {
          this.selectedEntity = res;
          this.buildForm();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  saveChange() {
    this.toggleBlockUI(true);

    if (this.util.isEmpty(this.config.data?.id)) {
      this.quaTangsService.create(this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          error: (err) => {
            this.notificationService.showError(err.error.error.message);
            this.toggleBlockUI(false);
          }
        });
    } else {
      this.quaTangsService.update(this.config.data?.id, this.form.value)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe({
          next: () => {
            this.toggleBlockUI(false);
            this.ref.close(this.form.value);
          },
          error: (err) => {
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
