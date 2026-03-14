import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { SanPhamReviewInListDto, SanPhamReviewsService } from '@/proxy/entity/san-phams-list/san-pham-reviews';
import { SanPhamsService } from '@/proxy/entity/san-phams';
import { SanphamreviewseedingComponent } from './sanphamreviewseeding.compoment';

@Component({
  selector: 'app-sanphamreview',
  templateUrl: './sanphamreview.compoment.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class SanphamreviewComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: SanPhamReviewInListDto[] = [];
  selectedItems: SanPhamReviewInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  sanPhamOptions: any[] = [];
  selectedSanPhamId?: string;

  constructor(
    private sanPhamReviewService: SanPhamReviewsService,
    private sanPhamService: SanPhamsService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadSanPham();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadSanPham() {
    this.sanPhamService.getListSelect()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.sanPhamOptions = res;
      });
  }

  loadData() {
    this.toggleBlockUI(true);

    this.sanPhamReviewService.getListFilter({
      keyword: this.keyword,
      skipCount: this.skipCount,
      maxResultCount: this.maxResultCount,
      id: this.selectedSanPhamId
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

  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showSeedingModal() {
    const ref = this.dialogService.open(SanphamreviewseedingComponent, {
      header: 'Seeding đánh giá sản phẩm',
      modal: true,
      width: '60%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe((success: boolean) => {
      if (success) {
        this.loadData();
        this.notificationService.showSuccess('Seeding đánh giá thành công');
      }
    });
  }

  toggleTrangThai(item: SanPhamReviewInListDto) {
    this.toggleBlockUI(true);

    this.sanPhamReviewService.update(item.id, {
      ...item,
      trangThai: !item.trangThai
    } as any)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe({
      next: () => {
        item.trangThai = !item.trangThai;
        this.notificationService.showSuccess(
          item.trangThai ? 'Đã duyệt đánh giá' : 'Đã ẩn đánh giá'
        );
        this.toggleBlockUI(false);
      },
      error: () => this.toggleBlockUI(false)
    });
  }

  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Phải chọn ít nhất một bản ghi');
      return;
    }

    const ids = this.selectedItems.map(x => x.id);

    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa ${ids.length} đánh giá đã chọn?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteConfirmed(ids)
    });
  }

  deleteConfirmed(ids: string[]) {
    this.toggleBlockUI(true);

    this.sanPhamReviewService.deleteMultiple(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.notificationService.showSuccess('Xóa thành công');
          this.loadData();
          this.selectedItems = [];
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => { this.blockedPanel = false; }, 1000);
    }
  }
}