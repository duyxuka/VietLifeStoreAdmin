import type { Entity } from '../../volo/abp/domain/entities/models';
import type { SanPham } from '../san-phams/models';
import type { FullAuditedAggregateRoot } from '../../volo/abp/domain/entities/auditing/models';
import type { TaiKhoan } from '../tai-khoans/models';

export interface ChiTietDonHang extends Entity {
  donHangId?: string;
  donHang: DonHang;
  sanPhamId?: string;
  sanPham: SanPham;
  sanPhamBienThe?: string;
  quaTang?: string;
  soLuong: number;
  gia: number;
  trangThai: boolean;
}

export interface DonHang extends FullAuditedAggregateRoot<string> {
  taiKhoanKhachHangId?: string;
  taiKhoanKhachHang: TaiKhoan;
  ten?: string;
  ma?: string;
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
  chiTietDonHangs: ChiTietDonHang[];
}
