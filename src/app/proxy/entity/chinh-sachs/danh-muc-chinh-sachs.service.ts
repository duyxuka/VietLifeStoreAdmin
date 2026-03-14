import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateDanhMucChinhSachDto, DanhMucChinhSachDto, DanhMucChinhSachInListDto } from '../chinh-sachs-list/danh-muc-chinh-sachs/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DanhMucChinhSachsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateDanhMucChinhSachDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucChinhSachDto>({
      method: 'POST',
      url: '/api/app/danh-muc-chinh-sachs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/danh-muc-chinh-sachs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/danh-muc-chinh-sachs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucChinhSachDto>({
      method: 'GET',
      url: `/api/app/danh-muc-chinh-sachs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DanhMucChinhSachDto>>({
      method: 'GET',
      url: '/api/app/danh-muc-chinh-sachs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucChinhSachInListDto[]>({
      method: 'GET',
      url: '/api/app/danh-muc-chinh-sachs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DanhMucChinhSachInListDto>>({
      method: 'GET',
      url: '/api/app/danh-muc-chinh-sachs/filter',
      params: { keyword: input.keyword, sort: input.sort, danhMucSlug: input.danhMucSlug, id: input.id, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDanhMucChinhSachDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucChinhSachDto>({
      method: 'PUT',
      url: `/api/app/danh-muc-chinh-sachs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
