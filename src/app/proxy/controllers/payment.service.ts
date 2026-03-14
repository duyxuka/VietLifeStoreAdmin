import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';
import type { IActionResult } from '../microsoft/asp-net-core/mvc/models';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  apiName = 'Default';
  

  createPaymentUrlByOrderId = (orderId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'POST',
      url: '/api/payment/create-url',
      params: { orderId },
    },
    { apiName: this.apiName,...config });
  

  paymentCallback = (config?: Partial<Rest.Config>) =>
    this.restService.request<any, IActionResult>({
      method: 'GET',
      url: '/api/payment/callback',
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
