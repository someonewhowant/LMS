import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header';
import { FooterComponent } from '../footer/footer';

@Component({
  selector: 'app-about-platform',
  imports: [RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './about-platform.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AboutPlatformComponent {
  readonly authService = inject(AuthService);

  readonly stats = [
    { value: '3', label: 'Роли пользователей', desc: 'Студент, Преподаватель, Администратор' },
    { value: '100%', label: 'Интерактивность', desc: 'Автопроверка тестов и песочница кода' },
    { value: 'API-First', label: 'Архитектура', desc: 'Связность NestJS бэкенда и Angular фронтенда' },
  ];

  readonly features = [
    {
      title: 'Управление обучением (LMS)',
      description: 'Курсы разделены на упорядоченные модули. Каждый модуль содержит лекции в HTML/Markdown, автопроверяемый GIFT-тест, практическую sandbox-задачу и письменные домашние задания.',
      icon: '📚',
      badge: 'LMS'
    },
    {
      title: 'Песочница кода (Coding Sandbox)',
      description: 'Интерактивный редактор прямо на платформе. Студенты пишут JavaScript, TypeScript или Python код и мгновенно проверяют его работоспособность на встроенных юнит-тестах.',
      icon: '💻',
      badge: 'Compiler'
    },
    {
      title: 'База знаний и Блог (CMS)',
      description: 'Публикация полезных материалов, разделенных по категориям и тегам. Поддержка комментариев для обсуждения и закладок для быстрого доступа к важным статьям или курсам.',
      icon: '📰',
      badge: 'CMS'
    },
    {
      title: 'Взаимное рецензирование (Peer Review)',
      description: 'Инструмент для развития навыков чтения чужого кода. Студенты проверяют решения друг друга, оставляют отзывы и делятся лучшими практиками.',
      icon: '🤝',
      badge: 'Сообщество'
    },
    {
      title: 'Интеллектуальная аналитика',
      description: 'Система отслеживает прогресс по каждому курсу, вычисляет процент освоения материалов и сохраняет место, на котором остановился студент (lastOpened координата).',
      icon: '📊',
      badge: 'Статистика'
    },
    {
      title: 'Чат в реальном времени',
      description: 'Мгновенная связь между студентами и преподавателями для консультаций по сложным темам, обсуждения оценок и поддержки в процессе прохождения курсов.',
      icon: '💬',
      badge: 'Коммуникации'
    }
  ];

  readonly roles = [
    {
      name: 'Студент',
      roleKey: 'STUDENT',
      colorClass: 'from-blue-500/20 to-indigo-500/20 border-indigo-500/30 text-indigo-400',
      icon: '👨‍🎓',
      privileges: [
        'Прохождение курсов, модулей и тестов',
        'Написание кода в песочнице и отправка решений',
        'Участие во взаимном peer-review рецензировании',
        'Просмотр личной детальной аналитики прогресса',
        'Чат с преподавателями для разбора вопросов'
      ]
    },
    {
      name: 'Преподаватель',
      roleKey: 'TEACHER',
      colorClass: 'from-violet-500/20 to-fuchsia-500/20 border-violet-500/30 text-violet-400',
      icon: '👩‍🏫',
      privileges: [
        'Создание и структурирование учебных курсов',
        'Загрузка GIFT-тестов и Markdown лекций',
        'Оценка и комментирование письменных домашних заданий',
        'Контроль за успеваемостью студентов',
        'Чат со студентами и ответы на вопросы'
      ]
    },
    {
      name: 'Администратор',
      roleKey: 'ADMIN',
      colorClass: 'from-amber-500/20 to-rose-500/20 border-amber-500/30 text-amber-400',
      icon: '🛠️',
      privileges: [
        'Управление учетными записями и ролями пользователей',
        'Управление глобальным каталогом курсов и блогом',
        'Просмотр системных отчетов и логов безопасности',
        'Управление категориями и тегами публикаций',
        'Контроль за целостностью данных платформы'
      ]
    }
  ];
}
