import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateVoucherDto {
  maVoucher?: string;
  giamGia: number;
  laPhanTram: boolean;
  jobId?: string;
  donHangToiThieu: number;
  thoiHanBatDau?: string;
  thoiHanKetThuc?: string;
  soLuong: number;
  laDatLich: boolean;
  trangThai: boolean;
}

export interface VoucherDto {
  id?: string;
  maVoucher?: string;
  giamGia: number;
  laPhanTram: boolean;
  jobId?: string;
  donHangToiThieu: number;
  thoiHanBatDau?: string;
  thoiHanKetThuc?: string;
  soLuong: number;
  laDatLich: boolean;
  trangThai: boolean;
}

export interface VoucherInListDto extends EntityDto<string> {
  maVoucher?: string;
  giamGia: number;
  laPhanTram: boolean;
  donHangToiThieu: number;
  thoiHanBatDau?: string;
  thoiHanKetThuc?: string;
  soLuong: number;
  laDatLich: boolean;
  trangThai: boolean;
}
