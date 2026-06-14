import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BadgeComponent } from '../../ui/badge/badge';
import { ProgressBarComponent } from '../../ui/progress-bar/progress-bar';

export interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tag: string;
  duration: string;
  progress?: number; // 0-100
  image: string;
}

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CommonModule, RouterLink, BadgeComponent, ProgressBarComponent],
  template: `
<a [routerLink]="['/courses', course.id]" class="block group bg-surface-container rounded-xl overflow-hidden border border-outline-variant hover:border-primary/50 transition-all duration-300 flex flex-col h-full cursor-pointer hover:shadow-glow hover:-translate-y-1">
  <!-- Course Image/Cover -->
  <div class="relative h-48 w-full overflow-hidden bg-surface-container-high">
    <img *ngIf="course.image" [src]="course.image" [alt]="course.title" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
    <div *ngIf="!course.image" class="w-full h-full flex items-center justify-center text-outline">
      <span class="material-symbols-outlined text-4xl">terminal</span>
    </div>
    
    <!-- Level Badge -->
    <div class="absolute top-4 left-4">
      <app-badge [variant]="getLevelVariant(course.level)">{{ course.level }}</app-badge>
    </div>
    
    <!-- Tag/Category -->
    <div class="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold text-on-surface-variant font-label-caps uppercase tracking-wider border border-outline-variant">
      {{ course.tag }}
    </div>
  </div>

  <!-- Content -->
  <div class="p-lg flex flex-col flex-1">
    <h3 class="font-display-sm text-[20px] text-on-surface mb-2 font-bold leading-tight group-hover:text-primary transition-colors">
      {{ course.title }}
    </h3>
    <p class="text-on-surface-variant text-body-md line-clamp-2 mb-lg flex-1">
      {{ course.description }}
    </p>

    <!-- Meta Info -->
    <div class="flex items-center gap-md text-on-surface-variant text-label-caps font-label-caps mb-lg border-t border-outline-variant pt-4">
      <div class="flex items-center gap-xs">
        <span class="material-symbols-outlined text-[16px]">schedule</span>
        <span>{{ course.duration }}</span>
      </div>
      <div class="flex items-center gap-xs">
        <span class="material-symbols-outlined text-[16px]">play_circle</span>
        <span>12 Lessons</span>
      </div>
    </div>

    <!-- Progress (Optional) -->
    <div *ngIf="course.progress !== undefined" class="mt-auto">
      <div class="flex items-center justify-between text-[12px] font-label-caps text-on-surface-variant mb-2">
        <span>Course Progress</span>
        <span class="text-primary">{{ course.progress }}%</span>
      </div>
      <app-progress-bar [progress]="course.progress" size="sm"></app-progress-bar>
    </div>
  </div>
</a>
  `,
  styles: `
    .hover\\:shadow-glow:hover {
      box-shadow: 0 10px 30px -10px rgba(173, 198, 255, 0.15);
    }
  `
})
export class CourseCardComponent {
  @Input({ required: true }) course!: Course;

  getLevelVariant(level: string): 'outline' | 'primary' | 'secondary' | 'tertiary' | 'tag' {
    switch (level.toLowerCase()) {
      case 'beginner': return 'primary';
      case 'intermediate': return 'tertiary';
      case 'advanced': return 'outline';
      default: return 'outline';
    }
  }
}
