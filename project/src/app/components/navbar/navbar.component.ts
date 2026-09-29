import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
  ],
  template: `
    <mat-toolbar class="navbar" *ngIf="auth.isLoggedIn()">
      <div class="nav-brand" routerLink="/home">
        <mat-icon class="brand-icon">diversity_3</mat-icon>
        <span>SocialHub</span>
      </div>
      <span class="spacer"></span>
      <nav class="nav-links">
        <a
          mat-button
          routerLink="/home"
          routerLinkActive="active-link"
          class="nav-link"
        >
          <mat-icon>home</mat-icon>
          Home
        </a>
        <a
          mat-button
          routerLink="/create-post"
          routerLinkActive="active-link"
          class="nav-link"
        >
          <mat-icon>add_circle</mat-icon>
          Create
        </a>
        <a
          mat-button
          routerLink="/my-posts"
          routerLinkActive="active-link"
          class="nav-link"
        >
          <mat-icon>article</mat-icon>
          My Posts
        </a>
      </nav>
      <button
        mat-button
        [matMenuTriggerFor]="menu"
        class="profile-btn"
      >
        <mat-icon>account_circle</mat-icon>
        <span class="user-name">{{ auth.currentUser()?.name }}</span>
        <mat-icon class="dropdown-arrow">arrow_drop_down</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <a mat-menu-item routerLink="/profile">
          <mat-icon>person</mat-icon>
          <span>Profile</span>
        </a>
        <button mat-menu-item (click)="logout()">
          <mat-icon>logout</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      color: #fff;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.5px;
      transition: opacity 0.2s;
    }
    .nav-brand:hover { opacity: 0.85; }
    .brand-icon {
      color: #64b5f6;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .spacer { flex: 1 1 auto; }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .nav-link {
      color: rgba(255,255,255,0.85) !important;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
      border-radius: 8px;
    }
    .nav-link mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .nav-link:hover {
      background: rgba(255,255,255,0.12) !important;
      color: #fff !important;
    }
    .active-link {
      background: rgba(255,255,255,0.18) !important;
      color: #fff !important;
    }
    .profile-btn {
      color: #fff !important;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 12px;
      border-radius: 8px;
    }
    .user-name {
      max-width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .dropdown-arrow { margin-left: -4px; }

    @media (max-width: 768px) {
      .nav-links { display: none; }
      .user-name { display: none; }
      .navbar { padding: 0 12px; }
    }
  `],
})
export class NavbarComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  logout() {
    this.auth.logout();
  }
}
