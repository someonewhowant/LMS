import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseService, Course, CourseModule } from '../../services/course.service';
import { BookmarkService } from '../../services/bookmark.service';
import { BlogService, Category } from '../../services/blog.service';
@Component({
  selector: 'app-teacher-dashboard',
  imports: [RouterLink],
  templateUrl: './teacher-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeacherDashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly courseService = inject(CourseService);
  private readonly bookmarkService = inject(BookmarkService);
  private readonly blogService = inject(BlogService);
  private readonly router = inject(Router);

  // States
  readonly courses = signal<Course[]>([]);
  readonly bookmarks = signal<any[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly selectedCourse = signal<Course | null>(null);

  // Post Forms
  readonly showCreatePostModal = signal<boolean>(false);
  readonly newPostTitle = signal<string>('');
  readonly newPostContent = signal<string>('');
  readonly newPostCategoryId = signal<number | undefined>(undefined);
  readonly newPostTagNames = signal<string>('');
  readonly newPostCoverImage = signal<string>('');

  // Forms
  readonly showCreateCourseModal = signal<boolean>(false);
  readonly newCourseTitle = signal<string>('');
  readonly newCourseDescription = signal<string>('');

  readonly showCreateModuleModal = signal<boolean>(false);
  readonly newModuleTitle = signal<string>('');
  readonly newModuleDescription = signal<string>('');
  readonly newModuleOrder = signal<number>(1);
  readonly theoryFileContent = signal<string>('');
  readonly theoryFileName = signal<string>('');
  readonly giftFileContent = signal<string>('');
  readonly giftFileName = signal<string>('');

  readonly isSubmitting = signal<boolean>(false);
  readonly responseMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCourses();
    this.loadBookmarks();
    this.blogService.getCategories().subscribe(cats => this.categories.set(cats));
  }

  loadCourses(): void {
    this.isLoading.set(true);
    this.courseService.getCourses().subscribe({
      next: (coursesList) => {
        this.courses.set(coursesList);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching courses', err);
        this.isLoading.set(false);
      }
    });
  }

  selectCourse(course: Course): void {
    this.isLoading.set(true);
    this.courseService.getCourseById(course.id).subscribe({
      next: (courseData) => {
        this.selectedCourse.set(courseData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching course detail', err);
        this.isLoading.set(false);
      }
    });
  }

  onCreateCourse(): void {
    if (!this.newCourseTitle().trim()) return;

    this.isSubmitting.set(true);
    this.courseService.createCourse({
      title: this.newCourseTitle(),
      description: this.newCourseDescription()
    }).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        this.showCreateCourseModal.set(false);
        this.newCourseTitle.set('');
        this.newCourseDescription.set('');
        this.responseMessage.set(`Курс "${created.title}" успешно создан!`);
        this.loadCourses();
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
        this.responseMessage.set('Ошибка создания курса.');
      }
    });
  }

  onCreatePost(): void {
    if (!this.newPostTitle().trim() || !this.newPostContent().trim()) return;

    this.isSubmitting.set(true);
    const tagNames = this.newPostTagNames()
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const catId = this.newPostCategoryId();

    this.blogService.createPost({
      title: this.newPostTitle(),
      content: this.newPostContent(),
      coverImageUrl: this.newPostCoverImage() || undefined,
      categoryId: catId ? Number(catId) : undefined,
      tagNames
    }).subscribe({
      next: (post) => {
        this.isSubmitting.set(false);
        this.showCreatePostModal.set(false);
        this.newPostTitle.set('');
        this.newPostContent.set('');
        this.newPostCategoryId.set(undefined);
        this.newPostTagNames.set('');
        this.newPostCoverImage.set('');
        this.responseMessage.set(`Статья "${post.title}" успешно опубликована!`);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
        this.responseMessage.set('Ошибка создания статьи.');
      }
    });
  }

  onTheoryFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.theoryFileName.set(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.theoryFileContent.set(e.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  }

  onGiftFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.giftFileName.set(file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        this.giftFileContent.set(e.target?.result as string || '');
      };
      reader.readAsText(file);
    }
  }

  onCreateModule(): void {
    const course = this.selectedCourse();
    if (!course || !this.newModuleTitle().trim()) return;

    this.isSubmitting.set(true);
    this.courseService.createModule(course.id, {
      title: this.newModuleTitle(),
      description: this.newModuleDescription(),
      order: this.newModuleOrder(),
      theoryContent: this.theoryFileContent(),
      giftContent: this.giftFileContent()
    }).subscribe({
      next: (created) => {
        this.isSubmitting.set(false);
        this.showCreateModuleModal.set(false);
        this.newModuleTitle.set('');
        this.newModuleDescription.set('');
        this.newModuleOrder.set(1);
        this.theoryFileContent.set('');
        this.theoryFileName.set('');
        this.giftFileContent.set('');
        this.giftFileName.set('');
        this.responseMessage.set(`Модуль "${created.title}" успешно добавлен!`);
        
        // Refresh selected course
        this.selectCourse(course);
      },
      error: (err) => {
        console.error(err);
        this.isSubmitting.set(false);
        this.responseMessage.set('Ошибка добавления модуля.');
      }
    });
  }

  deleteModule(moduleId: number): void {
    if (!confirm('Вы уверены, что хотите удалить этот модуль?')) return;

    this.courseService.deleteModule(moduleId).subscribe({
      next: () => {
        this.responseMessage.set('Модуль удален.');
        const course = this.selectedCourse();
        if (course) {
          this.selectCourse(course);
        }
      },
      error: (err) => {
        console.error(err);
        this.responseMessage.set('Не удалось удалить модуль.');
      }
    });
  }

  loadBookmarks(): void {
    this.bookmarkService.getBookmarks().subscribe({
      next: (data) => this.bookmarks.set(data),
      error: (err) => console.error('Error fetching bookmarks', err)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
