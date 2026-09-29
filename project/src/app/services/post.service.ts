import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Post, PostPayload } from '../models/models';

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllPosts() {
    return this.http.get<Post[]>(`${this.apiUrl}/posts`);
  }

  getMyPosts() {
    return this.http.get<Post[]>(`${this.apiUrl}/posts/my`);
  }

  getPostById(id: number) {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  createPost(payload: PostPayload) {
    return this.http.post<Post>(`${this.apiUrl}/posts`, payload);
  }

  updatePost(id: number, payload: PostPayload) {
    return this.http.put<Post>(`${this.apiUrl}/posts/${id}`, payload);
  }

  deletePost(id: number) {
    return this.http.delete(`${this.apiUrl}/posts/${id}`);
  }
}
