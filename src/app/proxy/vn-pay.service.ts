import type { DonHang } from './entity/don-hangs/models';
import type { PaymentIPN, PaymentResponseModel } from './entity/payments/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class VnPayService {
  apiName = 'Default';
  

  createPaymentUrlByModel = (model: DonHang, config?: Partial<Rest.Config>) =>
    this.restService.request<any, string>({
      method: 'POST',
      responseType: 'text',
      url: '/api/app/vn-pay/payment-url',
      body: model,
    },
    { apiName: this.apiName,...config });
  

  paymentExecuteByCollections = (collections: any<string, StringValues>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentResponseModel>({
      method: 'POST',
      url: '/api/app/vn-pay/payment-execute',
      body: collections,
    },
    { apiName: this.apiName,...config });
  

  responsepayByCollections = (collections: any<string, StringValues>, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PaymentIPN>({
      method: 'POST',
      url: '/api/app/vn-pay/responsepay',
      body: collections,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
