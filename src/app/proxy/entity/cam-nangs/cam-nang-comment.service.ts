import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { CamNangCommentDto, CamNangCommentInListDto, CreateUpdateCamNangCommentDto } from '../cam-nangs-list/cam-nang-comments/models';
import type { BaseListFilterDto } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class CamNangCommentService {
  apiName = 'Default';
  

  create = (input: CreateUpdateCamNangCommentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CamNangCommentDto>({
      method: 'POST',
      url: '/api/app/cam-nang-comment',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/cam-nang-comment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/cam-nang-comment/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CamNangCommentDto>({
      method: 'GET',
      url: `/api/app/cam-nang-comment/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CamNangCommentDto>>({
      method: 'GET',
      url: '/api/app/cam-nang-comment',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, CamNangCommentInListDto[]>({
      method: 'GET',
      url: '/api/app/cam-nang-comment/all',
    },
    { apiName: this.apiName,...config });
  

  getListByCamNang = (camNangId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CamNangCommentDto[]>({
      method: 'GET',
      url: `/api/app/cam-nang-comment/by-cam-nang/${camNangId}`,
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<CamNangCommentInListDto>>({
      method: 'GET',
      url: '/api/app/cam-nang-comment/filter',
      params: { keyword: input.keyword, sort: input.sort, danhMucSlug: input.danhMucSlug, id: input.id, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateCamNangCommentDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, CamNangCommentDto>({
      method: 'PUT',
      url: `/api/app/cam-nang-comment/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
