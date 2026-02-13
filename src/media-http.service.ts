import { UploadResultDto } from "@/proxy/entity/upload-file";
import { RestService } from "@abp/ng.core";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class MediaHttpService {

  constructor(private restService: RestService) { }

  upload(file: File): Observable<UploadResultDto> {
    const formData = new FormData();
    formData.append('file', file);

    return this.restService.request<any, UploadResultDto>({ 
      method: 'POST',
      url: '/api/app/media/upload',
      body: formData,
    });
  }

  get(fileName: string): Observable<Blob> {
    return this.restService.request<any, Blob>({
      method: 'GET',
      url: '/api/app/media',
      params: { fileName },
      responseType: 'blob'
    });
  }

  delete(fileName: string): Observable<void> {
    return this.restService.request<any, void>({
      method: 'DELETE',
      url: '/api/app/media',
      params: { fileName }
    });
  }
}