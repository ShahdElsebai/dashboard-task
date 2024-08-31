import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../models/auth.model';
import { AuthService } from '../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  showErrorToast = false;
  errorMessage = 'Something went wrong, please check the data.';
  hidePassword = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  onSubmit(): void {
    this.isLoading = true;
    if (this.loginForm.valid) {
      const loginRequest: LoginRequest = {
        field: this.username?.value,
        password: this.password?.value,
        type: 'admin',
      };
      this.authService
        .login(loginRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            if (res) {
              this.isLoading = false;
              this.router.navigate(['']);
            }
          },
          error: () => {
            this.isLoading = false;
            this.showErrorToast = true;
            setTimeout(() => {
              this.showErrorToast = false;
            }, 6000);
          },
        });
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
