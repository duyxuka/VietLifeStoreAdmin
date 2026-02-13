import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateThuocTinhDto, ThuocTinhDto, ThuocTinhInListDto } from '../san-phams-list/thuoc-tinhs/models';

@Injectable({
  providedIn: 'root',
})
export class ThuocTinhsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateThuocTinhDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThuocTinhDto>({
      method: 'POST',
      url: '/api/app/thuoc-tinhs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/thuoc-tinhs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/thuoc-tinhs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThuocTinhDto>({
      method: 'GET',
      url: `/api/app/thuoc-tinhs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ThuocTinhDto>>({
      method: 'GET',
      url: '/api/app/thuoc-tinhs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThuocTinhInListDto[]>({
      method: 'GET',
      url: '/api/app/thuoc-tinhs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<ThuocTinhInListDto>>({
      method: 'GET',
      url: '/api/app/thuoc-tinhs/filter',
      params: { keyword: input.keyword, sort: input.sort, danhMucSlug: input.danhMucSlug, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateThuocTinhDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, ThuocTinhDto>({
      method: 'PUT',
      url: `/api/app/thuoc-tinhs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
