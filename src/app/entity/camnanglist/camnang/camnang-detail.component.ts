import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';

import { StandaloneSharedModule } from '@/standaloneshare.module';
import { ValidationMessageComponent } from '@/shared/modules/validation-message/validation-message.component';
import { NotificationService } from '@/shared/services/notification.service';
import { UtilityService } from '@/shared/services/utility.service';

import { CamNangDto, CamNangsService } from '@/proxy/entity/cam-nangs-list/cam-nangs';
import { DanhMucCamNangsService } from '@/proxy/entity/cam-nangs';
import { CkeditorConfigService } from 'src/ckeditor-config.service';

@Component({
  selector: 'app-camnang-detail',
  standalone: true,
  templateUrl: './camnang-detail.component.html',
  imports: [StandaloneSharedModule, ValidationMessageComponent]
})
export class CamnangDetailComponent implements OnInit, OnDestroy {

  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  selectedEntity = {} as CamNangDto;

  blockedPanel = false;
  btnDisabled = false;

  danhMucOptions: any[] = [];
  previewImage?: string;

  public Editor: any;
  public configCkeditor: any;
  editorReady = false; 

  validationMessages = {
    ten: [{ type: 'required', message: 'Bạn phải nhập tên cẩm nang' }],
    slug: [{ type: 'required', message: 'Bạn phải nhập slug' }],
    mota: [{ type: 'required', message: 'Bạn phải nhập nội dung' }],
    danhMucCamNangId: [{ type: 'required', message: 'Bạn phải chọn danh mục' }]
  };

  constructor(
    private fb: FormBuilder,
    private service: CamNangsService,
    private danhMucService: DanhMucCamNangsService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private util: UtilityService,
    private notificationService: NotificationService,
    private ckeditorConfigService: CkeditorConfigService,
  ) { }

  // ================== LIFECYCLE ==================
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
  }

  // ================== FORM ==================
  buildForm() {
    this.form = this.fb.group({
      ten: new FormControl(this.selectedEntity.ten || null, Validators.required),
      slug: new FormControl(this.selectedEntity.slug || null, Validators.required),
      mota: new FormControl(this.selectedEntity.mota || null, Validators.required),
      danhMucCamNangId: new FormControl(
        this.selectedEntity.danhMucCamNangId || null,
        Validators.required
      ),
      trangThai: new FormControl(this.selectedEntity.trangThai ?? true),
      titleSEO: new FormControl(this.selectedEntity.titleSEO || null),
      keyword: new FormControl(this.selectedEntity.keyword || null),
      descriptionSEO: new FormControl(this.selectedEntity.descriptionSEO || null),
      anhName: new FormControl(null),
      anhContent: new FormControl(null)
    });
  }

  // ================== DATA ==================
  loadDanhMuc() {
    this.danhMucService.getListAll()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => this.danhMucOptions = res);
  }

  initData() {
    this.toggleBlockUI(true);

    if (this.util.isEmpty(this.config.data?.id)) {
      this.toggleBlockUI(false);
      this.prepareEditor();
    } else {
      this.loadDetail(this.config.data.id);
    }
  }

  loadDetail(id: string) {
    this.service.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.editorReady = false;
          this.selectedEntity = res;
          this.buildForm();
          this.toggleBlockUI(false);
          this.prepareEditor(); 
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  // ================== CKEDITOR ==================
  private prepareEditor() {
    this.editorReady = false;
    setTimeout(() => {
      this.editorReady = true;
    }, 100);
  }

  // ================== IMAGE ==================
  onSelectImage(event: any) {
    const file: File = event.files?.[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!file) return;

    const MAX_SIZE = 200 * 1024; // 200KB

    if (file.size > MAX_SIZE) {
      this.notificationService.showError(
        'Ảnh phải nhỏ hơn hoặc bằng 200KB'
      );
      return;
    }
    if (!allowedTypes.includes(file.type)) {
      this.notificationService.showError(
        'Chỉ cho phép ảnh JPG, PNG, WEBP'
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;

      this.form.patchValue({
        anhName: file.name,
        anhContent: this.previewImage
      });
    };
    reader.readAsDataURL(file);
  }

  // ================== SAVE ==================
  saveChange() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

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

  // ================== UI ==================
  private toggleBlockUI(enabled: boolean) {
    if (enabled) {
      this.blockedPanel = true;
      this.btnDisabled = true;
    } else {
      setTimeout(() => {
        this.blockedPanel = false;
        this.btnDisabled = false;
      }, 500);
    }
  }
}
