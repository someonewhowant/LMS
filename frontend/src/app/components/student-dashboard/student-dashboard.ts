import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [RouterLink],
  templateUrl: './student-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
