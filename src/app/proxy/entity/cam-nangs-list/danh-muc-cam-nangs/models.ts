import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateDanhMucCamNangDto {
  ten?: string;
  slug?: string;
  trangThai: boolean;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
}

export interface DanhMucCamNangDto {
  id?: string;
  ten?: string;
  slug?: string;
  trangThai: boolean;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
}

export interface DanhMucCamNangInListDto extends EntityDto<string> {
  ten?: string;
  slug?: string;
  trangThai: boolean;
}
