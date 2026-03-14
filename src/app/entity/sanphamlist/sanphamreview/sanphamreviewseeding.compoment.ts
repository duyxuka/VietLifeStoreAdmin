import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { NotificationService } from '@/shared/services/notification.service';
import { SanPhamsService } from '@/proxy/entity/san-phams';
import { SanPhamReviewsService } from '@/proxy/entity/san-phams-list/san-pham-reviews';

@Component({
  selector: 'app-sanphamreviewseeding',
  templateUrl: './sanphamreviewseeding.compoment.html',
  standalone: true,
  imports: [StandaloneSharedModule]
})
export class SanphamreviewseedingComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  sanPhamOptions: { label: string; value: string }[] = [];
  selectedSanPhamId: string | null = null;

  rows: any[] = [];
  loading = false;

  soSaoOptions = [
    { label: '⭐ 1 sao', value: 1 },
    { label: '⭐⭐ 2 sao', value: 2 },
    { label: '⭐⭐⭐ 3 sao', value: 3 },
    { label: '⭐⭐⭐⭐ 4 sao', value: 4 },
    { label: '⭐⭐⭐⭐⭐ 5 sao', value: 5 },
  ];

  private sampleNames = [
    'Nguyễn Thị Mai', 'Trần Văn Hùng', 'Lê Thu Hà', 'Phạm Minh Khoa',
    'Đỗ Thị Lan', 'Vũ Đức Thành', 'Bùi Thị Hoài', 'Hoàng Anh Tuấn',
    'Ngô Thị Thanh', 'Đinh Văn Long', 'Lý Thị Kim', 'Phan Văn Đức'
  ];

  private sampleReviews = [
    'Sản phẩm rất tốt, dùng thấy hiệu quả rõ rệt sau 2 tuần.',
    'Hàng chính hãng, đóng gói cẩn thận, giao hàng nhanh. Rất hài lòng!',
    'Chất lượng vượt mức mong đợi, sẽ ủng hộ shop dài dài.',
    'Mình đã dùng nhiều lần, lần nào cũng ưng. Recommend cho mọi người!',
    'Sản phẩm đúng mô tả, mùi hương dễ chịu, texture mịn màng.',
    'Giá hợp lý so với chất lượng. Mua lần đầu mà ưng ngay.',
    'Shop tư vấn nhiệt tình, sản phẩm chất lượng cao. 5 sao xứng đáng!',
    'Dùng thử theo lời khuyên của bạn bè, kết quả thực sự bất ngờ.',
    'Giao hàng siêu tốc, sản phẩm còn nguyên seal. Rất tin tưởng shop.',
    'Đã mua lần 3, lần nào cũng hài lòng. Shop giữ vững chất lượng tốt!'
  ];

  constructor(
    private ref: DynamicDialogRef,
    private sanPhamReviewService: SanPhamReviewsService,
    private sanPhamService: SanPhamsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadSanPhams();
    this.addRow();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  loadSanPhams() {
    this.sanPhamService.getListSelect()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.sanPhamOptions = res.map((x: any) => ({
          label: x.ten,
          value: x.id
        }));
      });
  }

  addRow() {
    this.rows.push({ tenNguoiDung: '', email: '', soSao: 5, noiDung: '' });
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
        soSao: Math.floor(Math.random() * 2) + 4, // 4 hoặc 5 sao
        noiDung: this.sampleReviews[Math.floor(Math.random() * this.sampleReviews.length)]
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
    if (!this.selectedSanPhamId) {
      this.notificationService.showError('Vui lòng chọn sản phẩm');
      return;
    }

    const validRows = this.rows.filter(
      r => r.tenNguoiDung?.trim() && r.noiDung?.trim()
    );

    if (validRows.length === 0) {
      this.notificationService.showError('Vui lòng nhập ít nhất một đánh giá');
      return;
    }

    this.loading = true;

    try {
      for (const row of validRows) {
        await this.sanPhamReviewService.create({
          sanPhamId: this.selectedSanPhamId,
          tenNguoiDung: row.tenNguoiDung.trim(),
          email: row.email?.trim() || '',
          soSao: row.soSao,
          noiDung: row.noiDung.trim(),
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