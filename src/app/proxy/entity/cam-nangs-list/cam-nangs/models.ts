import type { EntityDto } from '@abp/ng.core';

export interface CamNangDto {
  id?: string;
  ten?: string;
  slug?: string;
  mota?: string;
  anh?: string;
  danhMucCamNangId?: string;
  trangThai: boolean;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
  creationTime?: string;
  tenDanhMuc?: string;
  slugDanhMuc?: string;
}

export interface CamNangInListDto extends EntityDto<string> {
  ten?: string;
  slug?: string;
  mota?: string;
  anh?: string;
  danhMucCamNangId?: string;
  trangThai: boolean;
  creationTime?: string;
  tenDanhMuc?: string;
}

export interface CamNangSelectDto {
  id?: string;
  ten?: string;
}

export interface CreateUpdateCamNangDto {
  ten?: string;
  slug?: string;
  mota?: string;
  anh?: string;
  danhMucCamNangId?: string;
  trangThai: boolean;
  titleSEO?: string;
  keyword?: string;
  descriptionSEO?: string;
}
