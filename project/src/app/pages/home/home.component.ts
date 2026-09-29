import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1><mat-icon>dynamic_feed</mat-icon> Recent Posts</h1>
        <a mat-raised-button color="primary" routerLink="/create-post" class="create-btn">
          <mat-icon>add</mat-icon> New Post
        </a>
      </div>

      @if (isLoading) {
        <div class="loading-state">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Loading posts...</p>
        </div>
      } @else if (posts.length === 0) {
        <div class="empty-state">
          <mat-icon>post_add</mat-icon>
          <h2>No posts yet</h2>
          <p>Be the first to share something!</p>
          <a mat-raised-button color="primary" routerLink="/create-post">
            <mat-icon>add</mat-icon> Create Post
          </a>
        </div>
      } @else {
        <div class="posts-grid">
          @for (post of posts; track post.id) {
            <mat-card class="post-card">
              @if (post.image) {
                <div class="post-image-wrapper">
                  <img [src]="post.image" [alt]="post.title" class="post-image" />
                </div>
              }
              <mat-card-content class="post-content">
                <div class="post-author">
                  <mat-icon class="author-avatar">account_circle</mat-icon>
                  <span class="author-name">{{ post.username }}</span>
                </div>
                <h2 class="post-title">{{ post.title }}</h2>
                <p class="post-text">{{ post.content }}</p>
                <div class="post-date">
                  <mat-icon>schedule</mat-icon>
                  {{ post.createdAt | date: 'medium' }}
                </div>
              </mat-card-content>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 32px;
    }
    .page-header h1 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 28px;
      font-weight: 700;
      color: #1a237e;
      margin: 0;
    }
    .page-header h1 mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .create-btn {
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 80px 0;
      color: #64748b;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 80px 0;
      text-align: center;
    }
    .empty-state mat-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #94a3b8;
    }
    .empty-state h2 {
      color: #334155;
      margin: 0;
    }
    .empty-state p {
      color: #64748b;
      margin: 0 0 12px;
    }
    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }
    .post-card {
      border-radius: 16px;
      overflow: hidden;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
      cursor: default;
    }
    .post-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
    }
    .post-image-wrapper {
      width: 100%;
      height: 220px;
      overflow: hidden;
      background: #f1f5f9;
    }
    .post-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .post-card:hover .post-image {
      transform: scale(1.05);
    }
    .post-content {
      padding: 20px 24px 24px;
    }
    .post-author {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    .author-avatar {
      color: #1a237e;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    .author-name {
      font-weight: 600;
      color: #1a237e;
      font-size: 14px;
    }
    .post-title {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px;
      line-height: 1.3;
    }
    .post-text {
      color: #475569;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 16px;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .post-date {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #94a3b8;
      font-size: 13px;
    }
    .post-date mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    @media (max-width: 768px) {
      .posts-grid { grid-template-columns: 1fr; }
      .page-header { flex-direction: column; gap: 12px; align-items: flex-start; }
    }
  `],
})
export class HomeComponent implements OnInit {
  private postService = inject(PostService);
  private snackBar = inject(MatSnackBar);

  posts: Post[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load posts', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
