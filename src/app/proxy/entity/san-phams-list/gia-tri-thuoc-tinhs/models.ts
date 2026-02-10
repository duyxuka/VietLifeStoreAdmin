import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateGiaTriThuocTinhDto {
  thuocTinhId?: string;
  giaTri?: string;
}

export interface GiaTriThuocTinhDto {
  id?: string;
  thuocTinhId?: string;
  giaTri?: string;
}

export interface GiaTriThuocTinhInListDto extends EntityDto<string> {
  thuocTinhId?: string;
  giaTri?: string;
}
