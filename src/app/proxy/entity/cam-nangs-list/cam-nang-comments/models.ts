import type { EntityDto } from '@abp/ng.core';

export interface CamNangCommentDto {
  id?: string;
  camNangId?: string;
  tenNguoiDung?: string;
  email?: string;
  noiDung?: string;
  parentId?: string;
  trangThai: boolean;
  creationTime?: string;
  replies: CamNangCommentDto[];
}

export interface CamNangCommentInListDto extends EntityDto<string> {
  camNangId?: string;
  tenNguoiDung?: string;
  email?: string;
  noiDung?: string;
  parentId?: string;
  trangThai: boolean;
  camNangTen?: string;
  creationTime?: string;
}

export interface CreateUpdateCamNangCommentDto {
  camNangId?: string;
  tenNguoiDung?: string;
  email?: string;
  noiDung?: string;
  parentId?: string;
}
