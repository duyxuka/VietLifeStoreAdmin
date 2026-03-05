import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { RegisterDto } from '../../entity/tai-khoans/models';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  apiName = 'Default';
  

  register = (input: RegisterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: '/api/app/account/register',
      body: input,
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

  constructor(private restService: RestService) {}
}
