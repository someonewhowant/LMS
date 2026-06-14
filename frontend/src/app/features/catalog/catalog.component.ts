import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CourseCardComponent, Course } from '../../shared/components/course-card/course-card';
import { ButtonComponent } from '../../shared/ui/button/button';
import { BadgeComponent } from '../../shared/ui/badge/badge';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, CourseCardComponent, ButtonComponent, BadgeComponent],
  template: `
<div class="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
  <!-- Header Section -->
  <div class="mb-xl">
    <h1 class="font-display-lg-desktop text-[40px] md:text-[48px] font-bold text-on-surface mb-2">Explore the Curriculum</h1>
    <p class="text-body-lg text-on-surface-variant max-w-2xl">
      Discover our comprehensive library of backend engineering courses. Master system design, databases, APIs, and modern frameworks.
    </p>
  </div>

  <div class="flex flex-col lg:flex-row gap-xl">
    <!-- Filters Sidebar -->
    <aside class="w-full lg:w-64 flex-shrink-0 space-y-lg">
      <!-- Search -->
      <div>
        <div class="bg-surface-container rounded-lg px-3 py-2 border border-outline-variant flex items-center">
          <span class="material-symbols-outlined text-[20px] text-outline">search</span>
          <input 
            type="text" 
            placeholder="Search courses..." 
            class="bg-transparent border-none focus:ring-0 text-body-md text-on-surface placeholder:text-outline ml-2 w-full outline-none"
            [value]="searchQuery()"
            (input)="updateSearch($event)"
          />
        </div>
      </div>

      <!-- Categories Filter -->
      <div class="space-y-sm border-t border-outline-variant pt-md">
        <h3 class="font-label-caps text-label-caps text-on-surface uppercase tracking-widest mb-md">Categories</h3>
        <label *ngFor="let category of categories" class="flex items-center gap-3 cursor-pointer group">
          <div class="relative flex items-center justify-center w-5 h-5 border border-outline rounded bg-surface-container-high group-hover:border-primary transition-colors">
            <input 
              type="checkbox" 
              class="opacity-0 absolute inset-0 cursor-pointer"
              [checked]="selectedCategories().includes(category)"
              (change)="toggleCategory(category)"
            />
            <span *ngIf="selectedCategories().includes(category)" class="material-symbols-outlined text-[16px] text-primary">check</span>
          </div>
          <span class="text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">{{ category }}</span>
        </label>
      </div>

      <!-- Levels Filter -->
      <div class="space-y-sm border-t border-outline-variant pt-md">
        <h3 class="font-label-caps text-label-caps text-on-surface uppercase tracking-widest mb-md">Difficulty Level</h3>
        <label *ngFor="let level of levels" class="flex items-center gap-3 cursor-pointer group">
          <div class="relative flex items-center justify-center w-5 h-5 border border-outline rounded bg-surface-container-high group-hover:border-primary transition-colors">
            <input 
              type="checkbox" 
              class="opacity-0 absolute inset-0 cursor-pointer"
              [checked]="selectedLevels().includes(level)"
              (change)="toggleLevel(level)"
            />
            <span *ngIf="selectedLevels().includes(level)" class="material-symbols-outlined text-[16px] text-primary">check</span>
          </div>
          <span class="text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">{{ level }}</span>
        </label>
      </div>

      <!-- Clear Filters -->
      <button 
        *ngIf="selectedCategories().length > 0 || selectedLevels().length > 0 || searchQuery().length > 0"
        (click)="clearFilters()" 
        class="text-[12px] font-label-caps text-primary hover:brightness-110 transition-all border-t border-outline-variant pt-md w-full text-left flex items-center gap-2">
        <span class="material-symbols-outlined text-[16px]">clear_all</span>
        Clear all filters
      </button>
    </aside>

    <!-- Main Content -->
    <div class="flex-1">
      <div class="flex items-center justify-between mb-lg">
        <div class="text-on-surface-variant text-body-md font-label-caps">
          Showing <span class="text-on-surface font-bold">{{ filteredCourses().length }}</span> courses
        </div>
        
        <!-- Sort Dropdown (Mock) -->
        <div class="flex items-center gap-2 text-body-md text-on-surface-variant">
          <span>Sort by:</span>
          <select class="bg-surface-container border border-outline-variant rounded px-2 py-1 outline-none focus:border-primary text-on-surface cursor-pointer">
            <option>Most Popular</option>
            <option>Newest</option>
            <option>Highest Rated</option>
          </select>
        </div>
      </div>

      <!-- Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-lg" *ngIf="filteredCourses().length > 0; else noResults">
        <app-course-card *ngFor="let course of filteredCourses()" [course]="course"></app-course-card>
      </div>

      <ng-template #noResults>
        <div class="bg-surface-container-low border border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center text-center mt-lg">
          <span class="material-symbols-outlined text-6xl text-outline mb-md">search_off</span>
          <h3 class="text-display-sm text-[24px] font-bold text-on-surface mb-2">No courses found</h3>
          <p class="text-body-md text-on-surface-variant max-w-md mb-lg">
            We couldn't find any courses matching your current filters. Try adjusting your search criteria or clearing all filters.
          </p>
          <button app-button variant="primary" (click)="clearFilters()">Clear Filters</button>
        </div>
      </ng-template>
    </div>
  </div>
</div>
  `,
  styles: ``
})
export class CatalogComponent {
  categories = ['Architecture', 'Java', 'Database', 'DevOps', 'Security'];
  levels = ['Beginner', 'Intermediate', 'Advanced'];

  searchQuery = signal('');
  selectedCategories = signal<string[]>([]);
  selectedLevels = signal<string[]>([]);

  // Mock Data
  allCourses: Course[] = [
    {
      id: '1',
      title: 'Advanced NestJS Microservices',
      description: 'Learn to build scalable, event-driven microservices using NestJS, RabbitMQ, and Redis. Perfect for scaling your applications.',
      level: 'Advanced',
      tag: 'Architecture',
      duration: '14h 30m',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      title: 'Spring Boot 3 Core Concepts',
      description: 'Master the fundamentals of Spring Boot 3. Build RESTful APIs, manage security, and implement best practices.',
      level: 'Beginner',
      tag: 'Java',
      duration: '8h 15m',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      title: 'PostgreSQL Performance Tuning',
      description: 'Deep dive into database internals. Learn how to analyze queries, create efficient indexes, and handle massive data.',
      level: 'Intermediate',
      tag: 'Database',
      duration: '6h 45m',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '4',
      title: 'Docker & Kubernetes for Developers',
      description: 'Containerize your applications and orchestrate them using Kubernetes. A complete guide from local dev to production.',
      level: 'Intermediate',
      tag: 'DevOps',
      duration: '12h 00m',
      image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '5',
      title: 'OAuth2 and OIDC with Spring Security',
      description: 'Secure your microservices architecture with enterprise-grade authentication and authorization patterns.',
      level: 'Advanced',
      tag: 'Security',
      duration: '9h 20m',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '6',
      title: 'REST API Design Patterns',
      description: 'Learn industry-standard patterns for designing intuitive, scalable, and versionable RESTful web services.',
      level: 'Beginner',
      tag: 'Architecture',
      duration: '5h 10m',
      image: 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  filteredCourses = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const cats = this.selectedCategories();
    const lvls = this.selectedLevels();

    return this.allCourses.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(q) || course.description.toLowerCase().includes(q);
      const matchesCategory = cats.length === 0 || cats.includes(course.tag);
      const matchesLevel = lvls.length === 0 || lvls.includes(course.level);
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  });

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  toggleCategory(category: string) {
    this.selectedCategories.update(cats => {
      if (cats.includes(category)) return cats.filter(c => c !== category);
      return [...cats, category];
    });
  }

  toggleLevel(level: string) {
    this.selectedLevels.update(lvls => {
      if (lvls.includes(level)) return lvls.filter(l => l !== level);
      return [...lvls, level];
    });
  }

  clearFilters() {
    this.searchQuery.set('');
    this.selectedCategories.set([]);
    this.selectedLevels.set([]);
  }
}
