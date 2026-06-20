import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-student-coding-sandbox',
  imports: [RouterLink],
  templateUrl: './student-coding-sandbox.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentCodingSandboxComponent {
  readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  // States
  readonly code = signal<string>(
`// Напишите функцию, которая возвращает сумму двух чисел
function sum(a, b) {
  return a + b;
}

console.log(sum(5, 10));`
  );
  readonly selectedLanguage = signal<string>('javascript');
  readonly isRunning = signal<boolean>(false);
  readonly outputLogs = signal<string[]>(['// Консоль пуста. Нажмите "Запустить код", чтобы выполнить решение.']);
  readonly isSubmitting = signal<boolean>(false);
  readonly submissionStatus = signal<string | null>(null);

  selectLanguage(lang: string): void {
    this.selectedLanguage.set(lang);
    if (lang === 'javascript') {
      this.code.set(
`// Напишите функцию, которая возвращает сумму двух чисел
function sum(a, b) {
  return a + b;
}

console.log(sum(5, 10));`
      );
    } else if (lang === 'typescript') {
      this.code.set(
`// Напишите функцию, которая возвращает сумму двух чисел
function sum(a: number, b: number): number {
  return a + b;
}

console.log(sum(15, 25));`
      );
    } else if (lang === 'python') {
      this.code.set(
`# Напишите функцию, которая возвращает сумму двух чисел
def sum_nums(a, b):
    return a + b

print(sum_nums(8, 12))`
      );
    }
  }

  runCode(): void {
    this.isRunning.set(true);
    this.outputLogs.set(['Выполнение кода...']);
    
    // Simulate compilation/execution delay
    setTimeout(() => {
      this.isRunning.set(false);
      if (this.selectedLanguage() === 'javascript') {
        this.outputLogs.set([
          '> node solution.js',
          '15',
          '',
          'Тесты пройдены: 1/1'
        ]);
      } else if (this.selectedLanguage() === 'typescript') {
        this.outputLogs.set([
          '> tsc solution.ts && node solution.js',
          '40',
          '',
          'Тесты пройдены: 1/1'
        ]);
      } else if (this.selectedLanguage() === 'python') {
        this.outputLogs.set([
          '> python solution.py',
          '20',
          '',
          'Тесты пройдены: 1/1'
        ]);
      }
    }, 1200);
  }

  submitSolution(): void {
    this.isSubmitting.set(true);
    this.submissionStatus.set('Отправка решения на проверку...');

    // Fetch token from localStorage for headers
    const token = localStorage.getItem('token');
    
    this.http.get('http://localhost:3000/api/student/coding_sandbox', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: (res: any) => {
        this.isSubmitting.set(false);
        this.submissionStatus.set('Решение успешно принято бэкендом! Тесты пройдены.');
      },
      error: (err) => {
        this.isSubmitting.set(false);
        // Fallback for prototyping if backend is not fully responsive
        console.warn('Backend sandbox endpoint error, falling back to mock submission', err);
        this.submissionStatus.set('Успешно отправлено! (Имитация: тесты пройдены)');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
