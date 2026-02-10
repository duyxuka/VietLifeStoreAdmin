import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { NotificationService } from '@/shared/services/notification.service';

import {
  DanhMucCamNangDto,
  DanhMucCamNangInListDto
} from '@/proxy/entity/cam-nangs-list/danh-muc-cam-nangs';

import { DanhmucchinhsachDetailComponent } from './danhmucchinhsach-detail.component';
import { DanhMucChinhSachsService } from '@/proxy/entity/chinh-sachs';

@Component({
  selector: 'app-danhmucchinhsach',
  standalone: true,
  imports: [StandaloneSharedModule],
  templateUrl: './danhmucchinhsach.component.html',
})
export class DanhmucchinhsachComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: DanhMucCamNangInListDto[] = [];
  selectedItems: DanhMucCamNangInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  constructor(
    private service: DanhMucChinhSachsService,
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
    const ref = this.dialogService.open(DanhmucchinhsachDetailComponent, {
      header: 'Thêm danh mục chính sách',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe((data: DanhMucCamNangDto) => {
      if (data) {
        this.loadData();
        this.selectedItems = [];
        this.notificationService.showSuccess('Thêm thành công');
      }
    });
  }

  showEditModal() {
    if (this.selectedItems.length !== 1) {
      this.notificationService.showError('Bạn phải chọn một bản ghi');
      return;
    }

    const ref = this.dialogService.open(DanhmucchinhsachDetailComponent, {
      header: 'Cập nhật danh mục chính sách',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
      data: { id: this.selectedItems[0].id }
    });

    ref.onClose.subscribe((data: DanhMucCamNangDto) => {
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
      message: 'Bạn có chắc muốn xóa các danh mục đã chọn?',
      accept: () => this.deleteConfirmed(ids)
    });
  }

  deleteConfirmed(ids: string[]) {
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
      setTimeout(() => this.blockedPanel = false, 300);
    }
  }
}
