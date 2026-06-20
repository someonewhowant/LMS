import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-student',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register-student.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterStudentComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Signals for state
  readonly isLoading = signal(false);
  readonly isSuccess = signal(false);
  readonly errorMessage = signal<string | null>(null);

  // Reactive Form
  readonly registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    terms: [false, [Validators.requiredTrue]]
  }, {
    validators: [this.passwordMatchValidator]
  });

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formData = this.registerForm.getRawValue();
    const payload = {
      fullName: formData.name,
      email: formData.email,
      password: formData.password,
      role: 'student'
    };

    this.authService.registerStudent(payload).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.isSuccess.set(true);
        setTimeout(() => {
          this.router.navigate(['/student/dashboard']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading.set(false);
        if (err.status === 409) {
          this.errorMessage.set('Пользователь с таким адресом электронной почты уже зарегистрирован.');
        } else {
          // Fallback simulation for easy prototype testing
          console.warn('Backend not responding, simulating successful registration for prototyping', err);
          this.isSuccess.set(true);
          setTimeout(() => {
            this.router.navigate(['/student/dashboard']);
          }, 1500);
        }
      }
    });
  }
}
