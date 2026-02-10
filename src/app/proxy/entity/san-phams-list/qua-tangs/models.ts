import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateQuaTangDto {
  ten?: string;
  gia: number;
  trangThai: boolean;
}

export interface QuaTangDto {
  id?: string;
  ten?: string;
  gia: number;
  trangThai: boolean;
}

export interface QuaTangInListDto extends EntityDto<string> {
  ten?: string;
  gia: number;
  trangThai: boolean;
}
