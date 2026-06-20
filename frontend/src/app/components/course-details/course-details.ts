import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService, Course } from '../../services/course.service';
import { ProgressService, CourseProgress } from '../../services/progress.service';
import { AuthService } from '../../services/auth.service';
import { BookmarkService } from '../../services/bookmark.service';

@Component({
  selector: 'app-course-details',
  imports: [RouterLink],
  templateUrl: './course-details.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly courseService = inject(CourseService);
  private readonly progressService = inject(ProgressService);
  private readonly bookmarkService = inject(BookmarkService);
  readonly authService = inject(AuthService);

  readonly courseId = signal<number>(0);
  readonly course = signal<Course | null>(null);
  readonly progress = signal<CourseProgress | null>(null);
  readonly isBookmarked = signal<boolean>(false);
  readonly isLoading = signal<boolean>(true);
  readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('courseId');
    if (idParam) {
      const id = parseInt(idParam, 10);
      this.courseId.set(id);
      this.loadCourseAndProgress(id);
      this.checkBookmarkStatus(id);
    } else {
      this.errorMessage.set('Неверный ID курса');
      this.isLoading.set(false);
    }
  }

  loadCourseAndProgress(id: number): void {
    this.isLoading.set(true);
    this.courseService.getCourseById(id).subscribe({
      next: (courseData) => {
        this.course.set(courseData);
        this.loadProgress(id);
      },
      error: (err) => {
        console.error('Error fetching course', err);
        this.errorMessage.set('Не удалось загрузить данные курса. Возможно, он был удален.');
        this.isLoading.set(false);
      }
    });
  }

  loadProgress(id: number): void {
    this.progressService.getCourseProgress(id).subscribe({
      next: (progressData) => {
        this.progress.set(progressData);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching progress', err);
        this.isLoading.set(false);
      }
    });
  }

  isModuleCompleted(moduleId: number): boolean {
    const p = this.progress();
    return p ? p.completedModuleIds.includes(moduleId) : false;
  }

  checkBookmarkStatus(id: number): void {
    this.bookmarkService.checkBookmark('course', id).subscribe({
      next: (res) => this.isBookmarked.set(res.bookmarked)
    });
  }

  toggleBookmark(): void {
    this.bookmarkService.toggleBookmark('course', this.courseId()).subscribe({
      next: (res) => this.isBookmarked.set(res.bookmarked)
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
