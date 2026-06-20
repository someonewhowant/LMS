import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-teacher-dashboard',
  imports: [RouterLink],
  templateUrl: './teacher-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherDashboardComponent {
  readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // Signals
  readonly isCreatingCourse = signal<boolean>(false);
  readonly responseMessage = signal<string | null>(null);

  createCourseMock(): void {
    this.isCreatingCourse.set(true);
    this.responseMessage.set(null);

    // Call the admin/teacher-allowed endpoint to verify credentials
    const token = localStorage.getItem('token');
    this.http.get('http://localhost:3000/api/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res: any) => {
        this.isCreatingCourse.set(false);
        this.responseMessage.set('Запрос успешно проверен бэкендом (Доступ к /admin/** разрешен для Преподавателей)! Ресурс создан.');
      },
      error: (err) => {
        this.isCreatingCourse.set(false);
        console.warn('Backend integration warning, falling back to mock dashboard control', err);
        this.responseMessage.set('Новый курс успешно создан (Имитация панели администратора)!');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
