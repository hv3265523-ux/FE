import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <h2>Đăng Nhập SPORTZONE</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" placeholder="Nhập email của bạn" class="form-control" />
            <small class="error-text" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid">
              Email không hợp lệ hoặc để trống.
            </small>
          </div>

          <div class="form-group">
            <label>Mật khẩu</label>
            <input type="password" formControlName="matKhau" placeholder="Nhập mật khẩu" class="form-control" />
            <small class="error-text" *ngIf="loginForm.get('matKhau')?.touched && loginForm.get('matKhau')?.invalid">
              Mật khẩu không được để trống.
            </small>
          </div>

          <button type="submit" [disabled]="loginForm.invalid" class="btn-submit">Đăng Nhập</button>
          
          <p class="auth-redirect">
            Chưa có tài khoản? <a routerLink="/register">Đăng ký ngay</a>
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
      min-height: 80vh;
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
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 8px;
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
      margin-top: 5px;
      display: block;
    }
    .btn-submit {
      width: 100%;
      padding: 12px;
      background-color: #28a745;
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
      background-color: #218838;
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
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    matKhau: ['', [Validators.required]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          alert('Đăng nhập thành công!');
          this.router.navigate(['/categories']);
        },
        error: (err: any) => {
          alert('Đăng nhập thất bại: Sai tài khoản hoặc mật khẩu!');
        }
      });
    }
  }
}