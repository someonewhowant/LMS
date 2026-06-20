import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (allowedRoles: ('student' | 'teacher' | 'admin')[]): CanActivateFn => {
  return (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();
    const isAuthenticated = authService.isAuthenticated();

    if (!isAuthenticated || !user) {
      router.navigate(['/login']);
      return false;
    }

    if (allowedRoles.includes(user.role)) {
      return true;
    }

    // Redirect to their allowed dashboard if they try to access a page they don't have access to
    if (user.role === 'student') {
      router.navigate(['/student/dashboard']);
    } else if (user.role === 'teacher') {
      router.navigate(['/teacher/dashboard']);
    } else if (user.role === 'admin') {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/login']);
    }

    return false;
  };
};
