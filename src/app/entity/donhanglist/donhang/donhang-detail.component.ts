import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { StandaloneSharedModule } from '@/standaloneshare.module';
import { DonHangsService } from '@/proxy/entity/don-hangs';
import { SanPhamsService } from '@/proxy/entity/san-phams';
import { UsersService } from '@/proxy/system/users';

@Component({
  selector: 'app-donhang-detail',
  standalone: true,
  imports: [StandaloneSharedModule],
  templateUrl: './donhang-detail.component.html'
})
export class DonHangDetailComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject<void>();

  form!: FormGroup;
  chiTietDonHangs!: FormArray;

  blockedPanel = false;
  btnDisabled = false;
  khachHangOptions: any[] = [];

  sanPhamOptions: any[] = [];
  phuongThucThanhToanOptions = [
    { label: 'COD', value: 'COD' },
    { label: 'Chuyển khoản', value: 'VNPAY' }
  ];
  trangThaiOptions = [
  { label: 'Chờ xác nhận', value: 0, disabled: false },
  { label: 'Đang xử lý', value: 1, disabled: false },
  { label: 'Đang giao', value: 2, disabled: false },
  { label: 'Hoàn thành', value: 3, disabled: false },
  { label: 'Đã hủy', value: 4, disabled: false }
];
  constructor(
    private fb: FormBuilder,
    private donHangService: DonHangsService,
    private userService: UsersService,
    private sanPhamService: SanPhamsService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    this.buildForm();
    this.loadSanPham();
    this.loadKhachHang();

    if (this.config.data?.id) {
      this.loadData(this.config.data.id);
    }

    if (this.chiTietDonHangs.length === 0) {
      this.addRow();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  buildForm() {
    this.form = this.fb.group({
      ten: [],
      soDienThoai: [],
      email: [],
      diaChi: [],
      ghiChu: [''],
      giamGiaVoucher: [0],
      phuongThucThanhToan: [],
      trangThai: [0],
      ngayDat: [new Date()],
      tongTien: [{ value: 0, disabled: true }],
      chiTietDonHangs: this.fb.array([]),
      taiKhoanKhachHangId: [null, Validators.required],
    });

    this.chiTietDonHangs = this.form.get('chiTietDonHangs') as FormArray;
  }

  newRow(): FormGroup {
    return this.fb.group({
      sanPhamId: null,
      soLuong: 1,
      gia: 0,
      sanPhamBienThe: [''],
      quaTang: ['']
    });
  }

  addRow() {
    this.chiTietDonHangs.push(this.newRow());
  }

  removeRow(i: number) {
    this.chiTietDonHangs.removeAt(i);
  }

  // Tải danh sách khách hàng
  loadKhachHang() {
    this.userService.getCustomers()   // hoặc dùng UsersAppService nếu bạn tách service
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: (res: any[]) => {
          this.khachHangOptions = res.map(kh => ({
            value: kh.id,
            label: kh.name || kh.userName || 'Không tên',
            soDienThoai: kh.phoneNumber,
            email: kh.email,
            diaChi: kh.diaChi || ''   // nếu có trường địa chỉ trong DTO
          }));
        },
        error: (err) => {
          console.error('Lỗi tải danh sách khách hàng', err);
        }
      });
  }

  // Khi chọn khách hàng trong dropdown
  onKhachHangChange(event: any) {
    const userId = event.value;

    const selectedKh = this.khachHangOptions.find(
      x => x.value === userId
    );

    this.form.patchValue({
      ten: selectedKh?.label ?? '',
      soDienThoai: selectedKh?.soDienThoai ?? '',
      email: selectedKh?.email ?? '',
      diaChi: selectedKh?.diaChi ?? ''
    });
  }


  getThanhTien(row: FormGroup) {
    const sl = row.get('soLuong')?.value || 0;
    const gia = row.get('gia')?.value || 0;
    const giam = row.get('giamGiaVoucher')?.value || 0;
    return (gia - giam) * sl;
  }

  calculateTotal() {

    const subTotal = this.chiTietDonHangs.controls.reduce(
      (sum, row) => sum + this.getThanhTien(row as FormGroup),
      0
    );

    const voucher = this.form.get('giamGiaVoucher')?.value || 0;

    let total = subTotal - voucher;

    if (total < 0) total = 0;

    this.form.get('tongTien')?.setValue(total);
  }

  loadSanPham() {
    this.sanPhamService.getListSelect()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.sanPhamOptions = res.map(x => ({
          value: x.id,
          label: x.ten
        }));
      });
  }

  loadData(id: string) {
    this.toggleBlockUI(true);

    this.donHangService.get(id)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: res => {
          this.form.patchValue({
            ...res,
            ngayDat: res.ngayDat ? new Date(res.ngayDat) : null,
            taiKhoanKhachHangId: res.taiKhoanKhachHangId
          });
          this.updateStatusOptions();

          this.chiTietDonHangs.clear();
          res.chiTietDonHangDtos?.forEach((ct: any) => {
            this.chiTietDonHangs.push(this.fb.group({
              sanPhamId: ct.sanPhamId,
              soLuong: ct.soLuong,
              gia: ct.gia,
              sanPhamBienThe: ct.sanPhamBienThe || '',
              quaTang: ct.quaTang || ''
            }));
          });

          this.calculateTotal();
          this.toggleBlockUI(false);
        },
        error: () => this.toggleBlockUI(false)
      });
  }

  saveChange() {
    this.toggleBlockUI(true);

    const rawValue = this.form.getRawValue();

    rawValue.tongSoLuong = this.chiTietDonHangs.controls
      .reduce((s, x) => s + (x.get('soLuong')?.value || 0), 0);

    rawValue.tongTien = this.form.get('tongTien')?.value;

    const req = this.config.data?.id
      ? this.donHangService.update(this.config.data.id, rawValue)
      : this.donHangService.create(rawValue);

    req.pipe(takeUntil(this.ngUnsubscribe)).subscribe({
      next: () => {
        this.ref.close(true);
        this.toggleBlockUI(false);
      },
      error: () => this.toggleBlockUI(false)
    });
  }
  updateStatusOptions() {
    const currentStatus = this.form.get('trangThai')?.value;
    this.trangThaiOptions = this.trangThaiOptions.map(option => {
      const value = option.value;
      let disabled = true;
      if (value === currentStatus) {
        disabled = false;
      } else {
        switch (currentStatus) {
          case 0:
            disabled = ![1, 4].includes(value);
            break;

          case 1:
            disabled = ![2, 4].includes(value);
            break;

          case 2:
            disabled = ![3, 4].includes(value);
            break;

          case 3:
            disabled = true;
            break;

          case 4:
            disabled = true;
            break;
        }
      }
      return {
        ...option,
        disabled
      };
    });
  }
  updateStatus() {
    const id = this.config.data?.id;

    if (!id) return;

    const status = this.form.get('trangThai')?.value;

    this.toggleBlockUI(true);

    this.donHangService.updateStatus(id, status)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: () => {

          this.toggleBlockUI(false);
          alert('Cập nhật trạng thái thành công');

        },
        error: () => this.toggleBlockUI(false)
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
