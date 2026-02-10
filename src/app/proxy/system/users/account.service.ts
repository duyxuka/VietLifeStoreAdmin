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

  constructor(private restService: RestService) {}
}
