import type { IdentityUser } from '../../volo/abp/identity/models';
import type { DonHang } from '../don-hangs/models';

export interface RegisterDto {
  userName?: string;
  email?: string;
  password?: string;
  name?: string;
  phoneNumber?: string;
}

export interface TaiKhoan extends IdentityUser {
  isCustomer: boolean;
  status: boolean;
  donHangs: DonHang[];
}
