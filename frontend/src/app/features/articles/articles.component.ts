import { Component, computed, signal, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleCardComponent, Article } from '../../shared/components/article-card/article-card';
import { ArticlesService } from '../../core/services/articles.service';

@Component({
  selector: 'app-articles',
  standalone: true,
  imports: [CommonModule, ArticleCardComponent],
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
  <div class="mb-xl" *ngIf="featuredArticle() as featured">
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
          <span>{{ featured.readTime }}</span>
          <span class="mx-2">•</span>
          <span>{{ featured.date }}</span>
        </div>
        <h3 class="text-[28px] font-bold text-on-surface mb-4 leading-tight group-hover:text-primary transition-colors">
          {{ featured.title }}
        </h3>
        <p class="text-on-surface-variant text-body-lg mb-lg line-clamp-3">
          {{ featured.excerpt }}
        </p>
        <div class="flex items-center gap-sm mt-auto">
          <div class="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center overflow-hidden">
             <img *ngIf="featured.author.avatar" [src]="featured.author.avatar" class="w-full h-full object-cover">
          </div>
          <span class="text-on-surface text-[14px] font-bold">{{ featured.author.name }}</span>
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
export class ArticlesComponent implements OnInit {
  private articlesService = inject(ArticlesService);

  articleCategories = ['All Topics', 'System Design', 'Performance', 'Databases', 'Security'];
  activeCategory = signal('All Topics');
  allArticles = signal<Article[]>([]);

  featuredArticle = computed(() => {
    const list = this.allArticles();
    return list.length > 0 ? list[0] : null;
  });

  filteredArticles = computed(() => {
    const list = this.allArticles();
    if (list.length === 0) return [];
    
    const active = this.activeCategory();
    // Exclude the featured article from the grid
    let gridArticles = list.slice(1);
    
    if (active === 'All Topics') {
      return gridArticles;
    }
    return gridArticles.filter(a => a.tags.includes(active));
  });

  ngOnInit() {
    this.articlesService.getArticles().subscribe({
      next: (articles) => {
        this.allArticles.set(articles);
      },
      error: (err) => {
        console.error('Failed to load articles:', err);
      }
    });
  }

  selectCategory(category: string) {
    this.activeCategory.set(category);
  }
}
