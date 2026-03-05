import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { PagedResultDto } from '@abp/ng.core';

import { DanhMucSanPhamsService } from '@/proxy/entity/san-phams';
import { DanhMucSanPhamInListDto } from '@/proxy/entity/san-phams-list/danh-muc-san-phams';
import { NotificationService } from '@/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { DanhmucsanphamDetailComponent } from './danhmucsanpham-detail.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-danhmucsanpham',
  standalone: true,
  imports: [StandaloneSharedModule],
  templateUrl: './danhmucsanpham.component.html',
})
export class DanhmucsanphamComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: DanhMucSanPhamInListDto[] = [];
  selectedItems: DanhMucSanPhamInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  mediaBaseUrl = environment.apis.default.url + '/files/';

  constructor(
    private service: DanhMucSanPhamsService,
    private dialogService: DialogService,
    private notification: NotificationService,
    private confirmation: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // ================= LOAD DATA =================

  loadData() {
    this.toggleBlockUI(true);

    this.service.getListFilter({
      keyword: this.keyword,
      skipCount: this.skipCount,
      maxResultCount: this.maxResultCount
    })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: PagedResultDto<DanhMucSanPhamInListDto>) => {
          this.items = res.items;
          this.totalCount = res.totalCount;
          this.toggleBlockUI(false);
        },
        error: (err) => {
          this.notification.showError(
            err?.error?.error?.message || 'Không thể tải dữ liệu'
          );
          this.toggleBlockUI(false);
        }
      });
  }

  // ✅ Simple helper để tạo full URL
  getImageUrl(fileName: string): string {
    return fileName ? this.mediaBaseUrl + fileName : '';
  }

  pageChanged(event: any) {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  // ================= MODAL =================

  showAddModal() {
    const ref = this.dialogService.open(DanhmucsanphamDetailComponent, {
      header: 'Thêm danh mục sản phẩm',
      width: '70%',
      modal: true,
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe(data => {
      if (!data) return;

      this.notification.showSuccess('Thêm thành công');
      this.selectedItems = [];
      this.loadData();
    });
  }

  showEditModal() {
    if (!this.selectedItems.length) return;

    const id = this.selectedItems[0].id;

    const ref = this.dialogService.open(DanhmucsanphamDetailComponent, {
      data: { id },
      header: 'Cập nhật danh mục sản phẩm',
      width: '70%',
      modal: true,
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe(data => {
      if (!data) return;

      this.notification.showSuccess('Cập nhật thành công');
      this.selectedItems = [];
      this.loadData();
    });
  }

  // ================= DELETE =================

  deleteItems() {
    if (!this.selectedItems.length) return;

    const ids = this.selectedItems.map(x => x.id);

    this.confirmation.confirm({
      message: 'Bạn có chắc muốn xóa các bản ghi đã chọn?',
      accept: () => this.deleteConfirmed(ids)
    });
  }

  private deleteConfirmed(ids: string[]) {
    this.toggleBlockUI(true);

    this.service.deleteMultiple(ids)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.notification.showSuccess('Xóa thành công');
          this.selectedItems = [];
          this.loadData();
        },
        error: (err) => {
          this.notification.showError(
            err?.error?.error?.message || 'Xóa thất bại'
          );
          this.toggleBlockUI(false);
        }
      });
  }

  // ================= UI =================

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