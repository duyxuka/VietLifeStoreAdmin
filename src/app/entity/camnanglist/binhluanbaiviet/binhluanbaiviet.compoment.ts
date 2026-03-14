import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmationService } from 'primeng/api';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { BinhluanseedingCompoment } from './binhluanseeding.compoment';
import { CamNangCommentInListDto } from '@/proxy/entity/cam-nangs-list/cam-nang-comments';
import { CamNangCommentService } from '@/proxy/entity/cam-nangs';
import { CamNangsService } from '@/proxy/entity/cam-nangs-list/cam-nangs';

@Component({
  selector: 'app-binhluanbaiviet',
  templateUrl: './binhluanbaiviet.compoment.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class BinhluanbaivietComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();
  blockedPanel = false;

  items: CamNangCommentInListDto[] = [];
  selectedItems: CamNangCommentInListDto[] = [];

  keyword = '';
  skipCount = 0;
  maxResultCount = 10;
  totalCount = 0;

  camNangOptions: any[] = [];
  selectedCamNangId?: string;

  constructor(
    private camNangCommentService: CamNangCommentService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private notificationService: NotificationService,
    private camNangService: CamNangsService
  ) { }

  ngOnInit(): void {
    this.loadData();
    this.loadCamNang();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  loadCamNang() {
    this.camNangService.getListSelect()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.camNangOptions = res;
      });
  }
  loadData() {
    this.toggleBlockUI(true);

    this.camNangCommentService.getListFilter({
      keyword: this.keyword,
      skipCount: this.skipCount,
      maxResultCount: this.maxResultCount,
      id: this.selectedCamNangId,
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
    const ref = this.dialogService.open(BinhluanseedingCompoment, {
      header: 'Seeding bình luận',
      modal: true,
      width: '60%',
      dismissableMask: true,
      closable: true
    });

    ref.onClose.subscribe((success: boolean) => {
      if (success) {
        this.loadData();
        this.notificationService.showSuccess('Seeding bình luận thành công');
      }
    });
  }

  toggleTrangThai(item: CamNangCommentInListDto) {
    this.toggleBlockUI(true);

    this.camNangCommentService.update(item.id, {
      ...item,
      trangThai: !item.trangThai
    } as any)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          item.trangThai = !item.trangThai;
          this.notificationService.showSuccess(
            item.trangThai ? 'Đã duyệt bình luận' : 'Đã ẩn bình luận'
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
      message: `Bạn có chắc muốn xóa ${ids.length} bình luận đã chọn?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      accept: () => this.deleteConfirmed(ids)
    });
  }

  deleteConfirmed(ids: string[]) {
    this.toggleBlockUI(true);

    this.camNangCommentService.deleteMultiple(ids)
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