import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { Blog, BlogComment } from '../models/blog.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private apiUrl = `${environment.apiUrl}/blog`;

  constructor(private http: HttpClient) {}

  fetchAllBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/get`).pipe(
      map((res) => Array.isArray(res) ? res : [])
    );
  }

  fetchComments(blogId: string, page = 1, limit = 10): Observable<BlogComment[]> {
    return this.http
      .get<{ comments: BlogComment[] }>(`${this.apiUrl}/${blogId}/comment?page=${page}&limit=${limit}`)
      .pipe(map(res => Array.isArray(res.comments) ? res.comments : []));
  }

  addComment(blogId: string, content: string): Observable<BlogComment> {
    return this.http
      .post(`${this.apiUrl}/${blogId}/comment/add`, { content })
      .pipe(map(res => res as BlogComment));
  }

  replyToComment(blogId: string, commentId: string, content: string, parentReplyIds: string[] = []): Observable<BlogComment> {
    return this.http
      .post(`${this.apiUrl}/${blogId}/comment/${commentId}/reply/add`, { content, parentReplyIds })
      .pipe(map(res => res as BlogComment));
  }
}
