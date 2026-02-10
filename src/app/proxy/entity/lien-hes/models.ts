import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateLienHeDto {
  hoTen?: string;
  email?: string;
  soDienThoai?: string;
  noiDung?: string;
  daXuLy: boolean;
}

export interface LienHeDto {
  id?: string;
  hoTen?: string;
  email?: string;
  soDienThoai?: string;
  noiDung?: string;
  daXuLy: boolean;
}

export interface LienHeInListDto extends EntityDto<string> {
  hoTen?: string;
  email?: string;
  soDienThoai?: string;
  noiDung?: string;
  daXuLy: boolean;
}
