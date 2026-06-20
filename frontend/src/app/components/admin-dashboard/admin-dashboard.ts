import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardComponent {
  readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Signals
  readonly isFetchingBlog = signal<boolean>(false);
  readonly apiResponse = signal<any | null>(null);
  readonly errorMessage = signal<string | null>(null);

  fetchBlogManagement(): void {
    this.isFetchingBlog.set(true);
    this.apiResponse.set(null);
    this.errorMessage.set(null);

    const token = localStorage.getItem('token');
    
    this.http.get('http://localhost:3000/api/admin/blog', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res: any) => {
        this.isFetchingBlog.set(false);
        this.apiResponse.set(res);
      },
      error: (err) => {
        this.isFetchingBlog.set(false);
        if (err.status === 403) {
          this.errorMessage.set('Ошибка доступа (403 Forbidden): Доступ к управлению блогом разрешен только Администраторам!');
        } else {
          console.warn('Backend integration warning, falling back to mock blog manager', err);
          this.apiResponse.set({
            message: 'Имитация управления блогом (Бэкенд не отвечает)',
            mockData: {
              publishedPostsCount: 15,
              draftPostsCount: 3,
              totalBlogViewsCount: 4290
            }
          });
        }
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
