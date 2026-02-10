import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateDanhMucSanPhamDto, DanhMucSanPhamDto, DanhMucSanPhamInListDto } from '../san-phams-list/danh-muc-san-phams/models';

@Injectable({
  providedIn: 'root',
})
export class DanhMucSanPhamsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateDanhMucSanPhamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucSanPhamDto>({
      method: 'POST',
      url: '/api/app/danh-muc-san-phams',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/danh-muc-san-phams/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/danh-muc-san-phams/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucSanPhamDto>({
      method: 'GET',
      url: `/api/app/danh-muc-san-phams/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getImage = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/danh-muc-san-phams/image',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DanhMucSanPhamDto>>({
      method: 'GET',
      url: '/api/app/danh-muc-san-phams',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucSanPhamInListDto[]>({
      method: 'GET',
      url: '/api/app/danh-muc-san-phams/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DanhMucSanPhamInListDto>>({
      method: 'GET',
      url: '/api/app/danh-muc-san-phams/filter',
      params: { keyword: input.keyword, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDanhMucSanPhamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucSanPhamDto>({
      method: 'PUT',
      url: `/api/app/danh-muc-san-phams/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
