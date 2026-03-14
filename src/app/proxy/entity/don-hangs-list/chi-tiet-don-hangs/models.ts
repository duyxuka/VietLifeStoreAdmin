
export interface ChiTietDonHangDto {
  id?: string;
  donHangId?: string;
  sanPhamId?: string;
  sanPhamBienThe?: string;
  tenSanPham?: string;
  quaTang?: string;
  soLuong: number;
  gia: number;
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
  trangThai: boolean;
}
