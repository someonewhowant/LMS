import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';
import { Course } from '../../core/models/course.model';
import { ButtonComponent } from '../../shared/ui/button/button';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
<div class="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-xl" *ngIf="!isLoading()">
  <div *ngIf="course()" class="grid grid-cols-1 lg:grid-cols-3 gap-xl">
    
    <!-- Main Content -->
    <div class="lg:col-span-2 space-y-lg">
      <div class="space-y-md">
        <div class="inline-block px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[12px] font-label-caps tracking-widest uppercase">
          Course
        </div>
        <h1 class="text-display-md text-on-surface font-bold leading-tight">{{ course()?.title }}</h1>
        <p class="text-body-lg text-on-surface-variant">{{ course()?.description }}</p>
        
        <div class="flex items-center gap-6 text-body-sm text-on-surface-variant pt-4 border-t border-outline-variant">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">person</span>
            <span>By Instructor {{ course()?.teacherId }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px]">schedule</span>
            <span>Created {{ course()?.createdAt | date:'mediumDate' }}</span>
          </div>
        </div>
      </div>

      <!-- Syllabus / Modules -->
      <div class="mt-2xl">
        <h2 class="text-title-lg font-bold text-on-surface mb-lg">Course Syllabus</h2>
        <div class="space-y-md">
          <!-- Modules loop here if course().modules exist. Using mock modules if not -->
          <div *ngIf="course()?.modules?.length === 0" class="text-on-surface-variant">No modules available yet.</div>
          <div *ngFor="let module of (course()?.modules?.length ? course()?.modules : mockModules); let i = index" class="bg-surface-container rounded-xl p-lg border border-outline-variant">
            <div class="flex items-start gap-md">
              <div class="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-bold text-on-surface shrink-0">
                {{ i + 1 }}
              </div>
              <div class="flex-1">
                <h3 class="text-title-md font-bold text-on-surface mb-2">{{ module.title }}</h3>
                <p class="text-body-sm text-on-surface-variant">{{ module.content || 'Learn the foundational concepts of this module.' }}</p>
                <div class="flex items-center gap-4 mt-4 text-[12px] text-on-surface-variant font-label-caps">
                  <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">menu_book</span> {{ module.assignments?.length || 2 }} Lessons</span>
                  <span class="flex items-center gap-1"><span class="material-symbols-outlined text-[16px]">quiz</span> {{ module.quizzes?.length || 1 }} Quiz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sidebar / Action Card -->
    <div class="lg:col-span-1">
      <div class="sticky top-24 bg-surface-container rounded-2xl p-xl border border-outline-variant shadow-lg flex flex-col gap-lg">
        <div class="aspect-video bg-surface-container-high rounded-xl border border-outline-variant flex items-center justify-center overflow-hidden relative">
           <img src="/assets/images/course-placeholder.jpg" class="object-cover w-full h-full opacity-60" alt="Cover" />
           <span class="material-symbols-outlined absolute text-5xl text-on-surface shadow-md">play_circle</span>
        </div>
        
        <div>
          <h3 class="text-title-lg font-bold text-on-surface">Free Enrollment</h3>
          <p class="text-body-sm text-on-surface-variant mt-1">Full lifetime access to this course.</p>
        </div>

        <button app-button variant="primary" size="lg" [fullWidth]="true" [routerLink]="['/player', course()?.id]">
          Start Learning Now
        </button>

        <ul class="space-y-3 text-body-sm text-on-surface-variant">
          <li class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            100% Online
          </li>
          <li class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            Self-paced learning
          </li>
          <li class="flex items-center gap-3">
            <span class="material-symbols-outlined text-[18px] text-primary">check_circle</span>
            Certificate of completion
          </li>
        </ul>
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
export class CourseDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private coursesService = inject(CoursesService);

  course = signal<Course | null>(null);
  isLoading = signal(true);

  // Mock modules if backend relation isn't returning them yet
  mockModules: any[] = [
    { title: 'Introduction & Setup', content: 'Get your development environment ready.' },
    { title: 'Core Architecture', content: 'Understand the underlying principles.' },
    { title: 'Advanced Topics', content: 'Master the complex patterns.' }
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.coursesService.getCourseById(+id).subscribe({
        next: (data) => {
          this.course.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }
}
