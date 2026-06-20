import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Bookmark {
  id: number;
  targetType: 'post' | 'course';
  targetId: number;
  createdAt: string;
  title?: string;
  slugOrId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/bookmarks';

  private getHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  getBookmarks(): Observable<Bookmark[]> {
    return this.http.get<Bookmark[]>(this.baseUrl, { headers: this.getHeaders() });
  }

  checkBookmark(targetType: 'post' | 'course', targetId: number): Observable<{ bookmarked: boolean }> {
    return this.http.get<{ bookmarked: boolean }>(`${this.baseUrl}/check?targetType=${targetType}&targetId=${targetId}`, {
      headers: this.getHeaders()
    });
  }

  toggleBookmark(targetType: 'post' | 'course', targetId: number): Observable<{ bookmarked: boolean }> {
    return this.http.post<{ bookmarked: boolean }>(`${this.baseUrl}/toggle`, { targetType, targetId }, {
      headers: this.getHeaders()
    });
  }
}
