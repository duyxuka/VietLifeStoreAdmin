import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateSanPhamDto, SanPhamDto, SanPhamInListDto } from '../san-phams-list/san-phams/models';

@Injectable({
  providedIn: 'root',
})
export class SanPhamsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateSanPhamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamDto>({
      method: 'POST',
      url: '/api/app/san-phams',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/san-phams/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/san-phams/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamDto>({
      method: 'GET',
      url: `/api/app/san-phams/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByDanhMuc = (danhMucId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamInListDto[]>({
      method: 'GET',
      url: `/api/app/san-phams/by-danh-muc/${danhMucId}`,
    },
    { apiName: this.apiName,...config });
  

  getImage = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/san-phams/image',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SanPhamDto>>({
      method: 'GET',
      url: '/api/app/san-phams',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamInListDto[]>({
      method: 'GET',
      url: '/api/app/san-phams/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SanPhamInListDto>>({
      method: 'GET',
      url: '/api/app/san-phams/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getThumbnail = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/san-phams/thumbnail',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSanPhamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamDto>({
      method: 'PUT',
      url: `/api/app/san-phams/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
