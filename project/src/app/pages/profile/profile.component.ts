import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-container">
      <div class="profile-header">
        <h1><mat-icon>person</mat-icon> My Profile</h1>
      </div>
      <mat-card class="profile-card">
        <div class="profile-avatar-section">
          <div class="avatar-circle">
            <mat-icon>account_circle</mat-icon>
          </div>
          <h2 class="profile-name">{{ user?.name }}</h2>
          <p class="profile-email">{{ user?.email }}</p>
        </div>
        <div class="profile-info">
          <div class="info-row">
            <mat-icon class="info-icon">badge</mat-icon>
            <div class="info-content">
              <span class="info-label">User ID</span>
              <span class="info-value">{{ user?.id }}</span>
            </div>
          </div>
          <div class="info-row">
            <mat-icon class="info-icon">person</mat-icon>
            <div class="info-content">
              <span class="info-label">Full Name</span>
              <span class="info-value">{{ user?.name }}</span>
            </div>
          </div>
          <div class="info-row">
            <mat-icon class="info-icon">email</mat-icon>
            <div class="info-content">
              <span class="info-label">Email Address</span>
              <span class="info-value">{{ user?.email }}</span>
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <button
            mat-raised-button
            color="warn"
            (click)="logout()"
            class="logout-btn"
          >
            <mat-icon>logout</mat-icon>
            Logout
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    .profile-header { margin-bottom: 24px; }
    .profile-header h1 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 28px;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
    }
    .profile-card {
      border-radius: 20px;
      padding: 40px 36px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    }
    .profile-avatar-section {
      text-align: center;
      margin-bottom: 32px;
      padding-bottom: 28px;
      border-bottom: 1px solid #e2e8f0;
    }
    .avatar-circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1a237e 0%, #3949ab 100%);
      margin-bottom: 16px;
    }
    .avatar-circle mat-icon {
      font-size: 56px;
      width: 56px;
      height: 56px;
      color: #fff;
    }
    .profile-name {
      font-size: 24px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px;
    }
    .profile-email {
      color: #64748b;
      font-size: 15px;
      margin: 0;
    }
    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 32px;
    }
    .info-row {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 12px 16px;
      background: #f8fafc;
      border-radius: 12px;
      transition: background 0.2s;
    }
    .info-row:hover { background: #f1f5f9; }
    .info-icon {
      color: #1a237e;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    .info-content {
      display: flex;
      flex-direction: column;
    }
    .info-label {
      font-size: 12px;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-value {
      font-size: 16px;
      font-weight: 600;
      color: #0f172a;
    }
    .profile-actions {
      display: flex;
      justify-content: center;
    }
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 12px;
      padding: 0 32px;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
    }
  `],
})
export class ProfileComponent {
  private authService = inject(AuthService);

  get user() {
    return this.authService.currentUser();
  }

  logout() {
    this.authService.logout();
  }
}
