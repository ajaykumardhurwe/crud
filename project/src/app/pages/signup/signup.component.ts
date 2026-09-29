import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="auth-container">
      <mat-card class="auth-card" [class.loading]="isLoading">
        <div class="auth-header">
          <mat-icon class="auth-logo">person_add</mat-icon>
          <h1>Create Account</h1>
          <p>Join SocialHub and start sharing</p>
        </div>
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()" class="auth-form">
          <mat-form-field appearance="outline">
            <mat-label>Full Name</mat-label>
            <mat-icon matPrefix>person</mat-icon>
            <input
              matInput
              type="text"
              formControlName="name"
              placeholder="John Doe"
            />
            @if (signupForm.get('name')?.hasError('required') && signupForm.get('name')?.touched) {
              <mat-error>Name is required</mat-error>
            }
            @if (signupForm.get('name')?.hasError('minlength') && signupForm.get('name')?.touched) {
              <mat-error>Min 2 characters</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Email</mat-label>
            <mat-icon matPrefix>email</mat-icon>
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="you@example.com"
            />
            @if (signupForm.get('email')?.hasError('required') && signupForm.get('email')?.touched) {
              <mat-error>Email is required</mat-error>
            }
            @if (signupForm.get('email')?.hasError('email') && signupForm.get('email')?.touched) {
              <mat-error>Enter a valid email</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Password</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input
              matInput
              [type]="hidePassword ? 'password' : 'text'"
              formControlName="password"
              placeholder="Min 6 characters"
            />
            <button
              mat-icon-button
              matSuffix
              (click)="hidePassword = !hidePassword"
              type="button"
            >
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (signupForm.get('password')?.hasError('required') && signupForm.get('password')?.touched) {
              <mat-error>Password is required</mat-error>
            }
            @if (signupForm.get('password')?.hasError('minlength') && signupForm.get('password')?.touched) {
              <mat-error>Min 6 characters</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Confirm Password</mat-label>
            <mat-icon matPrefix>lock</mat-icon>
            <input
              matInput
              [type]="hideConfirm ? 'password' : 'text'"
              formControlName="confirmPassword"
              placeholder="Re-enter password"
            />
            <button
              mat-icon-button
              matSuffix
              (click)="hideConfirm = !hideConfirm"
              type="button"
            >
              <mat-icon>{{ hideConfirm ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            @if (signupForm.hasError('passwordMismatch') && signupForm.get('confirmPassword')?.touched) {
              <mat-error>Passwords do not match</mat-error>
            }
            @if (signupForm.get('confirmPassword')?.hasError('required') && signupForm.get('confirmPassword')?.touched) {
              <mat-error>Confirm your password</mat-error>
            }
          </mat-form-field>

          <button
            mat-raised-button
            color="primary"
            type="submit"
            class="submit-btn"
            [disabled]="isLoading"
          >
            @if (isLoading) {
              <mat-spinner diameter="20" class="btn-spinner"></mat-spinner>
              Creating account...
            } @else {
              <ng-container><mat-icon>person_add</mat-icon> Sign Up</ng-container>
            }
          </button>
        </form>
        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Sign in</a></p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: calc(100vh - 64px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: linear-gradient(135deg, #e8eaf6 0%, #e3f2fd 100%);
    }
    .auth-card {
      width: 100%;
      max-width: 460px;
      padding: 40px 36px;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 28px;
    }
    .auth-logo {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #1a237e;
      margin-bottom: 8px;
    }
    .auth-header h1 {
      font-size: 26px;
      font-weight: 700;
      margin: 0 0 4px;
      color: #1a237e;
    }
    .auth-header p {
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .auth-form mat-form-field { width: 100%; }
    .submit-btn {
      width: 100%;
      height: 48px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      margin-top: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .btn-spinner {
      display: inline-block;
      margin-right: 8px;
    }
    .auth-footer {
      text-align: center;
      margin-top: 24px;
    }
    .auth-footer p {
      color: #64748b;
      font-size: 14px;
    }
    .auth-footer a {
      color: #1a237e;
      font-weight: 600;
      text-decoration: none;
    }
    .auth-footer a:hover { text-decoration: underline; }
  `],
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;
  hidePassword = true;
  hideConfirm = true;

  signupForm = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: (group) => {
        const pass = group.get('password')?.value;
        const confirm = group.get('confirmPassword')?.value;
        return pass === confirm ? null : { passwordMismatch: true };
      },
    }
  );

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { name, email, password } = this.signupForm.getRawValue();

    this.authService.signup(name, email, password).subscribe({
      next: (res) => {
        this.authService.saveAuth(res);
        this.snackBar.open('Account created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(
          err.error?.message || 'Signup failed',
          'Close',
          { duration: 4000, panelClass: ['error-snackbar'] }
        );
      },
    });
  }
}
