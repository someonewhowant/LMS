import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { guestGuard } from './core/auth/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingPageComponent),
      },
      {
        path: 'courses',
        loadComponent: () => import('./features/catalog/catalog.component').then(m => m.CatalogComponent),
      },
      {
        path: 'courses/:id',
        loadComponent: () => import('./features/course-details/course-details.component').then(m => m.CourseDetailsComponent),
      },
      {
        path: 'player/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./features/course-player/course-player.component').then(m => m.CoursePlayerComponent),
      },
      {
        path: 'articles',
        loadComponent: () => import('./features/articles/articles.component').then(m => m.ArticlesComponent),
      },
      {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
      },
      {
        path: 'register',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent),
      },
      {
        path: 'register-teacher',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register-teacher/register-teacher.component').then(m => m.RegisterTeacherComponent),
      }
    ]
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/dashboard-layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      }
    ]
  }
];

