import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseService, CatalogCourse } from '../../services/course.service';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly courseService = inject(CourseService);
  private readonly router = inject(Router);

  readonly courses = signal<CatalogCourse[]>([]);
  readonly isLoadingCourses = signal<boolean>(true);

  // Stats (could come from API later)
  readonly stats = [
    { value: '1,200+', label: 'Студентов', icon: 'people' },
    { value: '50+', label: 'Курсов', icon: 'school' },
    { value: '98%', label: 'Довольных', icon: 'thumb_up' },
    { value: '24/7', label: 'Поддержка', icon: 'support_agent' }
  ];

  // Features
  readonly features = [
    {
      icon: 'auto_stories',
      title: 'Интерактивные курсы',
      description: 'Модульная структура с теорией, тестами и практическими заданиями. Загрузка материалов в Markdown и GIFT форматах.',
      color: 'indigo'
    },
    {
      icon: 'code',
      title: 'Песочница кода',
      description: 'Встроенная среда выполнения кода с поддержкой JavaScript, TypeScript и Python. Автоматическая проверка решений.',
      color: 'violet'
    },
    {
      icon: 'analytics',
      title: 'Аналитика прогресса',
      description: 'Детальная статистика по каждому курсу, модулю и тесту. Отслеживание прогресса в реальном времени.',
      color: 'emerald'
    },
    {
      icon: 'rate_review',
      title: 'Взаимное рецензирование',
      description: 'Система peer review позволяет студентам оценивать работы друг друга, развивая навыки критического анализа.',
      color: 'amber'
    },
    {
      icon: 'quiz',
      title: 'Система тестирования',
      description: 'Парсер GIFT-формата для создания тестов. Автоматическая оценка ответов с мгновенной обратной связью.',
      color: 'rose'
    },
    {
      icon: 'bookmark',
      title: 'Закладки и блог',
      description: 'Сохраняйте курсы и статьи в закладки. Полнотекстовый поиск по базе знаний и публикациям.',
      color: 'cyan'
    }
  ];

  // Testimonials
  readonly testimonials = [
    {
      name: 'Алексей Петров',
      role: 'Студент, Frontend разработка',
      text: 'EduFlow помог мне структурировать обучение и пройти путь от новичка до уверенного junior-разработчика за 4 месяца.',
      avatar: 'A'
    },
    {
      name: 'Мария Соколова',
      role: 'Преподаватель, Python',
      text: 'Удобная система загрузки материалов в Markdown. Я могу быстро создавать модули с теорией и автоматическими тестами.',
      avatar: 'M'
    },
    {
      name: 'Дмитрий Козлов',
      role: 'Студент, Backend разработка',
      text: 'Песочница кода — это просто находка. Можно решать задачи прямо в браузере, не настраивая локальное окружение.',
      avatar: 'Д'
    }
  ];

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getPublicCatalog().subscribe({
      next: (courses) => {
        this.courses.set(courses.slice(0, 3));
        this.isLoadingCourses.set(false);
      },
      error: () => {
        this.isLoadingCourses.set(false);
      }
    });
  }

  getFeatureGradient(color: string): string {
    const map: Record<string, string> = {
      indigo: 'from-indigo-500/20 to-indigo-600/5',
      violet: 'from-violet-500/20 to-violet-600/5',
      emerald: 'from-emerald-500/20 to-emerald-600/5',
      amber: 'from-amber-500/20 to-amber-600/5',
      rose: 'from-rose-500/20 to-rose-600/5',
      cyan: 'from-cyan-500/20 to-cyan-600/5'
    };
    return map[color] || map['indigo'];
  }

  getFeatureIconColor(color: string): string {
    const map: Record<string, string> = {
      indigo: 'text-indigo-400',
      violet: 'text-violet-400',
      emerald: 'text-emerald-400',
      amber: 'text-amber-400',
      rose: 'text-rose-400',
      cyan: 'text-cyan-400'
    };
    return map[color] || 'text-indigo-400';
  }

  getFeatureBorderColor(color: string): string {
    const map: Record<string, string> = {
      indigo: 'border-indigo-800/30',
      violet: 'border-violet-800/30',
      emerald: 'border-emerald-800/30',
      amber: 'border-amber-800/30',
      rose: 'border-rose-800/30',
      cyan: 'border-cyan-800/30'
    };
    return map[color] || 'border-indigo-800/30';
  }
}
