import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CourseCardComponent, Course } from '../../shared/components/course-card/course-card';
import { RoadmapNodeComponent, RoadmapNode } from '../../shared/components/roadmap-node/roadmap-node';
import { ButtonComponent } from '../../shared/ui/button/button';
import { DashboardService, DashboardStats } from '../../core/services/dashboard.service';
import { CoursesService } from '../../core/services/courses.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CourseCardComponent, RoadmapNodeComponent, ButtonComponent],
  template: `
<div class="p-lg md:p-xl max-w-7xl mx-auto w-full" *ngIf="!isLoading()">
  <!-- Welcome & Stats -->
  <div class="flex flex-col lg:flex-row gap-lg mb-xl">
    <div class="flex-1 bg-surface-container rounded-2xl p-xl border border-outline-variant relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
      
      <div class="relative z-10">
        <h1 class="font-display-md text-[32px] font-bold text-on-surface mb-2">Welcome back, {{ userEmail() }}!</h1>
        <p class="text-body-md text-on-surface-variant mb-lg max-w-xl">
          You're doing great. Keep the streak alive!
        </p>
        <button app-button variant="primary" size="md">Continue Learning</button>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-2 gap-md lg:w-96">
      <div class="bg-surface-container-low rounded-xl p-md border border-outline-variant flex flex-col items-center justify-center text-center">
        <span class="material-symbols-outlined text-primary text-[32px] mb-2">local_fire_department</span>
        <div class="font-display-sm text-[24px] font-bold text-on-surface">{{ stats()?.totalEnrollments || 0 }}</div>
        <div class="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">Courses Enrolled</div>
      </div>
      <div class="bg-surface-container-low rounded-xl p-md border border-outline-variant flex flex-col items-center justify-center text-center">
        <span class="material-symbols-outlined text-tertiary text-[32px] mb-2">military_tech</span>
        <div class="font-display-sm text-[24px] font-bold text-on-surface">{{ stats()?.points || 0 }}</div>
        <div class="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">Total XP</div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-xl">
    <!-- Left Column: Ongoing Courses -->
    <div class="xl:col-span-2 space-y-lg">
      <div class="flex items-center justify-between mb-md">
        <h2 class="font-display-sm text-[24px] font-bold text-on-surface">In Progress</h2>
        <button app-button variant="text" size="sm" routerLink="/courses">View All</button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-lg" *ngIf="activeCourses().length > 0; else noActive">
        <app-course-card *ngFor="let course of activeCourses()" [course]="course"></app-course-card>
      </div>
      
      <ng-template #noActive>
        <div class="bg-surface-container-low border border-outline-variant rounded-xl p-lg text-center text-on-surface-variant">
           You are not enrolled in any courses yet.
        </div>
      </ng-template>

      <!-- Recommended/New -->
      <div class="mt-xl pt-xl border-t border-outline-variant">
         <h2 class="font-display-sm text-[24px] font-bold text-on-surface mb-lg">Recommended for you</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-lg" *ngIf="recommendedCourses().length > 0">
           <app-course-card *ngFor="let course of recommendedCourses()" [course]="course"></app-course-card>
         </div>
      </div>
    </div>

    <!-- Right Column: Roadmap/Path -->
    <div class="bg-surface-container-low rounded-2xl p-lg border border-outline-variant">
      <h2 class="font-display-sm text-[20px] font-bold text-on-surface mb-2">Backend Master Track</h2>
      <p class="text-body-sm text-on-surface-variant mb-lg">Your personalized learning path</p>
      
      <div class="space-y-0">
        <app-roadmap-node 
          *ngFor="let node of roadmapNodes; let last = last" 
          [node]="node" 
          [isLast]="last">
        </app-roadmap-node>
      </div>
    </div>
  </div>
</div>

<div *ngIf="isLoading()" class="flex items-center justify-center py-2xl">
  <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
</div>
  `,
  styles: ``
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private coursesService = inject(CoursesService);
  private authService = inject(AuthService);

  isLoading = signal(true);
  stats = signal<DashboardStats | null>(null);
  activeCourses = signal<Course[]>([]);
  recommendedCourses = signal<Course[]>([]);
  
  userEmail = computed(() => {
    return this.authService.currentUser()?.email?.split('@')[0] || 'Student';
  });

  roadmapNodes: RoadmapNode[] = [
    { id: 'n1', index: 1, title: 'Java Fundamentals', description: 'Core concepts, OOP.', status: 'completed' },
    { id: 'n2', index: 2, title: 'Spring Boot Basics', description: 'Dependency Injection, REST.', status: 'in-progress' },
    { id: 'n3', index: 3, title: 'Database Architecture', description: 'SQL optimization.', status: 'locked' }
  ];

  ngOnInit() {
    // Fetch stats
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats.set(data);
      },
      error: (err) => console.error('Error fetching stats', err)
    });

    // Fetch enrollments
    this.dashboardService.getEnrolledCourses().subscribe({
      next: (data) => {
        const mapped = data.map(enroll => ({
          id: enroll.course.id.toString(),
          title: enroll.course.title,
          description: enroll.course.description || '',
          level: 'Beginner',
          tag: 'General',
          duration: '10h',
          progress: 15, // Example progress calculation
          image: '/assets/images/course-placeholder.jpg'
        })) as Course[];
        this.activeCourses.set(mapped);
      },
      error: (err) => console.error('Error fetching enrollments', err)
    });

    // Fetch recommendations (just take some courses)
    this.coursesService.getCourses().subscribe({
      next: (data) => {
        const mapped = data.slice(0, 2).map((c: any) => ({
          id: c.id.toString(),
          title: c.title,
          description: c.description || '',
          level: 'Beginner',
          tag: 'General',
          duration: '10h',
          image: '/assets/images/course-placeholder.jpg'
        })) as Course[];
        this.recommendedCourses.set(mapped);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
