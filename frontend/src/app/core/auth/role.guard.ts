import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Expected role should be passed in route data, e.g. { data: { expectedRole: 'TEACHER' } }
  const expectedRole = route.data['expectedRole'];

  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  const currentRole = authService.userRole();

  if (currentRole === expectedRole || currentRole === 'ADMIN') {
    return true;
  }

  // Not authorized for this role
  return router.parseUrl('/dashboard');
};
