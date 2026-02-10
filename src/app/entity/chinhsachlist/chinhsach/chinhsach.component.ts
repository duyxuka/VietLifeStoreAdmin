import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { NotificationService } from '@/shared/services/notification.service';

import {
  ChinhSachDto,
  ChinhSachInListDto
} from '@/proxy/entity/chinh-sachs-list/chinh-sachs';

import { ChinhSachsService } from '@/proxy/entity/chinh-sachs';
import { ChinhsachDetailComponent } from './chinhsach-detail.component';

@Component({
  selector: 'app-chinhsach',
  standalone: true,
  imports: [StandaloneSharedModule],
  templateUrl: './chinhsach.component.html'
})
export class ChinhsachComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  blockedPanel = false;

  items: ChinhSachInListDto[] = [];
  selectedItems: ChinhSachInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  constructor(
    private chinhSachsService: ChinhSachsService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService
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

    this.chinhSachsService.getListFilter({
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
    const ref = this.dialogService.open(ChinhsachDetailComponent, {
      header: 'Thêm chính sách',
      width: '70%',
      modal: true,
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe((data: ChinhSachDto) => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Thêm mới thành công');
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Bạn phải chọn một bản ghi');
      return;
    }

    const ref = this.dialogService.open(ChinhsachDetailComponent, {
      header: 'Cập nhật chính sách',
      width: '70%',
      modal: true,
      dismissableMask: true,
      closable: true,
      data: { id: this.selectedItems[0].id }
    });

    ref.onClose.subscribe((data: ChinhSachDto) => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Cập nhật thành công');
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length === 0) {
      this.notificationService.showError('Phải chọn ít nhất một bản ghi');
      return;
    }

    const ids = this.selectedItems.map(x => x.id);

    this.confirmationService.confirm({
      message: 'Bạn có chắc muốn xóa các chính sách đã chọn?',
      accept: () => this.deleteConfirmed(ids)
    });
  }

  deleteConfirmed(ids: string[]) {
    this.toggleBlockUI(true);

    this.chinhSachsService.deleteMultiple(ids)
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
      setTimeout(() => this.blockedPanel = false, 500);
    }
  }
}
