import { PaymentInformationModelInListDto } from '@/proxy/entity/payments';
import { PaymentInformationModelsService } from '@/proxy/payments';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-donhangvnpay.compoment',
  templateUrl: './donhangvnpay.compoment.html',
  styleUrl: './donhangvnpay.compoment.scss',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class DonhangvnpayCompoment implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  blockedPanel = false;

  items: PaymentInformationModelInListDto[] = [];

  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  keyword = '';

  constructor(
    private service: PaymentInformationModelsService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadData() {

    this.toggleBlockUI(true);

    this.service.getListFilter({
      keyword: this.keyword,
      skipCount: this.skipCount,
      maxResultCount: this.maxResultCount
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.items = res.items;
          this.totalCount = res.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }
  getPaymentStatusLabel(status: string) {
    return status === '00'
      ? 'Đã thanh toán'
      : 'Hủy thanh toán';
  }

  getPaymentStatusSeverity(status: string) {
    return status === '00'
      ? 'success'
      : 'danger';
  }
  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 500);
    }
  }

}
