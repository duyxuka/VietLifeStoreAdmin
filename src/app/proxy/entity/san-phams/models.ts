import type { FullAuditedAggregateRoot, FullAuditedEntity } from '../../volo/abp/domain/entities/auditing/models';
import type { Entity } from '../../volo/abp/domain/entities/models';

export interface AnhSanPham extends FullAuditedAggregateRoot<string> {
  anh?: string;
  status: boolean;
  sanPhamId?: string;
  sanPham: SanPham;
}

export interface DanhMucSanPham extends FullAuditedAggregateRoot<string> {
  ten?: string;
  slug?: string;
  anhThumbnail?: string;
  anhBanner?: string;
  trangThai: boolean;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
  sanPhams: SanPham[];
}

export interface GiaTriThuocTinh extends Entity {
  thuocTinhId?: string;
  thuocTinh: ThuocTinh;
  giaTri?: string;
}

export interface QuaTang extends FullAuditedAggregateRoot<string> {
  ten?: string;
  gia: number;
  trangThai: boolean;
  sanPhams: SanPham[];
}

export interface SanPham extends FullAuditedAggregateRoot<string> {
  ten?: string;
  slug?: string;
  moTaNgan?: string;
  moTa?: string;
  huongDanSuDung?: string;
  thongSoKyThuat?: string;
  gia: number;
  giaKhuyenMai: number;
  danhMucId?: string;
  danhMucSanPham: DanhMucSanPham;
  quaTangId?: string;
  quaTang: QuaTang;
  anh?: string;
  thuTu?: number;
  luotXem?: number;
  luotMua?: number;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
  trangThai: boolean;
  jobId?: string;
  laDatLich: boolean;
  thoiHanBatDau?: string;
  thoiHanKetThuc?: string;
  sanPhamBienThes: SanPhamBienThe[];
  anhSanPham: AnhSanPham[];
  reviews: SanPhamReview[];
}

export interface SanPhamBienThe extends Entity {
  sanPhamId?: string;
  sanPham: SanPham;
  ten?: string;
  gia: number;
  giaKhuyenMai?: number;
  thuocTinhs: SanPhamBienTheThuocTinh[];
}

export interface SanPhamBienTheThuocTinh extends Entity {
  sanPhamBienTheId?: string;
  sanPhamBienThe: SanPhamBienThe;
  giaTriThuocTinhId?: string;
  giaTriThuocTinh: GiaTriThuocTinh;
}

export interface SanPhamReview extends FullAuditedAggregateRoot<string> {
  sanPhamId?: string;
  userId?: string;
  tenNguoiDung?: string;
  email?: string;
  soSao: number;
  noiDung?: string;
  trangThai: boolean;
  sanPham: SanPham;
}

export interface ThuocTinh extends FullAuditedEntity<string> {
  ten?: string;
}
