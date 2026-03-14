import type { SanPham } from '../../san-phams/models';
import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateSanPhamReviewDto {
  sanPhamId?: string;
  soSao: number;
  noiDung?: string;
  userId?: string;
  tenNguoiDung?: string;
  email?: string;
}

export interface SanPhamReviewDto {
  id?: string;
  sanPhamId?: string;
  userId?: string;
  tenNguoiDung?: string;
  email?: string;
  soSao: number;
  noiDung?: string;
  trangThai: boolean;
  sanPham: SanPham;
}

export interface SanPhamReviewInListDto extends EntityDto<string> {
  sanPhamId?: string;
  userId?: string;
  tenNguoiDung?: string;
  email?: string;
  soSao: number;
  noiDung?: string;
  trangThai: boolean;
  creationTime?: string;
  tenSanPham?: string;
}
