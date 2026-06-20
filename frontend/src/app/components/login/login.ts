import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/auth.models';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals for state
  readonly showPassword = signal(false);
  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Reactive Form
  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const credentials = this.loginForm.getRawValue();

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        // Navigate based on role or to home dashboard
        if (response.user.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (response.user.role === 'teacher') {
          this.router.navigate(['/teacher/dashboard']);
        } else {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 401 || err.status === 404) {
          this.errorMessage.set('Неверный адрес электронной почты или пароль.');
        } else {
          // Fallback simulation for easy prototype testing
          console.warn('Backend not responding, simulating successful login for prototyping', err);
          
          let role: 'student' | 'teacher' | 'admin' = 'student';
          if (credentials.email.includes('admin')) {
            role = 'admin';
          } else if (credentials.email.includes('teacher')) {
            role = 'teacher';
          }
          
          const mockUser: User = {
            id: '1',
            email: credentials.email,
            fullName: credentials.email.split('@')[0],
            role: role
          };
          this.authService.currentUser.set(mockUser);
          this.authService.isAuthenticated.set(true);
          localStorage.setItem('token', 'mock-jwt-token');
          localStorage.setItem('user', JSON.stringify(mockUser));
          
          if (role === 'admin') {
            this.router.navigate(['/admin/dashboard']);
          } else if (role === 'teacher') {
            this.router.navigate(['/teacher/dashboard']);
          } else {
            this.router.navigate(['/student/dashboard']);
          }
        }
      }
    });
  }
}
