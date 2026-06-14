import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent, Article } from '../../shared/components/article-card/article-card';
import { BadgeComponent } from '../../shared/ui/badge/badge';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, ArticleCardComponent, BadgeComponent],
  template: `
<div class="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-xl">
  <!-- Header Section -->
  <div class="text-center mb-xl max-w-3xl mx-auto">
    <h1 class="font-display-lg-desktop text-[40px] md:text-[48px] font-bold text-on-surface mb-2">Engineering Blog</h1>
    <p class="text-body-lg text-on-surface-variant">
      Deep dives into backend architecture, performance tuning, system design, and industry best practices. Written by senior engineers for engineers.
    </p>
  </div>

  <!-- Featured Article (First one) -->
  <div class="mb-xl" *ngIf="featuredArticle()">
    <h2 class="font-label-caps text-label-caps text-on-surface uppercase tracking-widest mb-md border-b border-outline-variant pb-2">Featured Read</h2>
    <div class="bg-surface-container-low rounded-xl overflow-hidden border border-outline-variant flex flex-col md:flex-row group hover:border-primary/50 transition-colors cursor-pointer">
      <div class="md:w-1/2 h-64 md:h-auto bg-surface-container-high relative overflow-hidden">
        <!-- Mock image placeholder -->
        <div class="absolute inset-0 bg-gradient-to-br from-primary/20 to-tertiary/20 mix-blend-overlay"></div>
        <div class="w-full h-full flex items-center justify-center text-outline">
          <span class="material-symbols-outlined text-[64px]">article</span>
        </div>
      </div>
      <div class="p-xl flex flex-col justify-center md:w-1/2">
        <div class="flex items-center gap-xs text-on-surface-variant text-[12px] font-label-caps mb-4">
          <span class="material-symbols-outlined text-[16px]">schedule</span>
          <span>{{ featuredArticle()?.readTime }}</span>
          <span class="mx-2">•</span>
          <span>{{ featuredArticle()?.date }}</span>
        </div>
        <h3 class="text-[28px] font-bold text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">
          {{ featuredArticle()?.title }}
        </h3>
        <p class="text-on-surface-variant text-body-lg mb-lg line-clamp-3">
          {{ featuredArticle()?.excerpt }}
        </p>
        <div class="flex items-center gap-sm mt-auto">
          <div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden">
             <img *ngIf="featuredArticle()?.author?.avatar" [src]="featuredArticle()?.author?.avatar" class="w-full h-full object-cover">
          </div>
          <span class="text-on-surface text-[14px] font-bold">{{ featuredArticle()?.author?.name }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Category Pills -->
  <div class="flex flex-wrap items-center gap-sm mb-lg">
    <button 
      *ngFor="let cat of articleCategories"
      (click)="selectCategory(cat)"
      class="px-4 py-2 rounded-full font-label-caps text-[12px] transition-all border cursor-pointer"
      [ngClass]="activeCategory() === cat ? 'bg-primary text-on-primary border-primary' : 'bg-surface-container border-outline-variant text-on-surface-variant hover:border-outline'">
      {{ cat }}
    </button>
  </div>

  <!-- Articles Grid -->
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
    <app-article-card *ngFor="let article of filteredArticles()" [article]="article"></app-article-card>
  </div>

</div>
  `,
  styles: ``
})
export class ArticlesComponent {
  articleCategories = ['All Topics', 'System Design', 'Performance', 'Databases', 'Security'];
  activeCategory = signal('All Topics');

  allArticles: Article[] = [
    {
      id: '1',
      title: 'Designing a Scalable Notification System from Scratch',
      excerpt: 'Learn the architecture and trade-offs behind building a distributed notification system capable of sending millions of messages per minute using Kafka and Redis.',
      date: 'Oct 24, 2024',
      readTime: '8 min read',
      tags: ['System Design', 'Kafka'],
      author: {
        name: 'Alex Developer',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFTqfDayGYrd2f-VGMscwOjM7e0emx1Zv5efmuv1M4346WNlcojoG4sKAGW2FHKDjzAtlmF0K74RfYLfxVjP5Fg0zF822oy1QVMV3iwTrQ4SAtx5LaIuLgiHnUpOWvpdpOiL9ZMb-baUjm0cs_FiFc8iJWuHnkCpf0HKY9LAPuwp7Rnd-8qdvgibA3c3rD94e7mCkoLeu1JpvygqhQl4V6sWEtcDfHGErpVj0pVJRXaDFj-vEKz3VbSSCKfyf5fU2vBiiUEJpSxKjo'
      }
    },
    {
      id: '2',
      title: 'PostgreSQL Indexing Strategies for Large Tables',
      excerpt: 'A deep dive into B-Tree, Hash, and GIN indexes. Learn when to use partial and covering indexes to optimize your slow queries.',
      date: 'Oct 15, 2024',
      readTime: '12 min read',
      tags: ['Databases', 'PostgreSQL'],
      author: {
        name: 'Sarah Backend',
        avatar: ''
      }
    },
    {
      id: '3',
      title: 'Understanding OAuth 2.0 and OpenID Connect',
      excerpt: 'Demystifying the authentication and authorization protocols. We break down the flows and show how to implement them securely.',
      date: 'Sep 28, 2024',
      readTime: '10 min read',
      tags: ['Security', 'Auth'],
      author: {
        name: 'Michael Security',
        avatar: ''
      }
    },
    {
      id: '4',
      title: 'Optimizing Node.js Event Loop Performance',
      excerpt: 'How to avoid blocking the event loop, identify memory leaks, and use worker threads for CPU-intensive tasks.',
      date: 'Sep 12, 2024',
      readTime: '7 min read',
      tags: ['Performance', 'Node.js'],
      author: {
        name: 'Alex Developer',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFTqfDayGYrd2f-VGMscwOjM7e0emx1Zv5efmuv1M4346WNlcojoG4sKAGW2FHKDjzAtlmF0K74RfYLfxVjP5Fg0zF822oy1QVMV3iwTrQ4SAtx5LaIuLgiHnUpOWvpdpOiL9ZMb-baUjm0cs_FiFc8iJWuHnkCpf0HKY9LAPuwp7Rnd-8qdvgibA3c3rD94e7mCkoLeu1JpvygqhQl4V6sWEtcDfHGErpVj0pVJRXaDFj-vEKz3VbSSCKfyf5fU2vBiiUEJpSxKjo'
      }
    }
  ];

  featuredArticle = computed(() => this.allArticles[0]);

  filteredArticles = computed(() => {
    const active = this.activeCategory();
    // Exclude the featured article from the grid
    let gridArticles = this.allArticles.slice(1);
    
    if (active === 'All Topics') {
      return gridArticles;
    }
    return gridArticles.filter(a => a.tags.includes(active));
  });

  selectCategory(category: string) {
    this.activeCategory.set(category);
  }
}
