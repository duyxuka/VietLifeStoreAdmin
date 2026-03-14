import type { ChiTietDonHangDto, CreateUpdateChiTietDonHangDto } from '../chi-tiet-don-hangs/models';
import type { EntityDto } from '@abp/ng.core';

export interface CreateUpdateDonHangDto {
  taiKhoanKhachHangId?: string;
  ten?: string;
  ma?: string;
  diaChi?: string;
  email?: string;
  soDienThoai?: string;
  ghiChu?: string;
  phuongThucThanhToan?: string;
  tongSoLuong: number;
  tongTien: number;
  trangThai: number;
  giamGiaVoucher?: number;
  ngayDat?: string;
  voucherId?: string;
  chiTietDonHangs: CreateUpdateChiTietDonHangDto[];
}

export interface DonHangDto {
  id?: string;
  taiKhoanKhachHangId?: string;
  ma?: string;
  ten?: string;
  diaChi?: string;
  email?: string;
  soDienThoai?: string;
  ghiChu?: string;
  phuongThucThanhToan?: string;
  tongSoLuong: number;
  tongTien: number;
  giamGiaVoucher?: number;
  trangThai: number;
  ngayDat?: string;
  chiTietDonHangDtos: ChiTietDonHangDto[];
}

export interface DonHangInListDto extends EntityDto<string> {
  ten?: string;
  ma?: string;
  email?: string;
  soDienThoai?: string;
  phuongThucThanhToan?: string;
  tongSoLuong: number;
  tongTien: number;
  trangThai: number;
  ngayDat?: string;
  chiTietDonHangDtos: ChiTietDonHangDto[];
}
