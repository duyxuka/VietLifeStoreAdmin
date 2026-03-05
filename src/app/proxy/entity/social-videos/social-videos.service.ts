import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateSocialVideoDto, SocialVideoDto, SocialVideoInListDto } from '../videoplatform/models';

@Injectable({
  providedIn: 'root',
})
export class SocialVideosService {
  apiName = 'Default';
  

  create = (input: CreateUpdateSocialVideoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SocialVideoDto>({
      method: 'POST',
      url: '/api/app/social-videos',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/social-videos/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/social-videos/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SocialVideoDto>({
      method: 'GET',
      url: `/api/app/social-videos/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SocialVideoDto>>({
      method: 'GET',
      url: '/api/app/social-videos',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SocialVideoInListDto[]>({
      method: 'GET',
      url: '/api/app/social-videos/all',
    },
    { apiName: this.apiName,...config });
  

  getListBySection = (section: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SocialVideoInListDto[]>({
      method: 'GET',
      url: '/api/app/social-videos/by-section',
      params: { section },
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SocialVideoInListDto>>({
      method: 'GET',
      url: '/api/app/social-videos/filter',
      params: { keyword: input.keyword, sort: input.sort, danhMucSlug: input.danhMucSlug, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSocialVideoDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SocialVideoDto>({
      method: 'PUT',
      url: `/api/app/social-videos/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
