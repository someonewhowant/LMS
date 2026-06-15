import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Article } from '../../shared/components/article-card/article-card';
import { environment } from '../../../environments/environment';

const API_URL = `${environment.apiUrl}/api/posts`;
const COMMENTS_API = `${environment.apiUrl}/api/comments`;

export interface BackendPost {
  id: number;
  title: string;
  content: string;
  published: boolean;
  authorId: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  author: { id: number; email: string; role: string };
  category: { id: number; name: string; description: string };
  tags: Array<{ id: number; name: string }>;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  createdAt: string;
  author: {
    id: number;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private http = inject(HttpClient);

  getArticles(): Observable<Article[]> {
    return this.http.get<BackendPost[]>(API_URL).pipe(
      map(posts => posts.map(post => this.mapPostToArticle(post)))
    );
  }

  getArticle(id: number): Observable<Article & { content: string }> {
    return this.http.get<BackendPost>(`${API_URL}/${id}`).pipe(
      map(post => ({
        ...this.mapPostToArticle(post),
        content: post.content
      }))
    );
  }

  getComments(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${COMMENTS_API}/post/${postId}`);
  }

  addComment(postId: number, content: string): Observable<Comment> {
    return this.http.post<Comment>(COMMENTS_API, { postId, content });
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${COMMENTS_API}/${commentId}`);
  }

  private mapPostToArticle(post: BackendPost): Article {
    // Generate excerpt from content
    const excerpt = post.content.length > 150 
      ? post.content.substring(0, 150) + '...' 
      : post.content;

    // Calculate read time (avg 200 words per minute)
    const wordCount = post.content.split(/\s+/).length;
    const readTimeMins = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${readTimeMins} min read`;

    // Format date
    const date = new Date(post.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    // Frontend tags are category name + tag names
    const tags = [post.category.name, ...post.tags.map(t => t.name)];

    // Get author name from email
    const authorName = post.author.email.split('@')[0];
    const formattedName = authorName.charAt(0).toUpperCase() + authorName.slice(1);

    return {
      id: post.id.toString(),
      title: post.title,
      excerpt,
      date,
      readTime,
      tags,
      author: {
        name: formattedName,
        avatar: '' // Will use fallback initials/avatar
      }
    };
  }
}
