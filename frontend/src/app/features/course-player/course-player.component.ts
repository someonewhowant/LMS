import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';
import { Course } from '../../core/models/course.model';
import { ButtonComponent } from '../../shared/ui/button/button';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
<div class="h-[calc(100vh-64px)] flex overflow-hidden bg-background">
  <!-- Sidebar Navigation -->
  <aside class="w-80 border-r border-outline-variant bg-surface-container flex flex-col h-full flex-shrink-0 transition-transform duration-300"
         [class.-translate-x-full]="!isSidebarOpen()"
         [class.hidden]="!isSidebarOpen() && isMobile()">
    <div class="p-md border-b border-outline-variant flex items-center justify-between">
      <h2 class="font-bold text-on-surface line-clamp-1 flex-1">{{ course()?.title || 'Loading...' }}</h2>
      <button class="material-symbols-outlined text-outline hover:text-on-surface" (click)="toggleSidebar()">close</button>
    </div>
    
    <div class="flex-1 overflow-y-auto p-2 space-y-1">
      <div *ngFor="let module of mockModules; let i = index">
        <button class="w-full text-left px-4 py-3 rounded-lg flex items-center justify-between hover:bg-surface-container-high transition-colors"
                (click)="toggleModule(i)">
          <span class="font-bold text-body-sm text-on-surface">Module {{ i + 1 }}: {{ module.title }}</span>
          <span class="material-symbols-outlined text-[18px] text-outline transition-transform"
                [class.rotate-180]="expandedModule() === i">expand_more</span>
        </button>
        
        <!-- Lessons list -->
        <div *ngIf="expandedModule() === i" class="pl-4 pr-2 py-2 space-y-1">
          <button *ngFor="let lesson of module.lessons; let j = index"
                  class="w-full text-left px-3 py-2 rounded-md text-body-sm flex items-center gap-3 transition-colors"
                  [ngClass]="activeLesson() === lesson.id ? 'bg-primary/10 text-primary font-bold' : 'text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'"
                  (click)="selectLesson(lesson)">
            <span class="material-symbols-outlined text-[16px] shrink-0" 
                  [ngClass]="lesson.completed ? 'text-tertiary' : ''">
              {{ lesson.completed ? 'check_circle' : 'article' }}
            </span>
            <span class="line-clamp-2">{{ lesson.title }}</span>
          </button>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Content Area -->
  <main class="flex-1 flex flex-col h-full overflow-hidden bg-background relative"
        [class.-ml-80]="!isSidebarOpen() && !isMobile()">
    
    <!-- Top Bar -->
    <header class="h-14 border-b border-outline-variant bg-surface flex items-center justify-between px-md shrink-0">
      <div class="flex items-center gap-3">
        <button class="material-symbols-outlined text-on-surface-variant hover:text-on-surface p-1 rounded-md hover:bg-surface-container"
                (click)="toggleSidebar()" *ngIf="!isSidebarOpen()">
          menu
        </button>
        <span class="text-body-sm font-label-caps text-on-surface-variant uppercase tracking-wider">
          {{ selectedLesson()?.title || 'Select a lesson' }}
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button app-button variant="secondary" size="sm" class="hidden sm:block">Mark as Complete</button>
        <button class="material-symbols-outlined sm:hidden text-primary">check_circle</button>
      </div>
    </header>

    <!-- Reading Area -->
    <div class="flex-1 overflow-y-auto">
      <div class="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div *ngIf="isLoading()" class="flex justify-center py-xl">
          <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
        </div>

        <article *ngIf="!isLoading() && selectedLesson()" class="prose prose-invert prose-lg max-w-none prose-headings:text-on-surface prose-p:text-on-surface-variant prose-a:text-primary">
          <h1 class="text-display-sm font-bold mb-md">{{ selectedLesson()?.title }}</h1>
          
          <div class="bg-surface-container rounded-xl p-md border border-outline-variant mb-lg flex items-center gap-3">
             <span class="material-symbols-outlined text-tertiary text-2xl">lightbulb</span>
             <p class="text-body-sm m-0">This lesson takes approximately 5 minutes to read.</p>
          </div>

          <div [innerHTML]="selectedLesson()?.content"></div>

          <div class="mt-2xl flex items-center justify-between border-t border-outline-variant pt-lg">
            <button app-button variant="outline">Previous Lesson</button>
            <button app-button variant="primary">Next Lesson</button>
          </div>
        </article>
      </div>
    </div>
  </main>
</div>
  `,
  styles: `
    :host { display: block; }
  `
})
export class CoursePlayerComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private coursesService = inject(CoursesService);

  course = signal<Course | null>(null);
  isLoading = signal(true);
  
  isSidebarOpen = signal(true);
  expandedModule = signal<number>(0);
  activeLesson = signal<string>('l1');
  selectedLesson = signal<any>(null);

  isMobile() {
    return window.innerWidth < 768;
  }

  // Deeply nested mock data to simulate full course player structure
  mockModules = [
    {
      title: 'Introduction to the Course',
      lessons: [
        { id: 'l1', title: 'Welcome and Overview', completed: true, content: '<p>Welcome to this course. In this lesson, we will cover the basic structure of what you will learn.</p><h3>Prerequisites</h3><ul><li>Basic understanding of programming</li><li>A code editor</li></ul>' },
        { id: 'l2', title: 'Setting up your environment', completed: false, content: '<p>Before we begin coding, we need to set up our tools.</p><pre><code>npm install -g @angular/cli</code></pre><p>Make sure you have Node.js installed.</p>' }
      ]
    },
    {
      title: 'Core Fundamentals',
      lessons: [
        { id: 'l3', title: 'Understanding Architecture', completed: false, content: '<p>The architecture is the foundation of any application.</p>' },
        { id: 'l4', title: 'State Management basics', completed: false, content: '<p>State management allows data to flow effectively.</p>' }
      ]
    }
  ];

  ngOnInit() {
    // Mobile responsive initial state
    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.coursesService.getCourseById(+id).subscribe({
        next: (data) => {
          this.course.set(data);
          this.isLoading.set(false);
          this.selectLesson(this.mockModules[0].lessons[0]);
        },
        error: () => {
          this.isLoading.set(false);
          this.selectLesson(this.mockModules[0].lessons[0]);
        }
      });
    }
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  toggleModule(index: number) {
    this.expandedModule.set(this.expandedModule() === index ? -1 : index);
  }

  selectLesson(lesson: any) {
    this.activeLesson.set(lesson.id);
    this.selectedLesson.set(lesson);
    if (this.isMobile()) {
      this.isSidebarOpen.set(false);
    }
  }
}
