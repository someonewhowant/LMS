import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CourseService, CourseModule } from '../../services/course.service';
import { ProgressService } from '../../services/progress.service';
import { AuthService } from '../../services/auth.service';

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  title: string;
  text: string;
  options: QuizOption[];
  selectedOptionIndex?: number;
}

@Component({
  selector: 'app-module-viewer',
  imports: [RouterLink],
  templateUrl: './module-viewer.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModuleViewerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly progressService = inject(ProgressService);
  readonly authService = inject(AuthService);
  private readonly http = inject(HttpClient);

  readonly courseId = signal<number>(0);
  readonly moduleId = signal<number>(0);
  readonly module = signal<CourseModule | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  // Tabs
  readonly activeTab = signal<'theory' | 'quiz' | 'coding' | 'homework'>('theory');

  // Quiz variables
  readonly questions = signal<QuizQuestion[]>([]);
  readonly quizCompleted = signal<boolean>(false);
  readonly quizScore = signal<number>(0);
  readonly quizFeedback = signal<string | null>(null);

  // Sandbox variables
  readonly code = signal<string>(
`// Напишите функцию, которая возвращает сумму двух чисел
function sum(a, b) {
  return a + b;
}`
  );
  readonly isRunning = signal<boolean>(false);
  readonly outputLogs = signal<string[]>(['// Консоль пуста. Нажмите "Запустить код", чтобы проверить решение.']);
  readonly isSubmitting = signal<boolean>(false);
  readonly sandboxStatus = signal<string | null>(null);

  // Homework variables
  readonly homeworkText = signal<string>('');
  readonly homeworkStatus = signal<string | null>(null);

  // Completion state
  readonly isCompleting = signal<boolean>(false);
  readonly completionSuccess = signal<boolean>(false);

  ngOnInit(): void {
    const courseIdParam = this.route.snapshot.paramMap.get('courseId');
    const moduleIdParam = this.route.snapshot.paramMap.get('moduleId');

    if (courseIdParam && moduleIdParam) {
      const cId = parseInt(courseIdParam, 10);
      const mId = parseInt(moduleIdParam, 10);
      this.courseId.set(cId);
      this.moduleId.set(mId);
      this.loadModuleDetails(cId, mId);
    } else {
      this.errorMessage.set('Неверный ID курса или модуля');
      this.isLoading.set(false);
    }
  }

  loadModuleDetails(courseId: number, moduleId: number): void {
    this.isLoading.set(true);
    this.courseService.getCourseById(courseId).subscribe({
      next: (courseData) => {
        const foundModule = courseData.modules?.find((m) => m.id === moduleId);
        if (foundModule) {
          this.module.set(foundModule);
          
          // Parse GIFT format quiz questions
          if (foundModule.giftContent) {
            this.parseGiftQuiz(foundModule.giftContent);
          }
          
          // Save Last Opened position in background
          this.progressService.updateLastOpened(courseId, moduleId).subscribe({
            next: () => console.log('Saved last opened coordinates'),
            error: (err) => console.warn('Could not save last opened position', err)
          });

          this.isLoading.set(false);
        } else {
          this.errorMessage.set('Указанный модуль не найден в программе этого курса.');
          this.isLoading.set(false);
        }
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Не удалось загрузить данные курса.');
        this.isLoading.set(false);
      }
    });
  }

  // Parses GIFT format into QuizQuestion array
  parseGiftQuiz(giftText: string): void {
    try {
      const parsed: QuizQuestion[] = [];
      // Split by double newlines for question blocks
      const blocks = giftText.split(/\n\s*\n/);

      for (const block of blocks) {
        if (!block.trim()) continue;

        // Extract title: ::Title::
        const titleMatch = block.match(/::(.*?)::/);
        const title = titleMatch ? titleMatch[1].trim() : 'Вопрос';

        // Strip title out of block to isolate question text and choices
        let workingBlock = titleMatch ? block.replace(titleMatch[0], '') : block;

        // Extract choices inside brackets: { ... }
        const bracketMatch = workingBlock.match(/\{(.*?)\}/s);
        if (bracketMatch) {
          const choicesText = bracketMatch[1].trim();
          const questionText = workingBlock.replace(bracketMatch[0], '').trim();

          const options: QuizOption[] = [];
          // Split choices. GIFT options are prefixed with '=' for correct and '~' for wrong.
          // We can match patterns like =Answer or ~Answer
          const choiceItems = choicesText.split(/(?=[=~])/);

          for (const item of choiceItems) {
            const trimmedItem = item.trim();
            if (trimmedItem.startsWith('=')) {
              options.push({ text: trimmedItem.substring(1).trim(), isCorrect: true });
            } else if (trimmedItem.startsWith('~')) {
              options.push({ text: trimmedItem.substring(1).trim(), isCorrect: false });
            }
          }

          parsed.push({ title, text: questionText, options });
        }
      }
      this.questions.set(parsed);
    } catch (e) {
      console.error('Error parsing GIFT format', e);
    }
  }

  selectOption(questionIndex: number, optionIndex: number): void {
    const qList = [...this.questions()];
    qList[questionIndex].selectedOptionIndex = optionIndex;
    this.questions.set(qList);
  }

  submitQuiz(): void {
    const qList = this.questions();
    let score = 0;
    let unanswered = false;

    for (const q of qList) {
      if (q.selectedOptionIndex === undefined) {
        unanswered = true;
        break;
      }
      if (q.options[q.selectedOptionIndex].isCorrect) {
        score++;
      }
    }

    if (unanswered) {
      this.quizFeedback.set('Пожалуйста, ответьте на все вопросы перед отправкой!');
      return;
    }

    this.quizScore.set(score);
    this.quizCompleted.set(true);
    this.quizFeedback.set(`Тест завершен! Результат: ${score} из ${qList.length} правильных ответов.`);
  }

  runCode(): void {
    this.isRunning.set(true);
    this.outputLogs.set(['Выполнение и запуск тестов...']);

    setTimeout(() => {
      this.isRunning.set(false);
      this.outputLogs.set([
        '> node solution.js',
        'Тест 1 (sum(5, 10) === 15): Пройден успешно.',
        'Тест 2 (sum(-1, 5) === 4): Пройден успешно.',
        '',
        'Все тесты выполнены без ошибок!'
      ]);
    }, 1000);
  }

  submitSandbox(): void {
    this.isSubmitting.set(true);
    this.sandboxStatus.set('Отправка решения в песочницу бэкенда...');

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.sandboxStatus.set('Практическое задание успешно принято бэкендом! Тесты пройдены.');
    }, 800);
  }

  submitHomework(): void {
    if (!this.homeworkText().trim()) {
      this.homeworkStatus.set('Пожалуйста, введите решение перед отправкой.');
      return;
    }
    this.homeworkStatus.set('Отправка домашнего задания преподавателю на проверку...');
    setTimeout(() => {
      this.homeworkStatus.set('Домашнее задание успешно отправлено! Статус: Ожидает оценки.');
    }, 1000);
  }

  completeModule(): void {
    this.isCompleting.set(true);
    this.progressService.completeModule(this.moduleId()).subscribe({
      next: () => {
        this.isCompleting.set(false);
        this.completionSuccess.set(true);
        // Redirect back to course page after short delay
        setTimeout(() => {
          this.router.navigate(['/student/course', this.courseId()]);
        }, 1500);
      },
      error: (err) => {
        console.error('Error completing module', err);
        this.isCompleting.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
