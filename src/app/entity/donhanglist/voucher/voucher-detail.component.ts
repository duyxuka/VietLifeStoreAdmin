import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';

import { VoucherDto } from '@/proxy/entity/don-hangs-list/vouchers';
import { VouchersService } from '@/proxy/entity/don-hangs';

@Component({
  selector: 'app-voucher-detail',
  standalone: true,
  templateUrl: './voucher-detail.component.html',
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class VoucherDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  selectedEntity = {} as VoucherDto;

  blockedPanel = false;
  btnDisabled = false;

  validationMessages = {
    maVoucher: [
      { type: 'required', message: 'Bạn phải nhập mã voucher' },
      { type: 'maxlength', message: 'Không quá 50 ký tự' }
    ],
    giamGia: [
      { type: 'required', message: 'Bạn phải nhập giá trị giảm' },
      { type: 'min', message: 'Giá trị phải >= 0' }
    ],
    soLuong: [
      { type: 'required', message: 'Bạn phải nhập số lượng' },
      { type: 'min', message: 'Số lượng phải >= 0' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private service: VouchersService,
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
      maVoucher: new FormControl(this.selectedEntity.maVoucher || null, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      giamGia: new FormControl(this.selectedEntity.giamGia ?? 0, [
        Validators.required,
        Validators.min(0)
      ]),
      laPhanTram: new FormControl(this.selectedEntity.laPhanTram ?? false),
      donHangToiThieu: new FormControl(this.selectedEntity.donHangToiThieu ?? 0),
      soLuong: new FormControl(this.selectedEntity.soLuong ?? 0, [
        Validators.required,
        Validators.min(0)
      ]),
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
      }, 1000);
    }
  }
}
