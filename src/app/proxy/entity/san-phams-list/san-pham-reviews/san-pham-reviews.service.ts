import type { CreateUpdateSanPhamReviewDto, SanPhamReviewDto, SanPhamReviewInListDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../../models';

@Injectable({
  providedIn: 'root',
})
export class SanPhamReviewsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateSanPhamReviewDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamReviewDto>({
      method: 'POST',
      url: '/api/app/san-pham-reviews',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/san-pham-reviews/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/san-pham-reviews/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamReviewDto>({
      method: 'GET',
      url: `/api/app/san-pham-reviews/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getBySanPham = (sanPhamId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamReviewInListDto[]>({
      method: 'GET',
      url: `/api/app/san-pham-reviews/by-san-pham/${sanPhamId}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SanPhamReviewDto>>({
      method: 'GET',
      url: '/api/app/san-pham-reviews',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamReviewInListDto[]>({
      method: 'GET',
      url: '/api/app/san-pham-reviews/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<SanPhamReviewInListDto>>({
      method: 'GET',
      url: '/api/app/san-pham-reviews/filter',
      params: { keyword: input.keyword, sort: input.sort, danhMucSlug: input.danhMucSlug, id: input.id, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateSanPhamReviewDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, SanPhamReviewDto>({
      method: 'PUT',
      url: `/api/app/san-pham-reviews/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
