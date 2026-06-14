import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { ButtonComponent } from '../../shared/ui/button/button';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonComponent],
  template: `
<div class="min-h-[calc(100vh-64px)] flex items-center justify-center p-md bg-background relative overflow-hidden my-lg">
  <!-- Decor -->
  <div class="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
  <div class="absolute bottom-1/4 left-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[100px] pointer-events-none"></div>

  <div class="w-full max-w-lg relative z-10">
    <div class="bg-surface-container rounded-2xl p-xl border border-outline-variant shadow-glow">
      <div class="text-center mb-xl">
        <h1 class="font-display-sm text-[32px] font-bold text-on-surface mb-2">Create an Account</h1>
        <p class="text-body-md text-on-surface-variant">Join CodeBlog Academy and start building.</p>
      </div>

      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-lg">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-md">
          <!-- First Name -->
          <div class="space-y-1">
            <label for="firstName" class="block text-[12px] font-label-caps text-on-surface-variant">First Name</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
              <input 
                id="firstName" 
                type="text" 
                formControlName="firstName"
                class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline"
                placeholder="John"
              />
            </div>
          </div>
          <!-- Last Name -->
          <div class="space-y-1">
            <label for="lastName" class="block text-[12px] font-label-caps text-on-surface-variant">Last Name</label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">person</span>
              <input 
                id="lastName" 
                type="text" 
                formControlName="lastName"
                class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline"
                placeholder="Doe"
              />
            </div>
          </div>
        </div>

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
              class="w-full bg-surface-container-high border border-outline-variant rounded-lg py-2 pl-10 pr-4 text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline"
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
          variant="primary" 
          size="md" 
          [fullWidth]="true" 
          type="submit" 
          [disabled]="registerForm.invalid || isLoading">
          <span *ngIf="!isLoading">Create Account</span>
          <span *ngIf="isLoading" class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
        </button>
      </form>

      <div class="mt-lg text-center text-body-sm text-on-surface-variant">
        Already have an account? 
        <a routerLink="/login" class="text-primary hover:underline font-bold">Sign in</a>
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
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.errorMessage = '';
    
    // Mock Registration:
    setTimeout(() => {
      this.isLoading = false;
      this.authService['currentUserSignal'].set({
        id: '1', 
        email: this.registerForm.value.email, 
        firstName: this.registerForm.value.firstName, 
        lastName: this.registerForm.value.lastName, 
        role: 'student'
      });
      this.router.navigate(['/dashboard']);
    }, 1000);
  }
}
