import type { EntityDto } from '@abp/ng.core';

export interface ChinhSachDto {
  id?: string;
  tieuDe?: string;
  noiDung?: string;
  trangThai: boolean;
  danhMucChinhSachId?: string;
}

export interface ChinhSachInListDto extends EntityDto<string> {
  tieuDe?: string;
  noiDung?: string;
  trangThai: boolean;
  danhMucChinhSachId?: string;
}

export interface CreateUpdateChinhSachDto {
  tieuDe?: string;
  noiDung?: string;
  trangThai: boolean;
  danhMucChinhSachId?: string;
}
