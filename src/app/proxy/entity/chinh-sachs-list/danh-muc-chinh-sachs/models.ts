import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateDanhMucChinhSachDto {
  ten?: string;
  slug?: string;
  trangThai: boolean;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
}

export interface DanhMucChinhSachDto {
  id?: string;
  ten?: string;
  slug?: string;
  trangThai: boolean;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
}

export interface DanhMucChinhSachInListDto extends EntityDto<string> {
  ten?: string;
  slug?: string;
  trangThai: boolean;
}
