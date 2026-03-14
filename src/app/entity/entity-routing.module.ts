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
import { VideoplatformComponent } from "./videoplatform/videoplatform.component";
import { DonhangvnpayCompoment } from "./donhanglist/donhangvnpay/donhangvnpay.compoment";
import { BinhluanbaivietComponent } from "./camnanglist/binhluanbaiviet/binhluanbaiviet.compoment";
import { SanphamreviewComponent } from "./sanphamlist/sanphamreview/sanphamreview.compoment";

const routes: Routes = [
  {
    path: 'sanpham',
    component: SanphamComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.SanPham.View',
    },
  },
  {
    path: 'danhmucsanpham',
    component: DanhmucsanphamComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.DanhMucSanPham.View',
    },
  },
  {
    path: 'quatang',
    component: QuatangComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.QuaTang.View',
    },
  },
  {
    path: 'banner',
    component: BannerComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.Banner.View',
    },
  },
  {
    path: 'danhmuccamnang',
    component: DanhmuccamnangComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.DanhMucCamNang.View',
    },
  },
  {
    path: 'camnang',
    component: CamnangComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.CamNang.View',
    },
  },
  {
    path: 'danhmucchinhsach',
    component: DanhmucchinhsachComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.DanhMucChinhSach.View',
    },
  },
  {
    path: 'chinhsach',
    component: ChinhsachComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.ChinhSach.View',
    },
  },
  {
    path: 'donhang',
    component: DonhangComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.DonHang.View',
    },
  },
  {
    path: 'voucher',
    component: VoucherComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.Voucher.View',
    },
  },
  {
    path: 'lienhe',
    component: LienheComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.LienHe.View',
    },
  },
  {
    path: 'videoplatform',
    component: VideoplatformComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.VideoSocial.View',
    },
  },
  {
    path: 'donhangvnpay',
    component: DonhangvnpayCompoment,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.PaymentInformationModel.View',
    },
  },
  {
    path: 'binhluanbaiviet',
    component: BinhluanbaivietComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.CamNang.View',
    },
  },
  {
    path: 'sanphamreview',
    component: SanphamreviewComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'VietlifeStore.SanPham.View',
    },
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EntityRoutingModule { }