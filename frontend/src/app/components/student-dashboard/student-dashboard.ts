import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CourseService, Course } from '../../services/course.service';
import { ProgressService } from '../../services/progress.service';
import { BookmarkService } from '../../services/bookmark.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [RouterLink],
  templateUrl: './student-dashboard.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardComponent implements OnInit {
  readonly authService = inject(AuthService);
  private readonly courseService = inject(CourseService);
  private readonly progressService = inject(ProgressService);
  private readonly bookmarkService = inject(BookmarkService);
  private readonly router = inject(Router);

  // Signal states
  readonly courses = signal<Course[]>([]);
  readonly bookmarks = signal<any[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly lastOpenedCourse = signal<number | null>(null);
  readonly lastOpenedModule = signal<number | null>(null);

  ngOnInit(): void {
    // Check user's last opened positions
    const user = this.authService.currentUser();
    if (user?.lastOpenedCourseId && user?.lastOpenedModuleId) {
      this.lastOpenedCourse.set(user.lastOpenedCourseId);
      this.lastOpenedModule.set(user.lastOpenedModuleId);
    }

    this.loadCourses();
    this.loadBookmarks();
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

  continueLearning(): void {
    const courseId = this.lastOpenedCourse();
    const moduleId = this.lastOpenedModule();
    if (courseId && moduleId) {
      this.router.navigate(['/student/course', courseId, 'module', moduleId]);
    }
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
