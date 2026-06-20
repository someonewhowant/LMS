import { Component, ChangeDetectionStrategy, inject, signal, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** If true, the header renders a transparent style for use on hero sections */
  readonly transparent = input<boolean>(false);

  readonly mobileMenuOpen = signal<boolean>(false);
  readonly profileDropdownOpen = signal<boolean>(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  toggleProfileDropdown(): void {
    this.profileDropdownOpen.update(v => !v);
  }

  closeProfileDropdown(): void {
    this.profileDropdownOpen.set(false);
  }

  getDashboardRoute(): string {
    const user = this.authService.currentUser();
    if (!user) return '/login';
    switch (user.role) {
      case 'student': return '/student/dashboard';
      case 'teacher': return '/teacher/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/login';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
