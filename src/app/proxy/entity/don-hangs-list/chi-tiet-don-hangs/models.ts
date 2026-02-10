
export interface ChiTietDonHangDto {
  id?: string;
  donHangId?: string;
  sanPhamId?: string;
  sanPhamBienThe?: string;
  quaTang?: string;
  soLuong: number;
  gia: number;
  giamGiaVoucher: number;
  trangThai: boolean;
}

export interface CreateUpdateChiTietDonHangDto {
  id?: string;
  donHangId?: string;
  sanPhamId?: string;
  sanPhamBienThe?: string;
  quaTang?: string;
  soLuong: number;
  gia: number;
  giamGiaVoucher: number;
  trangThai: boolean;
}
