import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';

import { ChinhSachDto } from '@/proxy/entity/chinh-sachs-list/chinh-sachs';
import { ChinhSachsService } from '@/proxy/entity/chinh-sachs';
import { DanhMucChinhSachsService } from '@/proxy/entity/chinh-sachs';
import { CkeditorConfigService } from 'src/ckeditor-config.service';

@Component({
  selector: 'app-chinhsach-detail',
  standalone: true,
  templateUrl: './chinhsach-detail.component.html',
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class ChinhsachDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  selectedEntity = {} as ChinhSachDto;

  blockedPanel = false;
  btnDisabled = false;
  public Editor: any;
  public configCkeditor: any;
  editorReady = false;
  danhMucOptions: any[] = [];

  validationMessages = {
    tieuDe: [
      { type: 'required', message: 'Bạn phải nhập tiêu đề' }
    ],
    noiDung: [
      { type: 'required', message: 'Bạn phải nhập nội dung' }
    ],
    danhMucChinhSachId: [
      { type: 'required', message: 'Bạn phải chọn danh mục' }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private service: ChinhSachsService,
    private danhMucService: DanhMucChinhSachsService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private util: UtilityService,
    private notificationService: NotificationService,
    private ckeditorConfigService: CkeditorConfigService,
  ) { }

  ngOnInit(): void {
    this.Editor = this.ckeditorConfigService.getEditor();
    this.configCkeditor = this.ckeditorConfigService.getEditorConfig();

    this.buildForm();
    this.loadDanhMuc();
    this.initData();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.ref.close();
  }
  private prepareEditor() {
    this.editorReady = false;
    setTimeout(() => this.editorReady = true, 100);
  }
  buildForm() {
    this.form = this.fb.group({
      tieuDe: new FormControl(this.selectedEntity.tieuDe || null, Validators.required),
      noiDung: new FormControl(this.selectedEntity.noiDung || null, Validators.required),
      trangThai: new FormControl(this.selectedEntity.trangThai ?? true),
      danhMucChinhSachId: new FormControl(
        this.selectedEntity.danhMucChinhSachId || null,
        Validators.required
      )
    });
  }

  loadDanhMuc() {
    this.danhMucService.getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.danhMucOptions = res;
      });
  }

  initData() {
    if (this.util.isEmpty(this.config.data?.id)) {
      this.prepareEditor(); 
      return;
    }

    this.toggleBlockUI(true);
    this.loadDetail(this.config.data.id);
  }

  loadDetail(id: string) {
    this.service.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.selectedEntity = res;
          this.buildForm();
          this.toggleBlockUI(false);
          this.prepareEditor();
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  saveChange() {
    this.toggleBlockUI(true);

    const request = this.util.isEmpty(this.config.data?.id)
      ? this.service.create(this.form.value)
      : this.service.update(this.config.data.id, this.form.value);

    request
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {
          this.toggleBlockUI(false);
          this.ref.close(this.form.value);
        },
        error: err => {
          this.notificationService.showError(err.error?.error?.message);
          this.toggleBlockUI(false);
        }
      });
  }

  cancel() {
    this.ref.close();
  }

  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 1000);
    }
  }
}
