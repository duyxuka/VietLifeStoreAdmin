import { Component, OnInit, EventEmitter, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TreeNode } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

import { PanelModule } from 'primeng/panel';
import { TreeModule } from 'primeng/tree';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { GetPermissionListResultDto, PermissionGrantInfoDto, PermissionGroupDto, UpdatePermissionDto, UpdatePermissionsDto } from '@/proxy/volo/abp/permission-management';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { RolesService } from '@/proxy/system/roles';

@Component({
  standalone: true,
  selector: 'app-permission-grant',
  templateUrl: 'permission-grant.component.html',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanelModule,
    TreeModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ToolbarModule,
    ButtonModule,
  ]
})
export class PermissionGrantComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();
  public blockedPanelDetail = false;
  public form!: FormGroup;
  public btnDisabled = false;
  public saveBtnName = 'Cập nhật';
  public closeBtnName = 'Hủy';
  public groups: PermissionGroupDto[] = [];
  public treeData: TreeNode[] = [];
  public selectedNodes: TreeNode[] = [];
  formSavedEventEmitter: EventEmitter<any> = new EventEmitter();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private roleService: RolesService,
    private fb: FormBuilder
  ) { }

  ngOnDestroy() {
    if (this.ref) this.ref.close();
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngOnInit() {
    this.buildForm();
    this.loadDetail(this.config.data.name, 'R');
  }

  buildForm() {
    this.form = this.fb.group({});
  }

  loadDetail(providerKey: string, providerName: string) {
    this.toggleBlockUI(true);
    this.roleService
      .getPermissions(providerName, providerKey)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: GetPermissionListResultDto) => {
          this.groups = res.groups;
          this.buildTreeData();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
  }

  buildTreeData() {
    this.treeData = [];

    this.groups.forEach(group => {
      const groupNode: TreeNode = {
        label: group.displayName,
        data: group.name,
        children: this.buildPermissionTree(group.permissions),
        expanded: true,
      };
      this.treeData.push(groupNode);
    });
  }

  buildPermissionTree(permissions: PermissionGrantInfoDto[]): TreeNode[] {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    permissions.forEach(p => {
      const key = p.name ?? ''; // nếu undefined thì gán chuỗi rỗng
      map.set(key, {
        label: p.displayName,
        data: key,
        children: [],
        selectable: true,
        expanded: true,
        partialSelected: false,
      });
    });

    permissions.forEach(p => {
      const key = p.name ?? '';
      const node = map.get(key)!;
      if (p.parentName && map.has(p.parentName)) {
        map.get(p.parentName)!.children!.push(node);
      } else {
        roots.push(node);
      }

      if (p.isGranted) this.selectedNodes.push(node);
    });

    return roots;
  }

  saveChange() {
    this.toggleBlockUI(true);
    const selectedPermissions = this.selectedNodes.map(x => x.data);
    const allPermissions = this.groups.map(g => g.permissions).reduce((acc, val) => acc.concat(val), []);

    const permissions: UpdatePermissionDto[] = allPermissions.map(p => ({
      name: p.name,
      isGranted: selectedPermissions.includes(p.name),
    }));

    const updateValues: UpdatePermissionsDto = { permissions };
    this.roleService
      .updatePermissions('R', this.config.data.name, updateValues)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.toggleBlockUI(false);
        this.ref.close(this.form.value);
      });
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.btnDisabled = true;
      this.blockedPanelDetail = true;
    } else {
      setTimeout(() => {
        this.btnDisabled = false;
        this.blockedPanelDetail = false;
      }, 500);
    }
  }
  cancel() {
    this.ref?.close();
  }
}
