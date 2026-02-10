import { permissionGuard } from '@abp/ng.core';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'role',
    component: RoleComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'AbpIdentity.Roles.View',
    },
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [permissionGuard],
    data: {
      requiredPolicy: 'AbpIdentity.Users.View',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {}
