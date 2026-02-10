import type { CreateUpdateLienHeDto, LienHeDto, LienHeInListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class LienHesService {
  apiName = 'Default';
  

  create = (input: CreateUpdateLienHeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LienHeDto>({
      method: 'POST',
      url: '/api/app/lien-hes',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/lien-hes/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/lien-hes/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LienHeDto>({
      method: 'GET',
      url: `/api/app/lien-hes/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LienHeDto>>({
      method: 'GET',
      url: '/api/app/lien-hes',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, LienHeInListDto[]>({
      method: 'GET',
      url: '/api/app/lien-hes/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<LienHeInListDto>>({
      method: 'GET',
      url: '/api/app/lien-hes/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  markAsProcessed = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/lien-hes/${id}/mark-as-processed`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateLienHeDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, LienHeDto>({
      method: 'PUT',
      url: `/api/app/lien-hes/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
