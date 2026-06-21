import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface Comment {
  id: number;
  content: string;
  createdAt: string;
  user: {
    id: number;
    fullName: string;
  };
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  coverImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
  tags?: Tag[];
  comments?: Comment[];
  author?: {
    id: number;
    fullName: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/blog';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  getPosts(
    page: number = 1,
    limit: number = 10,
    sort: string = 'newest',
    categoryId?: number,
    tagId?: number,
    search?: string
  ): Observable<{ data: Post[], total: number }> {
    let url = `${this.baseUrl}/posts`;
    const params: string[] = [`page=${page}`, `limit=${limit}`, `sort=${sort}`];
    if (categoryId) params.push(`categoryId=${categoryId}`);
    if (tagId) params.push(`tagId=${tagId}`);
    if (search) params.push(`q=${encodeURIComponent(search)}`);
    url += `?${params.join('&')}`;
    return this.http.get<{ data: Post[], total: number }>(url, { headers: this.getHeaders() });
  }

  getPostByIdOrSlug(idOrSlug: string): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}/posts/${idOrSlug}`, { headers: this.getHeaders() });
  }

  createPost(data: { title: string; content: string; coverImageUrl?: string; categoryId?: number; tagNames?: string[] }): Observable<Post> {
    return this.http.post<Post>(`${this.baseUrl}/posts`, data, { headers: this.getHeaders() });
  }

  createComment(postId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(`${this.baseUrl}/posts/${postId}/comments`, { content }, { headers: this.getHeaders() });
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`, { headers: this.getHeaders() });
  }

  createCategory(name: string): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/categories`, { name }, { headers: this.getHeaders() });
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.baseUrl}/tags`, { headers: this.getHeaders() });
  }
}
