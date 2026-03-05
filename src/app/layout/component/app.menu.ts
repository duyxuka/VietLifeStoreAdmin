import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
        <li *ngIf="item.separator" class="menu-separator"></li>
      </ng-container>
    </ul>
  `,
})
export class AppMenu implements OnInit {
  model: MenuItem[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Trang chủ',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/dashboard'] },
        ],
      },
      {
        label: 'VietLife Store',
        items: [
          {
            label: 'Quản lý liên hệ',
            icon: 'pi pi-fw pi-cog',
            items: [
              {
                label: 'Liên hệ',
                icon: 'pi pi-fw pi-envelope',
                routerLink: ['/entity/lienhe'],
                permission: 'VietlifeStore.LienHe.View',
              }
            ],
          },
          {
            label: 'Quản lý video platform',
            icon: 'pi pi-fw pi-cog',
            items: [
              {
                label: 'Video platform',
                icon: 'pi pi-fw pi-video',
                routerLink: ['/entity/videoplatform'],
                permission: 'VietlifeStore.VideoSocial.View',
              }
            ],
          },
          {
            label: 'Quản lý banner',
            icon: 'pi pi-fw pi-cog',
            items: [
              {
                label: 'Banner',
                icon: 'pi pi-fw pi-image',
                routerLink: ['/entity/banner'],
                permission: 'VietlifeStore.Banner.View',
              }
            ],
          },
          {
            label: 'Quản lý cẩm nang',
            icon: 'pi pi-fw pi-cog',
            items: [
              {
                label: 'Danh mục cẩm nang',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/entity/danhmuccamnang'],
                permission: 'VietlifeStore.DanhMucCamNang.View',
              },
              {
                label: 'Cẩm nang',
                icon: 'pi pi-fw pi-book',
                routerLink: ['/entity/camnang'],
                permission: 'VietlifeStore.CamNang.View',
              }
            ],
          },
          {
            label: 'Quản lý sản phẩm',
            icon: 'pi pi-fw pi-cog',
            items: [
              {
                label: 'Danh mục sản phẩm',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/entity/danhmucsanpham'],
                permission: 'VietlifeStore.DanhMucSanPham.View',
              },
              {
                label: 'Sản phẩm',
                icon: 'pi pi-fw pi-tags',
                routerLink: ['/entity/sanpham'],
                permission: 'VietlifeStore.SanPham.View',
              },
              {
                label: 'Quà tặng',
                icon: 'pi pi-fw pi-gift',
                routerLink: ['/entity/quatang'],
                permission: 'VietlifeStore.QuaTang.View',
              },
            ],
          },
          {
            label: 'Quản lý chính sách',
            icon: 'pi pi-fw pi-cog',
            items: [
              {
                label: 'Danh mục chính sách',
                icon: 'pi pi-fw pi-folder',
                routerLink: ['/entity/danhmucchinhsach'],
                permission: 'VietlifeStore.DanhMucChinhSach.View',
              },
              {
                label: 'Chính sách',
                icon: 'pi pi-fw pi-file',
                routerLink: ['/entity/chinhsach'],
                permission: 'VietlifeStore.ChinhSach.View',
              }
            ],
          },
          {
            label: 'Quản lý đơn hàng',
            icon: 'pi pi-fw pi-cog',
            items: [
              {
                label: 'Đơn hàng',
                icon: 'pi pi-fw pi-shopping-cart',
                routerLink: ['/entity/donhang'],
                permission: 'VietlifeStore.DonHang.View',
              },
              {
                label: 'Voucher',
                icon: 'pi pi-fw pi-gift',
                routerLink: ['/entity/voucher'],
                permission: 'VietlifeStore.Voucher.View',
              }
            ],
          },
        ],
      },
      {
        label: 'Hệ thống',
        items: [
          {
            label: 'Quyền',
            icon: 'pi pi-fw pi-lock',
            routerLink: ['/system/role'],
            permission: 'AbpIdentity.Roles.View',
          },
          {
            label: 'Người dùng',
            icon: 'pi pi-fw pi-user',
            routerLink: ['/system/user'],
            permission: 'AbpIdentity.Users.View',
          },
        ],
      },
    ];
  }
}
