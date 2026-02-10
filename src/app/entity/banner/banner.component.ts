import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { PagedResultDto } from '@abp/ng.core';

import { BannersService } from '@/proxy/entity/banners';
import { BannerInListDto } from '@/proxy/entity/banners';
import { NotificationService } from '@/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { BannerDetailComponent } from './banner-detail.component';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [StandaloneSharedModule],
  templateUrl: './banner.component.html',
})
export class BannerComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: BannerInListDto[] = [];
  selectedItems: BannerInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  imageCache: { [key: string]: any } = {};

  constructor(
    private service: BannersService,
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
      next: (res: PagedResultDto<BannerInListDto>) => {
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
    const ref = this.dialogService.open(BannerDetailComponent, {
      header: 'Thêm banner',
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

    const ref = this.dialogService.open(BannerDetailComponent, {
      data: { id },
      header: 'Cập nhật banner',
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
      message: 'Bạn có chắc muốn xóa các banner đã chọn?',
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

  getImage(fileName: string) {
    if (!fileName) return null;

    if (this.imageCache[fileName]) {
      return this.imageCache[fileName];
    }

    this.service.getImage(fileName).subscribe(res => {
      const ext = fileName.split('.').pop();
      this.imageCache[fileName] =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          `data:image/${ext};base64,${res}`
        );
    });

    return this.imageCache[fileName];
  }

  toggleBlockUI(enabled: boolean) {
    this.blockedPanel = enabled;
  }
}
