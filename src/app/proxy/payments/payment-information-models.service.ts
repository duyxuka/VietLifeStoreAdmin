import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdatePaymentInformationModelDto, PaymentInformationModelDto, PaymentInformationModelInListDto } from '../entity/payments/models';
import type { BaseListFilterDto } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PaymentInformationModelsService {
  apiName = 'Default';
  

  create = (input: CreateUpdatePaymentInformationModelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentInformationModelDto>({
      method: 'POST',
      url: '/api/app/payment-information-models',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/payment-information-models/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/payment-information-models/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentInformationModelDto>({
      method: 'GET',
      url: `/api/app/payment-information-models/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PaymentInformationModelDto>>({
      method: 'GET',
      url: '/api/app/payment-information-models',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentInformationModelInListDto[]>({
      method: 'GET',
      url: '/api/app/payment-information-models/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<PaymentInformationModelInListDto>>({
      method: 'GET',
      url: '/api/app/payment-information-models/filter',
      params: { keyword: input.keyword, sort: input.sort, danhMucSlug: input.danhMucSlug, id: input.id, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdatePaymentInformationModelDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentInformationModelDto>({
      method: 'PUT',
      url: `/api/app/payment-information-models/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
