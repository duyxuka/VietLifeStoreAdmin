import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdatePaymentInformationModelDto {
  amount?: string;
  transactionId?: string;
  paymentCode?: string;
  paymentInfor?: string;
  status?: string;
  createdDate?: string;
}

export interface PaymentInformationModelDto {
  id?: string;
  amount?: string;
  transactionId?: string;
  paymentCode?: string;
  paymentInfor?: string;
  status?: string;
  createdDate?: string;
}

export interface PaymentInformationModelInListDto extends EntityDto<string> {
  amount?: string;
  transactionId?: string;
  paymentCode?: string;
  paymentInfor?: string;
  status?: string;
  createdDate?: string;
}

export interface PaymentIPN {
  rspCode?: string;
  message?: string;
}

export interface PaymentResponseModel {
  orderDescription?: string;
  amount: number;
  transactionId?: string;
  orderId?: string;
  paymentMethod?: string;
  paymentId?: string;
  success?: string;
  token?: string;
  vnPayResponseCode?: string;
  vnPayTransitionStatus?: string;
}
