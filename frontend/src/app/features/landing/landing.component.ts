import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/ui/button/button';
import { BadgeComponent } from '../../shared/ui/badge/badge';
import { CourseCardComponent } from '../../shared/components/course-card/course-card';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, ButtonComponent, BadgeComponent, CourseCardComponent],
  template: `
<div class="w-full relative">
  <!-- Hero Section -->
  <section class="relative pt-32 pb-24 md:pt-48 md:pb-32 px-margin-mobile md:px-margin-desktop overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-surface"></div>
      <!-- Decorative Grid -->
      <div class="absolute inset-0" style="background-image: linear-gradient(rgba(66, 71, 84, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(66, 71, 84, 0.2) 1px, transparent 1px); background-size: 40px 40px;"></div>
      <!-- Glowing Orbs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-tertiary/10 rounded-full blur-[120px]"></div>
      <!-- Radial gradient mask -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#10131a_70%)]"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto text-center space-y-md">
      <app-badge variant="outline" class="mb-4 inline-flex">
        <span class="text-primary mr-2">New</span> Angular standalone architecture implemented
      </app-badge>
      
      <h1 class="font-display-lg-desktop text-[48px] md:text-[64px] font-bold text-on-surface leading-[1.1] tracking-tight">
        Master Backend Engineering with <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary to-tertiary">Real-World</span> Projects
      </h1>
      
      <p class="text-body-lg text-[18px] text-on-surface-variant max-w-2xl mx-auto pt-4">
        Stop watching tutorials. Start building enterprise-grade applications. Our interactive platform bridges the gap between theory and production-ready backend skills.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-sm pt-lg">
        <button app-button variant="primary" size="lg" class="w-full sm:w-auto">Start Learning Free</button>
        <button app-button variant="outline" size="lg" class="w-full sm:w-auto">
          <span class="material-symbols-outlined text-[20px]">play_circle</span>
          Explore Curriculum
        </button>
      </div>
      
      <!-- Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-lg pt-xl mt-xl border-t border-outline-variant/50">
        <div>
          <div class="font-display-md text-[32px] font-bold text-primary">50+</div>
          <div class="text-label-caps font-label-caps text-on-surface-variant">Hands-on Projects</div>
        </div>
        <div>
          <div class="font-display-md text-[32px] font-bold text-primary">10k</div>
          <div class="text-label-caps font-label-caps text-on-surface-variant">Active Students</div>
        </div>
        <div>
          <div class="font-display-md text-[32px] font-bold text-primary">4.9</div>
          <div class="text-label-caps font-label-caps text-on-surface-variant">Average Rating</div>
        </div>
        <div>
          <div class="font-display-md text-[32px] font-bold text-primary">85%</div>
          <div class="text-label-caps font-label-caps text-on-surface-variant">Hiring Rate</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Popular Courses Section -->
  <section class="py-24 px-margin-mobile md:px-margin-desktop bg-surface-container-lowest">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
        <div class="max-w-2xl">
          <h2 class="font-display-md text-[32px] font-bold text-on-surface mb-2">Featured Learning Paths</h2>
          <p class="text-body-md text-on-surface-variant">Curated curricula designed to take you from fundamentals to advanced backend architecture.</p>
        </div>
        <button app-button variant="text" size="md">
          View All Paths <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        <app-course-card *ngFor="let course of featuredCourses" [course]="course"></app-course-card>
      </div>
    </div>
  </section>

  <!-- Value Proposition -->
  <section class="py-24 px-margin-mobile md:px-margin-desktop bg-surface">
    <div class="max-w-7xl mx-auto">
      <div class="text-center max-w-2xl mx-auto mb-xl">
        <h2 class="font-display-md text-[32px] font-bold text-on-surface mb-2">Why CodeBlog Academy?</h2>
        <p class="text-body-md text-on-surface-variant">We focus on depth, not just syntax. Learn the architecture, patterns, and decisions that senior engineers make.</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <div class="bg-surface-container-low p-lg rounded-xl border border-outline-variant hover:border-primary/50 transition-colors">
          <div class="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center text-primary mb-md">
            <span class="material-symbols-outlined text-[24px]">architecture</span>
          </div>
          <h3 class="font-bold text-[20px] text-on-surface mb-2">System Design First</h3>
          <p class="text-body-md text-on-surface-variant">Don't just write code. Understand how to design scalable, fault-tolerant backend architectures.</p>
        </div>
        <div class="bg-surface-container-low p-lg rounded-xl border border-outline-variant hover:border-tertiary/50 transition-colors">
          <div class="w-12 h-12 bg-tertiary-container rounded-lg flex items-center justify-center text-tertiary mb-md">
            <span class="material-symbols-outlined text-[24px]">terminal</span>
          </div>
          <h3 class="font-bold text-[20px] text-on-surface mb-2">Interactive Environment</h3>
          <p class="text-body-md text-on-surface-variant">Code directly in the browser with our integrated development environment. No setup required.</p>
        </div>
        <div class="bg-surface-container-low p-lg rounded-xl border border-outline-variant hover:border-primary/50 transition-colors">
          <div class="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center text-primary mb-md">
            <span class="material-symbols-outlined text-[24px]">groups</span>
          </div>
          <h3 class="font-bold text-[20px] text-on-surface mb-2">Active Community</h3>
          <p class="text-body-md text-on-surface-variant">Join thousands of developers. Get help, review code, and participate in weekly technical challenges.</p>
        </div>
      </div>
    </div>
  </section>
  
  <!-- CTA Section -->
  <section class="py-24 px-margin-mobile md:px-margin-desktop relative overflow-hidden">
    <div class="absolute inset-0 bg-primary/5"></div>
    <div class="relative z-10 max-w-4xl mx-auto text-center bg-surface-container p-xl rounded-2xl border border-primary/20 shadow-glow">
      <h2 class="font-display-md text-[32px] font-bold text-on-surface mb-4">Ready to elevate your engineering career?</h2>
      <p class="text-body-lg text-on-surface-variant mb-xl">Join CodeBlog Academy today and get access to our complete curriculum.</p>
      <button app-button variant="primary" size="lg">Create Free Account</button>
    </div>
  </section>
</div>
  `,
  styles: `
    .shadow-glow {
      box-shadow: 0 0 40px rgba(173, 198, 255, 0.1);
    }
  `
})
export class LandingPageComponent {
  featuredCourses = [
    {
      id: '1',
      title: 'Advanced NestJS Microservices',
      description: 'Learn to build scalable, event-driven microservices using NestJS, RabbitMQ, and Redis. Perfect for scaling your applications.',
      level: 'Advanced' as const,
      tag: 'Architecture',
      duration: '14h 30m',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      title: 'Spring Boot 3 Core Concepts',
      description: 'Master the fundamentals of Spring Boot 3. Build RESTful APIs, manage security, and implement best practices.',
      level: 'Beginner' as const,
      tag: 'Java',
      duration: '8h 15m',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      title: 'PostgreSQL Performance Tuning',
      description: 'Deep dive into database internals. Learn how to analyze queries, create efficient indexes, and handle massive data.',
      level: 'Intermediate' as const,
      tag: 'Database',
      duration: '6h 45m',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];
}
