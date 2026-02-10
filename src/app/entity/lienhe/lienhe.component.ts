import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { PagedResultDto } from '@abp/ng.core';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { NotificationService } from '@/shared/services/notification.service';
import { LienHeInListDto, LienHesService } from '@/proxy/entity/lien-hes'

@Component({
  selector: 'app-lienhe',
  standalone: true,
  imports: [StandaloneSharedModule],
  templateUrl: './lienhe.component.html',
  styleUrl: './lienhe.component.scss'
})
export class LienheComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: LienHeInListDto[] = [];
  selectedItems: LienHeInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  constructor(
    private service: LienHesService,
    private notification: NotificationService,
    private confirmation: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // ================= LOAD =================
  loadData() {
    this.toggleBlockUI(true);

    this.service.getListFilter({
      keyword: this.keyword,
      skipCount: this.skipCount,
      maxResultCount: this.maxResultCount
    })
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: (res: PagedResultDto<LienHeInListDto>) => {
        this.items = res.items;
        this.totalCount = res.totalCount;
        this.toggleBlockUI(false);
      },
      error: () => this.toggleBlockUI(false)
    });
  }

  // ================= PAGING =================
  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  // ================= MARK AS PROCESSED =================
  markAsProcessed(item: LienHeInListDto) {
    this.toggleBlockUI(true);

    this.service.markAsProcessed(item.id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.notification.showSuccess('Đã đánh dấu xử lý');
          this.loadData();
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  // ================= DELETE =================
  deleteItems() {
    const ids = this.selectedItems.map(x => x.id);

    this.confirmation.confirm({
      message: 'Bạn có chắc muốn xóa các liên hệ đã chọn?',
      accept: () => this.deleteConfirmed(ids)
    });
  }

  deleteConfirmed(ids: string[]) {
    this.toggleBlockUI(true);

    this.service.deleteMultiple(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.notification.showSuccess('Xóa thành công');
          this.selectedItems = [];
          this.loadData();
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  toggleBlockUI(value: boolean) {
    this.blockedPanel = value;
  }
}
