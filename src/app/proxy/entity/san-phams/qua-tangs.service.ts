import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateQuaTangDto, QuaTangDto, QuaTangInListDto } from '../san-phams-list/qua-tangs/models';

@Injectable({
  providedIn: 'root',
})
export class QuaTangsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateQuaTangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuaTangDto>({
      method: 'POST',
      url: '/api/app/qua-tangs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/qua-tangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/qua-tangs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuaTangDto>({
      method: 'GET',
      url: `/api/app/qua-tangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuaTangDto>>({
      method: 'GET',
      url: '/api/app/qua-tangs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuaTangInListDto[]>({
      method: 'GET',
      url: '/api/app/qua-tangs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<QuaTangInListDto>>({
      method: 'GET',
      url: '/api/app/qua-tangs/filter',
      params: { keyword: input.keyword, sort: input.sort, danhMucSlug: input.danhMucSlug, id: input.id, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateQuaTangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, QuaTangDto>({
      method: 'PUT',
      url: `/api/app/qua-tangs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
