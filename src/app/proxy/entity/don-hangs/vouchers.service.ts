import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateVoucherDto, VoucherDto, VoucherInListDto } from '../don-hangs-list/vouchers/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class VouchersService {
  apiName = 'Default';
  

  create = (input: CreateUpdateVoucherDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, VoucherDto>({
      method: 'POST',
      url: '/api/app/vouchers',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/vouchers/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/vouchers/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, VoucherDto>({
      method: 'GET',
      url: `/api/app/vouchers/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<VoucherDto>>({
      method: 'GET',
      url: '/api/app/vouchers',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, VoucherInListDto[]>({
      method: 'GET',
      url: '/api/app/vouchers/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<VoucherInListDto>>({
      method: 'GET',
      url: '/api/app/vouchers/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateVoucherDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, VoucherDto>({
      method: 'PUT',
      url: `/api/app/vouchers/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
