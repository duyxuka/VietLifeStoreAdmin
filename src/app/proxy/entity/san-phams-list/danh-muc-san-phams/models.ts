import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateDanhMucSanPhamDto {
  ten?: string;
  slug?: string;
  anhThumbnail?: string;
  anhBanner?: string;
  trangThai: boolean;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
}

export interface DanhMucSanPhamDto {
  id?: string;
  ten?: string;
  slug?: string;
  anhThumbnail?: string;
  anhBanner?: string;
  trangThai: boolean;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
}

export interface DanhMucSanPhamInListDto extends EntityDto<string> {
  ten?: string;
  slug?: string;
  anhThumbnail?: string;
  anhBanner?: string;
  trangThai: boolean;
  soLuongSanPham: number;
}
