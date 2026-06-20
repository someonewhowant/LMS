import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseService, CatalogCourse } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-course-catalog',
  imports: [RouterLink],
  templateUrl: './course-catalog.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CourseCatalogComponent implements OnInit {
  private readonly courseService = inject(CourseService);
  readonly authService = inject(AuthService);

  readonly courses = signal<CatalogCourse[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly searchQuery = signal<string>('');
  readonly sortBy = signal<'newest' | 'oldest' | 'title'>('newest');

  readonly sortedCourses = computed(() => {
    const list = [...this.courses()];
    switch (this.sortBy()) {
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'title':
        return list.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
      default:
        return list;
    }
  });

  // Color palette for course cards
  private readonly cardStyles = [
    { bg: 'bg-indigo-600/12', iconBg: 'bg-indigo-600/20', iconColor: 'text-indigo-400', border: 'hover:border-indigo-700/50', badge: 'bg-indigo-950/80 text-indigo-300 border-indigo-800/50', icon: 'code' },
    { bg: 'bg-violet-600/12', iconBg: 'bg-violet-600/20', iconColor: 'text-violet-400', border: 'hover:border-violet-700/50', badge: 'bg-violet-950/80 text-violet-300 border-violet-800/50', icon: 'terminal' },
    { bg: 'bg-emerald-600/12', iconBg: 'bg-emerald-600/20', iconColor: 'text-emerald-400', border: 'hover:border-emerald-700/50', badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/50', icon: 'web' },
    { bg: 'bg-amber-600/12', iconBg: 'bg-amber-600/20', iconColor: 'text-amber-400', border: 'hover:border-amber-700/50', badge: 'bg-amber-950/80 text-amber-300 border-amber-800/50', icon: 'database' },
    { bg: 'bg-rose-600/12', iconBg: 'bg-rose-600/20', iconColor: 'text-rose-400', border: 'hover:border-rose-700/50', badge: 'bg-rose-950/80 text-rose-300 border-rose-800/50', icon: 'psychology' },
    { bg: 'bg-cyan-600/12', iconBg: 'bg-cyan-600/20', iconColor: 'text-cyan-400', border: 'hover:border-cyan-700/50', badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-800/50', icon: 'deployed_code' }
  ];

  ngOnInit(): void {
    this.loadCatalog();
  }

  loadCatalog(): void {
    this.isLoading.set(true);
    const q = this.searchQuery().trim() || undefined;
    this.courseService.getPublicCatalog(q).subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.loadCatalog();
  }

  onSort(sort: 'newest' | 'oldest' | 'title'): void {
    this.sortBy.set(sort);
  }

  getCardStyle(index: number) {
    return this.cardStyles[index % this.cardStyles.length];
  }

  formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch {
      return '';
    }
  }

  getCourseLink(courseId: number): string {
    if (this.authService.isAuthenticated()) {
      const user = this.authService.currentUser();
      if (user?.role === 'student') return `/student/course/${courseId}`;
    }
    return '/login';
  }
}
