import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CreateUpdateDanhMucCamNangDto, DanhMucCamNangDto, DanhMucCamNangInListDto } from '../cam-nangs-list/danh-muc-cam-nangs/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class DanhMucCamNangsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateDanhMucCamNangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucCamNangDto>({
      method: 'POST',
      url: '/api/app/danh-muc-cam-nangs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/danh-muc-cam-nangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/danh-muc-cam-nangs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucCamNangDto>({
      method: 'GET',
      url: `/api/app/danh-muc-cam-nangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DanhMucCamNangDto>>({
      method: 'GET',
      url: '/api/app/danh-muc-cam-nangs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucCamNangInListDto[]>({
      method: 'GET',
      url: '/api/app/danh-muc-cam-nangs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<DanhMucCamNangInListDto>>({
      method: 'GET',
      url: '/api/app/danh-muc-cam-nangs/filter',
      params: { keyword: input.keyword, sort: input.sort, danhMucSlug: input.danhMucSlug, id: input.id, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateDanhMucCamNangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, DanhMucCamNangDto>({
      method: 'PUT',
      url: `/api/app/danh-muc-cam-nangs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
