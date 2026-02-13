import { RestService, Rest } from '@abp/ng.core';
import type { PagedResultDto, PagedResultRequestDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { BaseListFilterDto } from '../../models';
import type { CreateUpdateGiaTriThuocTinhDto, GiaTriThuocTinhDto, GiaTriThuocTinhInListDto } from '../san-phams-list/gia-tri-thuoc-tinhs/models';

@Injectable({
  providedIn: 'root',
})
export class GiaTriThuocTinhsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateGiaTriThuocTinhDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GiaTriThuocTinhDto>({
      method: 'POST',
      url: '/api/app/gia-tri-thuoc-tinhs',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/gia-tri-thuoc-tinhs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteMultiple = (ids: string[], config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/gia-tri-thuoc-tinhs/multiple',
      params: { ids },
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GiaTriThuocTinhDto>({
      method: 'GET',
      url: `/api/app/gia-tri-thuoc-tinhs/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<GiaTriThuocTinhDto>>({
      method: 'GET',
      url: '/api/app/gia-tri-thuoc-tinhs',
      params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getListAll = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, GiaTriThuocTinhInListDto[]>({
      method: 'GET',
      url: '/api/app/gia-tri-thuoc-tinhs/all',
    },
    { apiName: this.apiName,...config });
  

  getListFilter = (input: BaseListFilterDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<GiaTriThuocTinhInListDto>>({
      method: 'GET',
      url: '/api/app/gia-tri-thuoc-tinhs/filter',
      params: { keyword: input.keyword, sort: input.sort, danhMucSlug: input.danhMucSlug, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateGiaTriThuocTinhDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, GiaTriThuocTinhDto>({
      method: 'PUT',
      url: `/api/app/gia-tri-thuoc-tinhs/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
