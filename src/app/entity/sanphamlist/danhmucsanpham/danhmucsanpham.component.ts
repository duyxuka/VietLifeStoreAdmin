import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { PagedResultDto } from '@abp/ng.core';

import { DanhMucSanPhamsService } from '@/proxy/entity/san-phams';
import { DanhMucSanPhamInListDto } from '@/proxy/entity/san-phams-list/danh-muc-san-phams';
import { NotificationService } from '@/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { DanhmucsanphamDetailComponent } from './danhmucsanpham-detail.component';

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

  thumbnailCache: { [key: string]: any } = {};

  constructor(
    private service: DanhMucSanPhamsService,
    private dialogService: DialogService,
    private notification: NotificationService,
    private confirmation: ConfirmationService,
    private sanitizer: DomSanitizer
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
      next: (res: PagedResultDto<DanhMucSanPhamInListDto>) => {
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
    const ref = this.dialogService.open(DanhmucsanphamDetailComponent, {
      header: 'Thêm danh mục sản phẩm',
      width: '70%',
      modal: true,
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe(data => {
      if (data) {
        this.notification.showSuccess('Thêm thành công');
        this.loadData();
        this.selectedItems = [];
      }
    });
  }

  showEditModal() {
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
      if (data) {
        this.notification.showSuccess('Cập nhật thành công');
        this.loadData();
        this.selectedItems = [];
      }
    });
  }

  deleteItems() {
    const ids = this.selectedItems.map(x => x.id);

    this.confirmation.confirm({
      message: 'Bạn có chắc muốn xóa các bản ghi đã chọn?',
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

  getThumbnail(fileName: string) {
    if (!fileName) return null;

    if (this.thumbnailCache[fileName]) {
      return this.thumbnailCache[fileName];
    }

    this.service.getImage(fileName).subscribe(res => {
      const ext = fileName.split('.').pop();
      this.thumbnailCache[fileName] =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `data:image/${ext};base64, ${res}`
        );
    });

    return this.thumbnailCache[fileName];
  }

  toggleBlockUI(enabled: boolean) {
    this.blockedPanel = enabled;
  }
}
