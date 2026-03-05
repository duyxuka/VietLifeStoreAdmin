import type { UploadResultDto } from './models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { IFormFile } from '../../microsoft/asp-net-core/http/models';
import type { IActionResult } from '../../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  apiName = 'Default';
  

  delete = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/media',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  get = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, Blob>({
      method: 'GET',
      responseType: 'blob',
      url: '/api/app/media',
      params: { fileName },
    },
    { apiName: this.apiName,...config });
  

  getFile = (fileName: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: `/files/${fileName}`,
    },
    { apiName: this.apiName,...config });
  

  upload = (file: IFormFile, config?: Partial<Rest.Config>) =>
    this.restService.request<any, UploadResultDto>({
      method: 'POST',
      url: '/api/app/media/upload',
      body: file,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
