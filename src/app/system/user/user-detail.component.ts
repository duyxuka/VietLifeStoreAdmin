import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PanelModule } from 'primeng/panel';
import { InputTextModule } from 'primeng/inputtext';
import { BlockUIModule } from 'primeng/blockui';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ValidationMessageComponent } from 'src/app/shared/modules/validation-message/validation-message.component';
import { UserDto, UsersService } from '@/proxy/system/users';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PanelModule,
    InputTextModule,
    BlockUIModule,
    ProgressSpinnerModule,
    ValidationMessageComponent,
    ToolbarModule,
    ButtonModule
  ],
})
export class UserDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  public blockedPanelDetail = false;
  public form!: FormGroup;
  public btnDisabled = false;

  selectedEntity = {} as UserDto;
  public StatusOptions = [
    { label: 'Đang hoạt động', value: true },
    { label: 'Không hoạt động', value: false }
  ];
  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private userService: UsersService,
    private utilService: UtilityService,
    private fb: FormBuilder
  ) { }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  validationMessages = {
    userName: [{ type: 'required', message: 'Bạn phải nhập tài khoản' }],
    password: [
      { type: 'required', message: 'Bạn phải nhập mật khẩu' },
      {
        type: 'pattern',
        message: 'Mật khẩu ít nhất 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt',
      },
    ],
    email: [{ type: 'required', message: 'Bạn phải nhập email' }],
    phoneNumber: [
      { type: 'pattern', message: 'Số điện thoại phải có 10–11 chữ số' },
    ],
    name: [{ type: 'required', message: 'Bạn phải nhập tên' }],
    surname: [{ type: 'required', message: 'Bạn phải nhập họ' }],
  };

  ngOnInit() {
    this.buildForm();

    if (this.config.data?.id) {
      this.loadFormDetails(this.config.data.id);
    } else {
      this.setCreateMode();
    }
  }

  private buildForm() {
    this.form = this.fb.group({
      userName: [null, Validators.required],
      password: [
        null,
        [
          Validators.required,
          Validators.pattern(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$'
          ),
        ],
      ],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [null, Validators.pattern('^[0-9]{10,11}$')],
      name: [null, Validators.required],
      surname: [null, Validators.required],
      status: [true]
    });
  }

  private loadFormDetails(id: string) {
    this.toggleBlockUI(true);
    this.userService.get(id).pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: (user: UserDto) => {
        this.selectedEntity = user;
        this.form.patchValue({
          userName: user.userName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          name: user.name,
          surname: user.surname,
          status: user.status ?? true
        });
        this.setUpdateMode();
        this.toggleBlockUI(false);
      },
      error: () => this.toggleBlockUI(false),
    });
  }

  private setCreateMode() {
    // Bắt buộc các trường khi tạo mới
    this.form.get('userName')?.enable();
    this.form.get('email')?.enable();
    this.form.get('password')?.enable();
  }

  private setUpdateMode() {
    // Vô hiệu hóa các trường không được chỉnh sửa khi update
    this.form.get('userName')?.disable();
    this.form.get('email')?.disable();
    this.form.get('password')?.disable();
  }

  saveChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.toggleBlockUI(true);

    const rawValue = this.form.getRawValue(); // lấy cả giá trị disabled

    if (this.config.data?.id) {
      // Update - không gửi password
      const updateData = { ...rawValue };
      delete updateData.password; // không gửi password khi update

      this.userService.update(this.config.data.id, updateData).subscribe({
        next: () => {
          this.ref.close(true);
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
    } else {
      // Create
      this.userService.create(rawValue).subscribe({
        next: () => {
          this.ref.close(true);
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false),
      });
    }
  }

  cancel() {
    this.ref.close();
  }

  private toggleBlockUI(enabled: boolean) {
    this.btnDisabled = enabled;
    this.blockedPanelDetail = enabled;
  }
}