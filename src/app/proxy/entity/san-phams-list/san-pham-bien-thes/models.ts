import type { SanPhamBienTheThuocTinhDto } from '../san-pham-bien-the-thuoc-tinhs/models';

export interface CreateUpdateSanPhamBienTheDto {
  sanPhamId?: string;
  gia: number;
  ten?: string;
  giaKhuyenMai?: number;
  sanPhamBienTheThuocTinhDtos: SanPhamBienTheThuocTinhDto[];
}

export interface SanPhamBienTheDto {
  id?: string;
  sanPhamId?: string;
  ten?: string;
  gia: number;
  giaKhuyenMai?: number;
  sanPhamBienTheThuocTinhDtos: SanPhamBienTheThuocTinhDto[];
}
