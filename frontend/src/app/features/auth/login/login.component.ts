import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ButtonComponent } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent],
  template: `
<div class="min-h-[calc(100vh-64px)] flex items-center justify-center p-md bg-background relative overflow-hidden">
  <!-- Decor -->
  <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
  <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none"></div>

  <div class="w-full max-w-md relative z-10">
    <div class="bg-surface-container rounded-2xl p-xl border border-outline-variant shadow-glow">
      <div class="text-center mb-xl">
        <h1 class="font-display-sm text-[32px] font-bold text-on-surface mb-2">Welcome Back</h1>
        <p class="text-body-md text-on-surface-variant">Sign in to continue your learning journey.</p>
      </div>

      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-lg">
        <!-- Email Field -->
        <div class="space-y-1">
          <label for="email" class="block text-[12px] font-label-caps text-on-surface-variant">Email Address</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline"
              placeholder="you@example.com"
            />
          </div>
          <div *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="text-[12px] text-error mt-1">
            <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required.</span>
            <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email address.</span>
          </div>
        </div>

        <!-- Password Field -->
        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label for="password" class="block text-[12px] font-label-caps text-on-surface-variant">Password</label>
            <a href="#" class="text-[12px] text-primary hover:underline">Forgot password?</a>
          </div>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline"
              placeholder="••••••••"
            />
          </div>
          <div *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid" class="text-[12px] text-error mt-1">
            Password is required.
          </div>
        </div>

        <!-- Error Message -->
        <div *ngIf="errorMessage" class="bg-error-container text-on-error-container p-3 rounded-lg text-body-sm flex items-start gap-2">
           <span class="material-symbols-outlined text-[18px]">error</span>
           <span>{{ errorMessage }}</span>
        </div>

        <!-- Submit -->
        <button 
          app-button 
          variant="primary" 
          size="md" 
          [fullWidth]="true" 
          type="submit" 
          [disabled]="loginForm.invalid || isLoading">
          <span *ngIf="!isLoading">Sign In</span>
          <span *ngIf="isLoading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        </button>
      </form>

      <div class="mt-lg text-center text-body-sm text-on-surface-variant">
        Don't have an account? 
        <a routerLink="/register" class="text-primary hover:underline font-bold">Sign up</a>
      </div>
    </div>
  </div>
</div>
  `,
  styles: `
    .text-error { color: #ffb4ab; }
    .bg-error-container { background-color: #93000a; }
    .text-on-error-container { color: #ffdad6; }
    .shadow-glow {
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(173, 198, 255, 0.05);
    }
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    
    // In a real scenario:
    /*
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Invalid email or password';
      }
    });
    */

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Invalid email or password';
      }
    });
  }
}
