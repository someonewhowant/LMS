import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent, Course } from '../../shared/components/course-card/course-card';
import { RoadmapNodeComponent, RoadmapNode } from '../../shared/components/roadmap-node/roadmap-node';
import { ButtonComponent } from '../../shared/ui/button/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, RoadmapNodeComponent, ButtonComponent],
  template: `
<div class="p-lg md:p-xl max-w-7xl mx-auto w-full">
  <!-- Welcome & Stats -->
  <div class="flex flex-col lg:flex-row gap-lg mb-xl">
    <div class="flex-1 bg-surface-container rounded-2xl p-xl border border-outline-variant relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute right-0 top-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
      
      <div class="relative z-10">
        <h1 class="font-display-md text-[32px] font-bold text-on-surface mb-2">Welcome back, Developer!</h1>
        <p class="text-body-md text-on-surface-variant mb-lg max-w-xl">
          You're doing great. You've learned for 4 days in a row. Keep the streak alive!
        </p>
        <button app-button variant="primary" size="md">Continue Learning</button>
      </div>
    </div>

    <!-- Quick Stats Grid -->
    <div class="grid grid-cols-2 gap-md lg:w-96">
      <div class="bg-surface-container-low rounded-xl p-md border border-outline-variant flex flex-col items-center justify-center text-center">
        <span class="material-symbols-outlined text-primary text-[32px] mb-2">local_fire_department</span>
        <div class="font-display-sm text-[24px] font-bold text-on-surface">4 Days</div>
        <div class="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">Current Streak</div>
      </div>
      <div class="bg-surface-container-low rounded-xl p-md border border-outline-variant flex flex-col items-center justify-center text-center">
        <span class="material-symbols-outlined text-tertiary text-[32px] mb-2">military_tech</span>
        <div class="font-display-sm text-[24px] font-bold text-on-surface">1,250</div>
        <div class="text-[10px] font-label-caps text-on-surface-variant uppercase tracking-wider">Total XP</div>
      </div>
    </div>
  </div>

  <div class="grid grid-cols-1 xl:grid-cols-3 gap-xl">
    <!-- Left Column: Ongoing Courses -->
    <div class="xl:col-span-2 space-y-lg">
      <div class="flex items-center justify-between mb-md">
        <h2 class="font-display-sm text-[24px] font-bold text-on-surface">In Progress</h2>
        <button app-button variant="text" size="sm">View All</button>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
        <app-course-card *ngFor="let course of activeCourses" [course]="course"></app-course-card>
      </div>

      <!-- Recommended/New -->
      <div class="mt-xl pt-xl border-t border-outline-variant">
         <h2 class="font-display-sm text-[24px] font-bold text-on-surface mb-lg">Recommended for you</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-lg">
           <app-course-card *ngFor="let course of recommendedCourses" [course]="course"></app-course-card>
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
  `,
  styles: ``
})
export class DashboardComponent {
  activeCourses: Course[] = [
    {
      id: '2',
      title: 'Spring Boot 3 Core Concepts',
      description: 'Master the fundamentals of Spring Boot 3. Build RESTful APIs, manage security, and implement best practices.',
      level: 'Beginner',
      tag: 'Java',
      duration: '8h 15m',
      progress: 65,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      title: 'PostgreSQL Performance Tuning',
      description: 'Deep dive into database internals. Learn how to analyze queries, create efficient indexes.',
      level: 'Intermediate',
      tag: 'Database',
      duration: '6h 45m',
      progress: 12,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  recommendedCourses: Course[] = [
    {
      id: '1',
      title: 'Advanced NestJS Microservices',
      description: 'Learn to build scalable, event-driven microservices using NestJS, RabbitMQ, and Redis.',
      level: 'Advanced',
      tag: 'Architecture',
      duration: '14h 30m',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  roadmapNodes: RoadmapNode[] = [
    {
      id: 'n1',
      index: 1,
      title: 'Java Fundamentals',
      description: 'Core concepts, OOP, Collections, and Streams.',
      status: 'completed'
    },
    {
      id: 'n2',
      index: 2,
      title: 'Spring Boot Basics',
      description: 'Dependency Injection, REST Controllers, and Data JPA.',
      status: 'in-progress'
    },
    {
      id: 'n3',
      index: 3,
      title: 'Database Architecture',
      description: 'SQL optimization, indexing, and transactions.',
      status: 'locked'
    },
    {
      id: 'n4',
      index: 4,
      title: 'System Design',
      description: 'Scalability, caching, and microservices patterns.',
      status: 'locked'
    }
  ];
}
