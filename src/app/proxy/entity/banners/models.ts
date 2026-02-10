import type { EntityDto } from '@abp/ng.core';

export interface BannerDto {
  id?: string;
  tieuDe?: string;
  moTa?: string;
  anh?: string;
  lienKet?: string;
  trangThai: boolean;
}

export interface BannerInListDto extends EntityDto<string> {
  tieuDe?: string;
  moTa?: string;
  anh?: string;
  lienKet?: string;
  trangThai: boolean;
  anhName?: string;
  anhContent?: string;
}

export interface CreateUpdateBannerDto {
  tieuDe?: string;
  moTa?: string;
  anh?: string;
  lienKet?: string;
  trangThai: boolean;
  anhName?: string;
  anhContent?: string;
}
