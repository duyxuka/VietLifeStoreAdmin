import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { PagedResultDto } from '@abp/ng.core';

import { NotificationService } from '@/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { SanphamDetailComponent } from './sanpham-detail.component';
import { SanPhamDto, SanPhamInListDto } from '@/proxy/entity/san-phams-list/san-phams';
import { SanPhamsService } from '@/proxy/entity/san-phams';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sanpham',
  standalone: true,
  imports: [StandaloneSharedModule],
  templateUrl: './sanpham.component.html',
  styleUrl: './sanpham.component.scss'
})
export class SanphamComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: SanPhamInListDto[] = [];
  selectedItems: SanPhamInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  mediaBaseUrl = environment.apis.default.url + '/files/';

  constructor(
    private service: SanPhamsService,
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
        next: (res: PagedResultDto<SanPhamInListDto>) => {
          this.items = res.items;
          this.totalCount = res.totalCount;
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  // ✅ Simple helper để tạo full URL
  getImageUrl(fileName: string): string {
    return fileName ? this.mediaBaseUrl + fileName : '';
  }

  pageChanged(e: any) {
    this.skipCount = e.first;
    this.maxResultCount = e.rows;
    this.loadData();
  }

  // ================= MODAL =================

  showAddModal() {
    const ref = this.dialogService.open(SanphamDetailComponent, {
      header: 'Thêm sản phẩm',
      width: '80%',
      modal: true,
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.notification.showSuccess('Thêm sản phẩm thành công');
        this.loadData();
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
    if (!this.selectedItems.length) return;

    const id = this.selectedItems[0].id;

    const ref = this.dialogService.open(SanphamDetailComponent, {
      data: { id },
      header: 'Cập nhật sản phẩm',
      width: '80%',
      modal: true,
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.notification.showSuccess('Cập nhật thành công');
        this.loadData();
        this.selectedItems = [];
      }
    });
  }

  // ================= DELETE =================

  deleteItems() {
    const ids = this.selectedItems.map(x => x.id);

    this.confirmation.confirm({
      message: 'Bạn có chắc muốn xóa các sản phẩm đã chọn?',
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
          this.loadData();
          this.selectedItems = [];
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }
  updateThuTu(item: SanPhamDto) {
    this.service.updateThuTuByIdAndThuTu(
      item.id!,
      item.thuTu ?? 0
    ).subscribe({
      next: () => {
        this.notification.showSuccess('Cập nhật thứ tự');
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