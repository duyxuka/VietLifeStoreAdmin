import type { AuditedEntityDto } from '@abp/ng.core';

export interface AccountAppService_ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface AccountAppService_UpdateProfileDto {
  name: string;
  phoneNumber?: string;
}

export interface CreateUserDto {
  name?: string;
  surname?: string;
  email?: string;
  userName?: string;
  password?: string;
  phoneNumber?: string;
  isCustomer: boolean;
  status: boolean;
}

export interface SetPasswordDto {
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface UpdateUserDto {
  name?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  isCustomer: boolean;
  status: boolean;
}

export interface UserDto extends AuditedEntityDto<string> {
  id?: string;
  name?: string;
  userName?: string;
  email?: string;
  surname?: string;
  phoneNumber?: string;
  roles: string[];
  isActive: boolean;
  isCustomer: boolean;
  status: boolean;
}

export interface UserInListDto extends AuditedEntityDto<string> {
  name?: string;
  surname?: string;
  email?: string;
  userName?: string;
  phoneNumber?: string;
  isCustomer: boolean;
  status: boolean;
}
