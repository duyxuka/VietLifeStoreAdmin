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

import { DanhMucCamNangsService } from '@/proxy/entity/cam-nangs';
import { DanhmuccamnangDetailComponent } from './danhmuccamnang-detail.component';

@Component({
  selector: 'app-danhmuccamnang',
  standalone: true,
  imports: [StandaloneSharedModule],
  templateUrl: './danhmuccamnang.component.html'
})
export class DanhmuccamnangComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  blockedPanel = false;

  items: DanhMucCamNangInListDto[] = [];
  selectedItems: DanhMucCamNangInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  constructor(
    private danhMucCamNangsService: DanhMucCamNangsService,
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

    this.danhMucCamNangsService.getListFilter({
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
    const ref = this.dialogService.open(DanhmuccamnangDetailComponent, {
      header: 'Thêm danh mục cẩm nang',
      width: '70%',
      modal: true,
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe((data: DanhMucCamNangDto) => {
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

    const ref = this.dialogService.open(DanhmuccamnangDetailComponent, {
      header: 'Cập nhật danh mục cẩm nang',
      width: '70%',
      modal: true,
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

    this.danhMucCamNangsService.deleteMultiple(ids)
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
