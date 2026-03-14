import type { AccountAppService_ChangePasswordDto, AccountAppService_UpdateProfileDto, UserDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { RegisterDto } from '../../entity/tai-khoans/models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  apiName = 'Default';
  

  changePassword = (input: AccountAppService_ChangePasswordDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/account/change-password',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  forgotPassword = (email: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/account/forgot-password',
      params: { email },
    },
    { apiName: this.apiName,...config });
  

  getProfile = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserDto>({
      method: 'GET',
      url: '/api/app/account/profile',
    },
    { apiName: this.apiName,...config });
  

  register = (input: RegisterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/account/register',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  resetPassword = (userId: string, token: string, newPassword: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/account/reset-password/${userId}`,
      params: { token, newPassword },
    },
    { apiName: this.apiName,...config });
  

  resolveUserName = (emailOrPhone: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/account/resolve-user-name',
      params: { emailOrPhone },
    },
    { apiName: this.apiName,...config });
  

  updateProfile = (input: AccountAppService_UpdateProfileDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UserDto>({
      method: 'POST',
      url: '/api/app/account/update-profile',
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
