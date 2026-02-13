import type { CreateUpdateThuocTinhWithGiaTriDto, ThuocTinhDto } from '../thuoc-tinhs/models';
import type { CreateUpdateSanPhamBienTheDto, SanPhamBienTheDto } from '../san-pham-bien-thes/models';
import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateSanPhamDto {
  ten?: string;
  slug?: string;
  moTaNgan?: string;
  moTa?: string;
  huongDanSuDung?: string;
  thongSoKyThuat?: string;
  gia: number;
  giaKhuyenMai: number;
  danhMucId?: string;
  quaTangId?: string;
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
  thuocTinhs: CreateUpdateThuocTinhWithGiaTriDto[];
  bienThes: CreateUpdateSanPhamBienTheDto[];
  anhPhu: string[];
  anhPhuGiuLai: string[];
  phanTramKhuyenMai?: number;
}

export interface SanPhamDto {
  id?: string;
  ten?: string;
  slug?: string;
  moTaNgan?: string;
  moTa?: string;
  huongDanSuDung?: string;
  thongSoKyThuat?: string;
  gia: number;
  giaKhuyenMai: number;
  danhMucId?: string;
  quaTangId?: string;
  anh?: string;
  thuTu: number;
  luotXem: number;
  luotMua: number;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
  trangThai: boolean;
  jobId?: string;
  laDatLich: boolean;
  thoiHanBatDau?: string;
  thoiHanKetThuc?: string;
  phanTramGiamGia?: number;
  thuocTinhs: ThuocTinhDto[];
  anhPhu: string[];
  bienThes: SanPhamBienTheDto[];
}

export interface SanPhamInListDto extends EntityDto<string> {
  ten?: string;
  gia: number;
  giaKhuyenMai: number;
  danhMucId?: string;
  anh?: string;
  slug?: string;
  moTaNgan?: string;
  trangThai: boolean;
  laDatLich: boolean;
  thoiHanBatDau?: string;
  thoiHanKetThuc?: string;
  phanTramGiamGia?: number;
  soLuongDaBan?: number;
}
