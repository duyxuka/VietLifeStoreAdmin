import type { CamNangDto, CamNangInListDto, CreateUpdateCamNangDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../../models';

@Injectable({
  providedIn: 'root',
})
export class CamNangsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCamNangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CamNangDto>({
      method: 'POST',
      url: '/api/app/cam-nangs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/cam-nangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/cam-nangs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CamNangDto>({
      method: 'GET',
      url: `/api/app/cam-nangs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getLatestCamNangHome = (take: number = 4, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CamNangInListDto[]>({
      method: 'GET',
      url: '/api/app/cam-nangs/latest-cam-nang-home',
      params: { take },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CamNangDto>>({
      method: 'GET',
      url: '/api/app/cam-nangs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CamNangInListDto[]>({
      method: 'GET',
      url: '/api/app/cam-nangs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CamNangInListDto>>({
      method: 'GET',
      url: '/api/app/cam-nangs/filter',
      params: { keyword: input.keyword, sort: input.sort, danhMucSlug: input.danhMucSlug, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCamNangDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CamNangDto>({
      method: 'PUT',
      url: `/api/app/cam-nangs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
