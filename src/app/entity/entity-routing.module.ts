import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SanphamComponent } from "./sanphamlist/sanpham/sanpham.component";
import { permissionGuard } from "@abp/ng.core";
import { DanhmucsanphamComponent } from "./sanphamlist/danhmucsanpham/danhmucsanpham.component";
import { QuatangComponent } from "./sanphamlist/quatang/quatang.component";
import { BannerComponent } from "./banner/banner.component";
import { DanhmuccamnangComponent } from "./camnanglist/danhmuccamnang/danhmuccamnang.component";
import { CamnangComponent } from "./camnanglist/camnang/camnang.component";
import { DanhmucchinhsachComponent } from "./chinhsachlist/danhmucchinhsach/danhmucchinhsach.component";
import { ChinhsachComponent } from "./chinhsachlist/chinhsach/chinhsach.component";
import { DonhangComponent } from "./donhanglist/donhang/donhang.component";
import { VoucherComponent } from "./donhanglist/voucher/voucher.component";
import { LienheComponent } from "./lienhe/lienhe.component";

const routes: Routes = [
  {
    path: 'sanpham',
    component: SanphamComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.SanPham.View',
    // },
  },
  {
    path: 'danhmucsanpham',
    component: DanhmucsanphamComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.DanhMucSanPham.View',
    // },
  },
  {
    path: 'quatang',
    component: QuatangComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.QuaTang.View',
    // },
  },
  {
    path: 'banner',
    component: BannerComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.Banner.View',
    // },
  },
  {
    path: 'danhmuccamnang',
    component: DanhmuccamnangComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.DanhMucCamNang.View',
    // },
  },
  {
    path: 'camnang',
    component: CamnangComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.CamNang.View',
    // },
  },
  {
    path: 'danhmucchinhsach',
    component: DanhmucchinhsachComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.DanhMucChinhSach.View',
    // },
  },
  {
    path: 'chinhsach',
    component: ChinhsachComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.ChinhSach.View',
    // },
  },
  {
    path: 'donhang',
    component: DonhangComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.DonHang.View',
    // },
  },
  {
    path: 'voucher',
    component: VoucherComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.Voucher.View',
    // },
  },
  {
    path: 'lienhe',
    component: LienheComponent,
    // canActivate: [permissionGuard],
    // data: {
    //   requiredPolicy: 'VietLifeStore.LienHe.View',
    // },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntityRoutingModule { }