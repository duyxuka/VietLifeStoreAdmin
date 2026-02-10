import { Component, OnDestroy, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { PagedResultDto } from '@abp/ng.core';
import { NotificationService } from '@/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { SanphamDetailComponent } from './sanpham-detail.component';
import { SanPhamInListDto } from '@/proxy/entity/san-phams-list/san-phams';
import { SanPhamsService } from '@/proxy/entity/san-phams';

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

  thumbnailCache: { [key: string]: any } = {};

  constructor(
    private service: SanPhamsService,
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
      next: (res: PagedResultDto<SanPhamInListDto>) => {
        this.items = res.items;
        this.totalCount = res.totalCount;
        this.toggleBlockUI(false);
      },
      error: () => this.toggleBlockUI(false)
    });
  }

  pageChanged(e: any) {
    this.skipCount = e.first;
    this.maxResultCount = e.rows;
    this.loadData();
  }

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

  getThumbnail(fileName: string) {
    if (!fileName) return null;

    if (this.thumbnailCache[fileName]) {
      return this.thumbnailCache[fileName];
    }

    this.service.getThumbnail(fileName).subscribe(res => {
      const ext = fileName.split('.').pop();
      this.thumbnailCache[fileName] =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `data:image/${ext};base64, ${res}`
        );
    });

    return this.thumbnailCache[fileName];
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => this.blockedPanel = false, 1000);
    }
  }
}
