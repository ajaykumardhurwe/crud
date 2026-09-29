import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/models';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-my-posts',
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
        <h1><mat-icon>article</mat-icon> My Posts</h1>
        <a mat-raised-button color="primary" routerLink="/create-post" class="create-btn">
          <mat-icon>add</mat-icon> New Post
        </a>
      </div>

      @if (isLoading) {
        <div class="loading-state">
          <mat-spinner diameter="48"></mat-spinner>
          <p>Loading your posts...</p>
        </div>
      } @else if (posts.length === 0) {
        <div class="empty-state">
          <mat-icon>inbox</mat-icon>
          <h2>No posts yet</h2>
          <p>You haven't created any posts.</p>
          <a mat-raised-button color="primary" routerLink="/create-post">
            <mat-icon>add</mat-icon> Create Post
          </a>
        </div>
      } @else {
        <div class="posts-list">
          @for (post of posts; track post.id) {
            <mat-card class="post-card">
              @if (post.image) {
                <div class="post-image-wrapper">
                  <img [src]="post.image" [alt]="post.title" class="post-image" />
                </div>
              }
              <mat-card-content class="post-content">
                <h2 class="post-title">{{ post.title }}</h2>
                <p class="post-text">{{ post.content }}</p>
                <div class="post-date">
                  <mat-icon>schedule</mat-icon>
                  {{ post.createdAt | date: 'medium' }}
                </div>
                <div class="post-actions">
                  <button
                    mat-raised-button
                    color="primary"
                    (click)="editPost(post.id)"
                    class="action-btn"
                  >
                    <mat-icon>edit</mat-icon>
                    Edit
                  </button>
                  <button
                    mat-stroked-button
                    color="warn"
                    (click)="deletePost(post)"
                    class="action-btn"
                  >
                    <mat-icon>delete</mat-icon>
                    Delete
                  </button>
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
      max-width: 800px;
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
    .create-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      border-radius: 10px;
    }
    .loading-state, .empty-state {
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
    .empty-state h2 { color: #334155; margin: 0; }
    .empty-state p { color: #64748b; margin: 0 0 12px; }
    .posts-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .post-card {
      border-radius: 16px;
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .post-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0,0,0,0.1);
    }
    .post-image-wrapper {
      width: 100%;
      height: 200px;
      overflow: hidden;
      background: #f1f5f9;
    }
    .post-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .post-content { padding: 20px 24px 24px; }
    .post-title {
      font-size: 20px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 8px;
    }
    .post-text {
      color: #475569;
      font-size: 15px;
      line-height: 1.6;
      margin: 0 0 12px;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .post-date {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #94a3b8;
      font-size: 13px;
      margin-bottom: 16px;
    }
    .post-date mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .post-actions {
      display: flex;
      gap: 12px;
    }
    .action-btn {
      display: flex;
      align-items: center;
      gap: 4px;
      border-radius: 10px;
    }
    @media (max-width: 768px) {
      .page-header { flex-direction: column; gap: 12px; align-items: flex-start; }
      .post-actions { flex-direction: column; }
      .action-btn { width: 100%; }
    }
  `],
})
export class MyPostsComponent implements OnInit {
  private postService = inject(PostService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  posts: Post[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadPosts();
  }

  loadPosts() {
    this.isLoading = true;
    this.postService.getMyPosts().subscribe({
      next: (data) => {
        this.posts = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load your posts', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  editPost(id: number) {
    this.router.navigate(['/edit-post', id]);
  }

  deletePost(post: Post) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Post',
        message: `Are you sure you want to delete "${post.title}"? This action cannot be undone.`,
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.postService.deletePost(post.id).subscribe({
          next: () => {
            this.posts = this.posts.filter((p) => p.id !== post.id);
            this.snackBar.open('Post deleted', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to delete post', 'Close', {
              duration: 4000,
              panelClass: ['error-snackbar'],
            });
          },
        });
      }
    });
  }
}
