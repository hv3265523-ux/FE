import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2>Đăng Ký Tài Khoản</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label>Họ tên</label>
            <input type="text" formControlName="hoTen" placeholder="Nhập họ và tên" class="form-control" />
            <small class="error-text" *ngIf="registerForm.get('hoTen')?.touched && registerForm.get('hoTen')?.invalid">
              Họ tên không được để trống.
            </small>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="Nhập email của bạn" class="form-control" />
            <small class="error-text" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid">
              Email không hợp lệ.
            </small>
          </div>

          <div class="form-group">
            <label>Mật khẩu</label>
            <input type="password" formControlName="matKhau" placeholder="Tối thiểu 6 ký tự" class="form-control" />
            <small class="error-text" *ngIf="registerForm.get('matKhau')?.touched && registerForm.get('matKhau')?.invalid">
              Mật khẩu phải có ít nhất 6 ký tự.
            </small>
          </div>

          <div class="form-group">
            <label>Số điện thoại (Tùy chọn)</label>
            <input type="text" formControlName="soDienThoai" placeholder="Nhập số điện thoại" class="form-control" />
          </div>

          <button type="submit" [disabled]="registerForm.invalid" class="btn-submit">Đăng Ký</button>
          
          <p class="auth-redirect">
            Đã có tài khoản? <a routerLink="/login">Đăng nhập ngay</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 85vh;
      background-color: #f4f7f6;
    }
    .auth-card {
      width: 100%;
      max-width: 420px;
      padding: 30px;
      background: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    h2 {
      text-align: center;
      margin-bottom: 25px;
      color: #333;
      font-size: 24px;
    }
    .form-group {
      margin-bottom: 18px;
    }
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: 600;
      color: #555;
    }
    .form-control {
      width: 100%;
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      box-sizing: border-box;
    }
    .form-control:focus {
      border-color: #007bff;
      outline: none;
      box-shadow: 0 0 5px rgba(0, 123, 255, 0.2);
    }
    .error-text {
      color: #dc3545;
      font-size: 12px;
      margin-top: 4px;
      display: block;
    }
    .btn-submit {
      width: 100%;
      padding: 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: bold;
      cursor: pointer;
      transition: background 0.3s;
    }
    .btn-submit:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
    .btn-submit:not(:disabled):hover {
      background-color: #0056b3;
    }
    .auth-redirect {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }
    .auth-redirect a {
      color: #007bff;
      text-decoration: none;
    }
    .auth-redirect a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    hoTen: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    matKhau: ['', [Validators.required, Validators.minLength(6)]],
    soDienThoai: ['']
  });

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          alert('Đăng ký tài khoản thành công!');
          this.router.navigate(['/login']);
        },
        error: (err: any) => {
          const errorMsg = err?.error?.message || 'Lỗi kết nối máy chủ';
          alert('Đăng ký thất bại: ' + errorMsg);
        }
      });
    }
  }
}