import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { BlockUIModule } from 'primeng/blockui';
import { BadgeModule } from 'primeng/badge';
import { TooltipModule } from 'primeng/tooltip';
import { RippleModule } from 'primeng/ripple';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

import { PagedResultDto } from '@abp/ng.core';
import { MessageConstants } from 'src/app/shared/constants/messages.const';
import { NotificationService } from 'src/app/shared/services/notification.service';
import { RoleAssignComponent } from './role-assign.component';
import { SetPasswordComponent } from './set-password.component';
import { UserDetailComponent } from './user-detail.component';
import { Subject, takeUntil } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { UserDto, UserInListDto, UsersService } from '@/proxy/system/users';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    InputTextModule,
    PanelModule,
    BlockUIModule,
    BadgeModule,
    TooltipModule,
    RippleModule,
    DynamicDialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    ToolbarModule,
    InputIconModule,
    IconFieldModule
  ],
  providers: [DialogService, ConfirmationService]
})
export class UserComponent implements OnInit, OnDestroy {
  //System variables
  private ngUnsubscribe = new Subject<void>();
  public blockedPanel: boolean = false;

  //Paging variables
  public skipCount: number = 0;
  public maxResultCount: number = 10;
  public totalCount!: number;

  //Business variables
  public items: UserInListDto[];
  public selectedItems: UserInListDto[] = [];
  public keyword: string = '';

  constructor(
    private userService: UsersService,
    public dialogService: DialogService,
    private notificationService: NotificationService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.loadData();
  }

  loadData(selectionId = null) {
    this.toggleBlockUI(true);
    this.userService
      .getListWithFilter({
        maxResultCount: this.maxResultCount,
        skipCount: this.skipCount,
        keyword: this.keyword,
      })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (response: PagedResultDto<UserInListDto>) => {
          this.items = response.items;
          this.totalCount = response.totalCount;
          if (selectionId != null && this.items.length > 0) {
            this.selectedItems = this.items.filter(x => x.id == selectionId);
          }

          this.toggleBlockUI(false);
        },
        error: () => {
          this.toggleBlockUI(false);
        },
      });
  }

  showAddModal() {
    const ref = this.dialogService.open(UserDetailComponent, {
      header: 'Thêm mới người dùng',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: UserDto) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.CREATED_OK_MSG);
        this.selectedItems = [];
        this.loadData();
      }
    });
  }

  pageChanged(event: any): void {
    this.skipCount = event.first;
    this.maxResultCount = event.rows;
    this.loadData();
  }

  showEditModal() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    var id = this.selectedItems[0].id;
    const ref = this.dialogService.open(UserDetailComponent, {
      data: {
        id: id,
      },
      header: 'Cập nhật người dùng',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((data: UserDto) => {
      if (data) {
        this.notificationService.showSuccess(MessageConstants.UPDATED_OK_MSG);
        this.selectedItems = [];
        this.loadData(data.id);
      }
    });
  }

  deleteItems() {
    if (this.selectedItems.length == 0) {
      this.notificationService.showError(MessageConstants.NOT_CHOOSE_ANY_RECORD);
      return;
    }
    var ids = [];
    this.selectedItems.forEach(element => {
      ids.push(element.id);
    });
    this.confirmationService.confirm({
      message: MessageConstants.CONFIRM_DELETE_MSG,
      accept: () => {
        this.deleteItemsConfirm(ids);
      },
    });
  }

  deleteItemsConfirm(ids: any[]) {
    this.toggleBlockUI(true);
    this.userService.deleteMultiple(ids).subscribe({
      next: () => {
        this.notificationService.showSuccess(MessageConstants.DELETED_OK_MSG);
        this.loadData();
        this.selectedItems = [];
        this.toggleBlockUI(false);
      },
      error: () => {
        this.toggleBlockUI(false);
      },
    });
  }

  setPassword(id: string) {
    const ref = this.dialogService.open(SetPasswordComponent, {
      data: {
        id: id,
      },
      header: 'Đặt lại mật khẩu',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.notificationService.showSuccess(MessageConstants.CHANGE_PASSWORD_SUCCCESS_MSG);
        this.selectedItems = [];
        this.loadData();
      }
    });
  }
  
  assignRole(id: string) {
    const ref = this.dialogService.open(RoleAssignComponent, {
      data: {
        id: id,
      },
      header: 'Gán quyền',
      modal: true,
      width: '70%',
      dismissableMask: true,
      closable: true,
    });

    ref.onClose.subscribe((result: boolean) => {
      if (result) {
        this.notificationService.showSuccess(MessageConstants.ROLE_ASSIGN_SUCCESS_MSG);
        this.loadData();
      }
    });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled == true) {
      this.blockedPanel = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
      }, 1000);
    }
  }
}
