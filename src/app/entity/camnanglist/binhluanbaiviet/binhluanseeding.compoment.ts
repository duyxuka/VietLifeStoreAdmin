import { CamNangCommentService } from '@/proxy/entity/cam-nangs';
import { CamNangsService } from '@/proxy/entity/cam-nangs-list/cam-nangs';
import { NotificationService } from '@/shared/services/notification.service';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-binhluanseeding.compoment',
  templateUrl: './binhluanseeding.compoment.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class BinhluanseedingCompoment implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  camNangOptions: { label: string; value: string }[] = [];
  selectedCamNangId: string | null = null;

  rows: any[] = [];
  loading = false;

  // Mẫu tên ngẫu nhiên để gợi ý
  private sampleNames = [
    'Nguyễn Thị Mai', 'Trần Văn Hùng', 'Lê Thu Hà', 'Phạm Minh Khoa',
    'Đỗ Thị Lan', 'Vũ Đức Thành', 'Bùi Thị Hoài', 'Hoàng Anh Tuấn',
    'Ngô Thị Thanh', 'Đinh Văn Long', 'Lý Thị Kim', 'Phan Văn Đức'
  ];

  private sampleComments = [
    'Bài viết rất hay và bổ ích, cảm ơn tác giả!',
    'Thông tin chi tiết, dễ hiểu. Mình đã áp dụng và thấy hiệu quả.',
    'Cảm ơn shop đã chia sẻ kiến thức hữu ích này.',
    'Bài viết đúng với những gì mình đang tìm kiếm.',
    'Rất hữu ích, mình sẽ chia sẻ cho bạn bè cùng đọc.',
    'Tuyệt vời! Mình học được nhiều điều từ bài viết này.',
    'Nội dung rất chất lượng, mong có thêm nhiều bài như thế này.',
    'Đọc xong hiểu ngay, cảm ơn shop nhiều lắm!',
    'Thông tin mới, cập nhật và rất thực tế.',
    'Bài viết rất có tâm, đọc rất thích!'
  ];

  constructor(
    private ref: DynamicDialogRef,
    private camNangCommentService: CamNangCommentService,
    private camNangsService: CamNangsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadCamNangs();
    this.addRow();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadCamNangs() {
    this.camNangsService.getListSelect()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.camNangOptions = res.map((x: any) => ({
          label: x.ten,
          value: x.id
        }));
      });
  }

  addRow() {
    this.rows.push({ tenNguoiDung: '', email: '', noiDung: '' });
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
  }

  autoFill() {
    this.rows = Array.from({ length: 5 }, (_, i) => {
      const name = this.sampleNames[Math.floor(Math.random() * this.sampleNames.length)];
      return {
        tenNguoiDung: name,
        email: this.generateEmail(name, i),
        noiDung: this.sampleComments[Math.floor(Math.random() * this.sampleComments.length)]
      };
    });
  }

  private generateEmail(name: string, index: number): string {
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/\s+/g, '.');
    return `${slug}${index + 1}@gmail.com`;
  }

  async submitSeeding() {
    if (!this.selectedCamNangId) {
      this.notificationService.showError('Vui lòng chọn bài viết');
      return;
    }

    const validRows = this.rows.filter(
      r => r.tenNguoiDung?.trim() && r.noiDung?.trim()
    );

    if (validRows.length === 0) {
      this.notificationService.showError('Vui lòng nhập ít nhất một bình luận');
      return;
    }

    this.loading = true;

    try {
      for (const row of validRows) {
        await this.camNangCommentService.create({
          camNangId: this.selectedCamNangId,
          tenNguoiDung: row.tenNguoiDung.trim(),
          email: row.email?.trim() || '',
          noiDung: row.noiDung.trim(),
          parentId: null,
          trangThai: true
        } as any).toPromise();
      }

      this.loading = false;
      this.ref.close(true);
    } catch {
      this.loading = false;
      this.notificationService.showError('Có lỗi xảy ra khi seeding');
    }
  }

  cancel() {
    this.ref.close(false);
  }
}
