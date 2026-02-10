import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateThuocTinhWithGiaTriDto {
  ten?: string;
  giaTris: string[];
}

export interface ThuocTinhDto {
  id?: string;
  ten?: string;
  giaTris: string[];
}

export interface CreateUpdateThuocTinhDto {
  ten?: string;
}

export interface ThuocTinhInListDto extends EntityDto<string> {
  ten?: string;
}
