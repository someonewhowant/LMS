import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-profile-settings',
  imports: [ReactiveFormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './profile-settings.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileSettingsComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  settingsForm!: FormGroup;
  readonly isSaving = signal<boolean>(false);
  readonly errorMessage = signal<string>('');
  readonly successMessage = signal<string>('');

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.settingsForm = this.fb.group({
      fullName: [user.fullName || '', [Validators.required, Validators.minLength(2)]],
      email: [{ value: user.email || '', disabled: true }],
      specialization: [user.specialization || ''],
      experience: [user.experience || null],
      newPassword: ['', [Validators.minLength(6)]],
      confirmPassword: ['']
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(g: FormGroup) {
    const newPwd = g.get('newPassword')?.value;
    const confirmPwd = g.get('confirmPassword')?.value;
    if (newPwd && newPwd !== confirmPwd) {
      g.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      g.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  saveProfile(): void {
    if (this.settingsForm.invalid) {
      this.errorMessage.set('Пожалуйста, исправьте ошибки в форме.');
      return;
    }

    this.isSaving.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const formValues = this.settingsForm.value;
    const user = this.authService.currentUser();

    const payload: any = {
      fullName: formValues.fullName
    };

    if (formValues.newPassword) {
      payload.password = formValues.newPassword;
    }

    if (user?.role === 'teacher') {
      payload.specialization = formValues.specialization;
      payload.experience = Number(formValues.experience) || 0;
    }

    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.successMessage.set('Профиль успешно обновлен!');
        // Reset password fields
        this.settingsForm.patchValue({
          newPassword: '',
          confirmPassword: ''
        });
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err.error?.message || 'Произошла ошибка при обновлении профиля.');
      }
    });
  }
}
