
export interface AnhSanPhamDto {
  id?: string;
  anh?: string;
  status: boolean;
  sanPhamId?: string;
}

export interface CreateUpdateAnhSanPhamDto {
  anh?: string;
  status: boolean;
  sanPhamId?: string;
}
