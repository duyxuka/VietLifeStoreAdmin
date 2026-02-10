import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { NotificationService } from '@/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { DonHangInListDto } from '@/proxy/entity/don-hangs-list/don-hangs';
import { DonHangsService } from '@/proxy/entity/don-hangs';
import { DonHangDetailComponent } from './donhang-detail.component';

@Component({
  selector: 'app-donhang',
  templateUrl: './donhang.component.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class DonhangComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: DonHangInListDto[] = [];
  selectedItems: DonHangInListDto[] = [];

  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;
  keyword = '';

  constructor(
    private service: DonHangsService,
    private dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

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

  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showAddModal() {
    const ref = this.dialogService.open(DonHangDetailComponent, {
      header: 'Thêm đơn hàng',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Thêm đơn hàng thành công');
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Vui lòng chọn 1 đơn hàng');
      return;
    }

    const id = this.selectedItems[0].id;

    const ref = this.dialogService.open(DonHangDetailComponent, {
      header: 'Cập nhật đơn hàng',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
      data: { id }
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.loadData();
        this.notificationService.showSuccess('Cập nhật thành công');
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Vui lòng chọn ít nhất 1 đơn hàng');
      return;
    }

    const count = this.selectedItems.length;

    this.confirmationService.confirm({
      message: `Bạn có chắc muốn xóa ${count} đơn hàng?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () =>
        this.deleteItemsConfirmed(this.selectedItems.map(x => x.id))
    });
  }

  private deleteItemsConfirmed(ids: string[]) {
    this.toggleBlockUI(true);

    this.service.deleteMultiple(ids)
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
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }
  }
}
