import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { ChinhSachDto, ChinhSachInListDto, CreateUpdateChinhSachDto } from '../chinh-sachs-list/chinh-sachs/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ChinhSachsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateChinhSachDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChinhSachDto>({
      method: 'POST',
      url: '/api/app/chinh-sachs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/chinh-sachs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/chinh-sachs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChinhSachDto>({
      method: 'GET',
      url: `/api/app/chinh-sachs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChinhSachDto>>({
      method: 'GET',
      url: '/api/app/chinh-sachs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChinhSachInListDto[]>({
      method: 'GET',
      url: '/api/app/chinh-sachs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ChinhSachInListDto>>({
      method: 'GET',
      url: '/api/app/chinh-sachs/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateChinhSachDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ChinhSachDto>({
      method: 'PUT',
      url: `/api/app/chinh-sachs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
