import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { AnhSanPhamDto, CreateUpdateAnhSanPhamDto } from '../san-phams-list/anh-san-phams/models';

@Injectable({
  providedIn: 'root',
})
export class AnhSanPhamsService {
  apiName = 'Default';
  

  create = (input: CreateUpdateAnhSanPhamDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AnhSanPhamDto>({
      method: 'POST',
      url: '/api/app/anh-san-phams',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/anh-san-phams/${id}`,
    },
    { apiName: this.apiName,...config });
  

  deleteBySanPham = (sanPhamId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/anh-san-phams/by-san-pham/${sanPhamId}`,
    },
    { apiName: this.apiName,...config });
  

  getImage = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'GET',
      responseType: 'text',
      url: '/api/app/anh-san-phams/image',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  getListBySanPham = (sanPhamId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, AnhSanPhamDto[]>({
      method: 'GET',
      url: `/api/app/anh-san-phams/by-san-pham/${sanPhamId}`,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
