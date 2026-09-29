import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1><mat-icon>edit_note</mat-icon> Create New Post</h1>
      </div>
      <mat-card class="form-card">
        <form [formGroup]="postForm" (ngSubmit)="onSubmit()" class="post-form">
          <mat-form-field appearance="outline">
            <mat-label>Title</mat-label>
            <mat-icon matPrefix>title</mat-icon>
            <input
              matInput
              type="text"
              formControlName="title"
              placeholder="Give your post a catchy title"
            />
            @if (postForm.get('title')?.hasError('required') && postForm.get('title')?.touched) {
              <mat-error>Title is required</mat-error>
            }
            @if (postForm.get('title')?.hasError('minlength') && postForm.get('title')?.touched) {
              <mat-error>Min 3 characters</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Content</mat-label>
            <mat-icon matPrefix>article</mat-icon>
            <textarea
              matInput
              formControlName="content"
              rows="6"
              placeholder="Share your thoughts..."
            ></textarea>
            @if (postForm.get('content')?.hasError('required') && postForm.get('content')?.touched) {
              <mat-error>Content is required</mat-error>
            }
            @if (postForm.get('content')?.hasError('minlength') && postForm.get('content')?.touched) {
              <mat-error>Min 10 characters</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Image URL</mat-label>
            <mat-icon matPrefix>image</mat-icon>
            <input
              matInput
              type="url"
              formControlName="image"
              placeholder="https://example.com/image.jpg"
            />
            @if (postForm.get('image')?.hasError('required') && postForm.get('image')?.touched) {
              <mat-error>Image URL is required</mat-error>
            }
          </mat-form-field>

          @if (postForm.get('image')?.value) {
            <div class="image-preview">
              <img [src]="postForm.get('image')?.value" alt="Preview" />
            </div>
          }

          <div class="form-actions">
            <button
              mat-button
              type="button"
              (click)="goBack()"
              class="cancel-btn"
            >
              Cancel
            </button>
            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="submit-btn"
              [disabled]="isLoading"
            >
              @if (isLoading) {
                <mat-spinner diameter="20" class="btn-spinner"></mat-spinner>
                Publishing...
              } @else {
                <ng-container><mat-icon>publish</mat-icon> Publish Post</ng-container>
              }
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container {
      max-width: 720px;
      margin: 0 auto;
      padding: 32px 24px;
    }
    .page-header {
      margin-bottom: 24px;
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
    .form-card {
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.08);
    }
    .post-form {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .post-form mat-form-field { width: 100%; }
    .image-preview {
      margin: 8px 0;
      border-radius: 12px;
      overflow: hidden;
      max-height: 300px;
      border: 1px solid #e2e8f0;
    }
    .image-preview img {
      width: 100%;
      max-height: 300px;
      object-fit: cover;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
    }
    .submit-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: 10px;
      padding: 0 24px;
      height: 44px;
    }
    .cancel-btn { border-radius: 10px; }
    .btn-spinner { display: inline-block; margin-right: 8px; }
    @media (max-width: 768px) {
      .form-actions { flex-direction: column-reverse; }
      .submit-btn, .cancel-btn { width: 100%; }
    }
  `],
})
export class CreatePostComponent {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  isLoading = false;

  postForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    content: ['', [Validators.required, Validators.minLength(10)]],
    image: ['', [Validators.required]],
  });

  onSubmit() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = this.postForm.getRawValue();

    this.postService.createPost(payload).subscribe({
      next: () => {
        this.snackBar.open('Post published successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/home']);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to create post', 'Close', {
          duration: 4000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
