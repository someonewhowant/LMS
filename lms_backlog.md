# LMS Platform Backlog
## Часть 1: Бэкенд (NestJS + Prisma + SQLite)

### Epic 1: Инициализация проекта и базовая инфраструктура (Project Setup & Core)
* **Task 1.1:** Инициализировать проект NestJS (`@nestjs/cli`).
* **Task 1.2:** Настроить Prisma ORM и подключить базу данных SQLite (`prisma init`).
* **Task 1.3:** Настроить глобальные Exception Filters и Interceptors.
* **Task 1.4:** Настроить валидацию данных (`class-validator`, `class-transformer` и глобальный `ValidationPipe`).
* **Task 1.5:** Настроить Swagger для автодокументации REST API (`@nestjs/swagger`).

### Epic 2: Пользователи и Аутентификация (Users & Auth)
* **Task 2.1:** Спроектировать Prisma-модели: `User` (id, email, password, role, timestamps). Добавить `enum Role { STUDENT, TEACHER, ADMIN }`.
* **Task 2.2:** Реализовать `UsersModule` (CRUD операции).
* **Task 2.3:** Реализовать `AuthModule` с использованием JWT (`@nestjs/jwt`, `@nestjs/passport`).
* **Task 2.4:** Настроить стратегии аутентификации (Local Strategy, JWT Strategy).
* **Task 2.5:** Создать Guard'ы для авторизации по ролям (RolesGuard).
* **Task 2.6:** Реализовать эндпоинты `/auth/register`, `/auth/login`, `/auth/me`.

### Epic 3: Блог и контент-менеджмент (CMS Core)
* **Task 3.1:** Спроектировать модели: `Category`, `Tag`, `Post`, `Comment`, `Bookmark`.
* **Task 3.2:** Создать `CategoriesModule` и `TagsModule` (CRUD API).
* **Task 3.3:** Создать `PostsModule` (API с пагинацией и фильтрацией, привязка автора/тегов).
* **Task 3.4:** Реализовать `CommentsModule` (древовидная структура комментариев).
* **Task 3.5:** Реализовать `BookmarksModule` (добавление в избранное).

### Epic 4: Образовательная платформа (LMS Core)
* **Task 4.1:** Спроектировать модели: `Course`, `CourseModule`, `Assignment`.
* **Task 4.2:** Создать `CoursesModule` (CRUD курсов).
* **Task 4.3:** Реализовать `CourseModulesModule` (структура уроков курса).
* **Task 4.4:** Создать `AssignmentsModule` и `AssignmentSubmissionsModule`.
* **Task 4.5:** Спроектировать модели тестирования: `Quiz`, `Question`, `QuestionOption`, `UserQuizResult`.
* **Task 4.6:** Реализовать API для управления квизами (создание через транзакции Prisma).
* **Task 4.7:** Реализовать логику прохождения квиза и автоподсчета баллов.
* **Task 4.8:** Создать `PeerReviewsModule` (взаимопроверка заданий).

### Epic 5: Интерактивная песочница (Coding Sandbox)
* **Task 5.1:** Спроектировать модели: `CodingTask`, `CodingSubmission`.
* **Task 5.2:** Создать `CodingTasksModule` (управление задачами).
* **Task 5.3:** Реализовать Sandbox Service (интеграция с Docker или Piston/Judge0 API для безопасного запуска кода).
* **Task 5.4:** Создать API для отправки кода и возврата логов/статусов выполнения.

### Epic 6: Геймификация и Аналитика
* **Task 6.1:** Спроектировать модели: `Achievement`, `UserAchievement`.
* **Task 6.2:** Создать `AchievementsModule` (выдача бейджей).
* **Task 6.3:** Реализовать `LeaderboardModule` (топ студентов по XP/баллам).
* **Task 6.4:** Создать `AnalyticsModule` (статистика для панели преподавателя).

### Epic 7: Социальные взаимодействия
* **Task 7.1:** Спроектировать модели: `ChatMessage`, `Notification`.
* **Task 7.2:** Настроить модуль WebSockets (`@nestjs/websockets`).
* **Task 7.3:** Создать `ChatGateway` и `ChatService` (чаты в реальном времени).
* **Task 7.4:** Реализовать `NotificationsModule` (REST + push через сокеты).

### Epic 8: Финализация бэкенда
* **Task 8.1:** Настроить `MulterModule` для загрузки файлов (аватарки, обложки, документы).
* **Task 8.2:** Настроить `ServeStaticModule` для раздачи статики.
* **Task 8.3:** Написать E2E-тесты для критичных путей.
* **Task 8.4:** Оптимизировать тяжелые запросы Prisma.

---

## Часть 2: Фронтенд (Angular)

### Epic 1: Инициализация проекта и Архитектура
* **Task 1.1:** Инициализировать Angular-проект со Standalone Components.
* **Task 1.2:** Настроить архитектуру папок (Core, Shared, Features, Layouts).
* **Task 1.3:** Настроить environment-переменные для работы с NestJS API.
* **Task 1.4:** Создать HttpInterceptor'ы (JWT auth, глобальный error handler).
* **Task 1.5:** Внедрить State Management (NgRx SignalStore).

### Epic 2: Дизайн-система и UI Kit
* **Task 2.1:** Настроить CSS-переменные (типографика, палитра Indigo/Emerald).
* **Task 2.2:** Создать `ThemeService` (Dark/Light темы).
* **Task 2.3:** Разработать базовые компоненты (Button, Input, Card, Modal, Toaster, Spinner).
* **Task 2.4:** Создать компоненты Layout (Header, Sidebar, Footer).
* **Task 2.5:** Интегрировать библиотеку иконок (Bootstrap Icons / Lucide).

### Epic 3: Аутентификация и Роутинг
* **Task 3.1:** Реализовать `AuthService` и `TokenService`.
* **Task 3.2:** Создать `LoginPage` и `RegisterPage` (Reactive Forms).
* **Task 3.3:** Настроить Angular Router с Lazy Loading.
* **Task 3.4:** Написать Route Guards (AuthGuard, RoleGuard, GuestGuard).

### Epic 4: Блог и Контент (CMS Frontend)
* **Task 4.1:** Создать `BlogFeedPage` (Infinite Scroll, фильтры).
* **Task 4.2:** Разработать компонент превью статьи `PostCard`.
* **Task 4.3:** Реализовать `PostDetailsPage` с поддержкой Markdown (`ngx-markdown`).
* **Task 4.4:** Создать блок комментариев (дерево комментариев + форма добавления).
* **Task 4.5:** Интегрировать функцию добавления в закладки.

### Epic 5: Образовательная платформа (Student View)
* **Task 5.1:** Создать `CourseCatalogPage` и страницу описания курса.
* **Task 5.2:** Разработать `CoursePlayerLayout` (sidebar уроков + main content).
* **Task 5.3:** Реализовать просмотр текстовых и видеоуроков.
* **Task 5.4:** Создать `QuizPlayerComponent` (пошаговое прохождение теста).
* **Task 5.5:** Реализовать `AssignmentSubmissionComponent` (отправка дз/файлов).
* **Task 5.6:** Разработать интерфейс Peer Review.

### Epic 6: Панель Преподавателя (Teacher Dashboard)
* **Task 6.1:** Создать Layout панели управления (статистика, списки курсов).
* **Task 6.2:** Разработать Конструктор Курсов (`CourseEditorPage`) на базе сложных Reactive Forms (`FormArray`).
* **Task 6.3:** Создать Конструктор Квизов (`QuizEditorComponent`).
* **Task 6.4:** Реализовать интерфейс проверки отправленных заданий студентов.

### Epic 7: Интерактивная песочница (Coding Sandbox)
* **Task 7.1:** Интегрировать веб-редактор кода (Monaco Editor / CodeMirror).
* **Task 7.2:** Создать `CodingTaskPage` (условие задачи + редактор кода).
* **Task 7.3:** Настроить сервисы взаимодействия с API для запуска и получения результатов (вывод консоли, статус тестов).

### Epic 8: Геймификация и Профиль
* **Task 8.1:** Реализовать `ProfilePage` (редактирование настроек, загрузка аватарки).
* **Task 8.2:** Создать UI для отображения ачивок/бейджей.
* **Task 8.3:** Разработать `LeaderboardPage` (таблица рейтинга с анимациями).

### Epic 9: Социальные взаимодействия (WebSockets)
* **Task 9.1:** Интегрировать сервис сокетов для взаимодействия с бекендом.
* **Task 9.2:** Создать виджет уведомлений (`NotificationBell`) в Header.
* **Task 9.3:** Разработать модуль чата (`ChatComponent` с логгером сообщений).
