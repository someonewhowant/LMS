import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';
import { ButtonComponent } from '../../../shared/ui/button/button';

@Component({
  selector: 'app-register-teacher',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent],
  template: `
<div class="min-h-[calc(100vh-64px)] flex items-center justify-center p-md bg-background relative overflow-hidden my-lg">
  <!-- Decor -->
  <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none"></div>
  <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

  <div class="w-full max-w-md relative z-10">
    <div class="bg-surface-container rounded-2xl p-xl border border-tertiary/30 shadow-glow-tertiary">
      <div class="text-center mb-xl">
        <div class="w-16 h-16 bg-tertiary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-tertiary/50">
          <span class="material-symbols-outlined text-tertiary text-3xl">school</span>
        </div>
        <h1 class="font-display-sm text-[32px] font-bold text-on-surface mb-2">Apply as an Instructor</h1>
        <p class="text-body-md text-on-surface-variant">Share your knowledge and earn on CodeBlog Academy.</p>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-lg">
        <!-- Email Field -->
        <div class="space-y-1">
          <label for="email" class="block text-[12px] font-label-caps text-on-surface-variant">Professional Email Address</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">mail</span>
            <input 
              id="email" 
              type="email" 
              formControlName="email"
              class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-on-surface focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none transition-all placeholder:text-outline"
              placeholder="instructor@example.com"
            />
          </div>
          <div *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid" class="text-[12px] text-error mt-1">
            Please enter a valid email address.
          </div>
        </div>

        <!-- Password Field -->
        <div class="space-y-1">
          <label for="password" class="block text-[12px] font-label-caps text-on-surface-variant">Password</label>
          <div class="relative">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">lock</span>
            <input 
              id="password" 
              type="password" 
              formControlName="password"
              class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-on-surface focus:border-tertiary focus:ring-1 focus:ring-tertiary outline-none transition-all placeholder:text-outline"
              placeholder="Min. 8 characters"
            />
          </div>
          <div *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid" class="text-[12px] text-error mt-1">
            Password must be at least 8 characters.
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
          variant="secondary" 
          size="md" 
          [fullWidth]="true" 
          type="submit" 
          [disabled]="registerForm.invalid || isLoading">
          <span *ngIf="!isLoading">Submit Application</span>
          <span *ngIf="isLoading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        </button>
      </form>

      <div class="mt-lg text-center text-body-sm text-on-surface-variant flex flex-col gap-2">
        <div>
          Already have an instructor account? 
          <a routerLink="/login" class="text-tertiary hover:underline font-bold">Sign in</a>
        </div>
        <div class="pt-4 border-t border-outline-variant mt-2">
          Looking to learn instead? 
          <a routerLink="/register" class="text-primary hover:underline font-bold">Register as a student</a>
        </div>
      </div>
    </div>
  </div>
</div>
  `,
  styles: `
    .text-error { color: #ffb4ab; }
    .bg-error-container { background-color: #93000a; }
    .text-on-error-container { color: #ffdad6; }
    .shadow-glow-tertiary {
      box-shadow: 0 0 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(223, 116, 18, 0.1);
    }
  `
})
export class RegisterTeacherComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    
    const payload = {
      ...this.registerForm.value,
      role: 'TEACHER'
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Registration failed';
      }
    });
  }
}
