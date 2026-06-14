import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AchievementService, LeaderboardUser, UserAchievement, Achievement } from '../../../core/services/achievement.service';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="p-lg md:p-xl max-w-7xl mx-auto w-full" *ngIf="!isLoading()">
  <div class="mb-xl">
    <h1 class="font-display-lg-desktop text-[36px] md:text-[40px] font-bold text-on-surface mb-2">Leaderboard & Achievements</h1>
    <p class="text-body-md text-on-surface-variant max-w-xl">
      Compete with other students, earn XP, and unlock exclusive rewards.
    </p>
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-3 gap-xl">
    <!-- Leaderboard Column -->
    <div class="lg:col-span-2 bg-surface-container rounded-2xl p-lg border border-outline-variant flex flex-col h-fit">
      <div class="flex items-center justify-between mb-lg border-b border-outline-variant pb-md">
        <h2 class="text-title-lg font-bold text-on-surface flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-[28px]">leaderboard</span>
          Top Learners
        </h2>
        <span class="text-body-xs font-label-caps text-on-surface-variant">Updated hourly</span>
      </div>

      <div class="space-y-sm">
        <div *ngFor="let user of leaderboard(); let i = index" 
             class="flex items-center justify-between p-md rounded-xl border transition-all duration-150"
             [ngClass]="isCurrentUser(user.id) ? 'bg-primary/10 border-primary/40 shadow-glow' : 'bg-surface-container-low border-outline-variant hover:border-outline'">
          
          <!-- Rank & Avatar & Email -->
          <div class="flex items-center gap-md">
            <!-- Rank badge -->
            <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-body-md"
                 [ngClass]="getRankClass(i)">
              {{ i + 1 }}
            </div>
            
            <div>
              <div class="font-bold text-body-md text-on-surface flex items-center gap-2">
                {{ user.email.split('@')[0] }}
                <span *ngIf="isCurrentUser(user.id)" class="text-[10px] bg-primary text-on-primary font-bold px-2 py-0.5 rounded-full font-label-caps uppercase">YOU</span>
              </div>
              <div class="text-[10px] text-on-surface-variant font-label-caps uppercase tracking-wider">{{ user.role }}</div>
            </div>
          </div>

          <!-- Score -->
          <div class="flex items-center gap-sm">
            <span class="material-symbols-outlined text-tertiary">local_fire_department</span>
            <span class="font-bold text-title-md text-on-surface">{{ user.points }} <span class="text-body-sm font-normal text-on-surface-variant">XP</span></span>
          </div>
        </div>

        <div *ngIf="leaderboard().length === 0" class="text-center py-xl text-on-surface-variant">
          No learners on the leaderboard yet. Be the first to earn XP!
        </div>
      </div>
    </div>

    <!-- Achievements Column -->
    <div class="space-y-lg">
      <!-- Unlocked Stats card -->
      <div class="bg-surface-container rounded-2xl p-lg border border-outline-variant flex items-center justify-between">
        <div>
          <h3 class="text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Achievements</h3>
          <div class="text-[36px] font-bold text-on-surface leading-none mt-2">
            {{ myAchievements().length }} <span class="text-body-lg text-on-surface-variant font-normal">/ {{ allAchievements().length }}</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded-full flex items-center justify-center">
          <span class="material-symbols-outlined text-2xl">military_tech</span>
        </div>
      </div>

      <!-- Tab Buttons -->
      <div class="flex border-b border-outline-variant">
        <button (click)="activeTab.set('my')" 
                class="flex-1 pb-2 text-center text-body-sm font-bold border-b-2 transition-all"
                [class.border-primary]="activeTab() === 'my'"
                [class.text-primary]="activeTab() === 'my'"
                [class.border-transparent]="activeTab() !== 'my'"
                [class.text-on-surface-variant]="activeTab() !== 'my'">
          My Unlocked
        </button>
        <button (click)="activeTab.set('all')" 
                class="flex-1 pb-2 text-center text-body-sm font-bold border-b-2 transition-all"
                [class.border-primary]="activeTab() === 'all'"
                [class.text-primary]="activeTab() === 'all'"
                [class.border-transparent]="activeTab() !== 'all'"
                [class.text-on-surface-variant]="activeTab() !== 'all'">
          All Available
        </button>
      </div>

      <!-- Tab Content -->
      <div class="space-y-md">
        <!-- My Achievements -->
        <ng-container *ngIf="activeTab() === 'my'">
          <div *ngFor="let userAch of myAchievements()" 
               class="bg-surface-container rounded-xl p-md border border-outline-variant flex gap-md items-start">
            <div class="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <span class="material-symbols-outlined">{{ getIcon(userAch.achievement.iconUrl) }}</span>
            </div>
            <div>
              <h4 class="font-bold text-body-md text-on-surface">{{ userAch.achievement.name }}</h4>
              <p class="text-body-xs text-on-surface-variant mt-1">{{ userAch.achievement.description }}</p>
              <div class="flex items-center gap-2 mt-2">
                <span class="text-[10px] bg-tertiary/10 text-tertiary font-bold px-2 py-0.5 rounded-full font-label-caps uppercase">+{{ userAch.achievement.points }} XP</span>
                <span class="text-[10px] text-on-surface-variant font-label-caps">Unlocked {{ userAch.awardedAt | date:'shortDate' }}</span>
              </div>
            </div>
          </div>

          <div *ngIf="myAchievements().length === 0" class="text-center py-xl text-on-surface-variant bg-surface-container-low rounded-xl border border-outline-variant">
            No achievements unlocked yet. Take a quiz or complete a lesson!
          </div>
        </ng-container>

        <!-- All Achievements -->
        <ng-container *ngIf="activeTab() === 'all'">
          <div *ngFor="let ach of allAchievements()" 
               class="bg-surface-container rounded-xl p-md border border-outline-variant flex gap-md items-start opacity-75 hover:opacity-100 transition-opacity"
               [class.opacity-100]="hasUnlocked(ach.id)">
            <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border"
                 [ngClass]="hasUnlocked(ach.id) ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-surface-container-high border-outline-variant text-outline'">
              <span class="material-symbols-outlined">{{ getIcon(ach.iconUrl) }}</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between gap-2">
                <h4 class="font-bold text-body-md text-on-surface">{{ ach.name }}</h4>
                <span *ngIf="hasUnlocked(ach.id)" class="text-[10px] bg-primary text-on-primary font-bold px-1.5 py-0.5 rounded">UNLOCKED</span>
              </div>
              <p class="text-body-xs text-on-surface-variant mt-1">{{ ach.description }}</p>
              <div class="text-[10px] bg-tertiary/10 text-tertiary font-bold px-2 py-0.5 rounded-full font-label-caps uppercase mt-2 w-fit">+{{ ach.points }} XP</div>
            </div>
          </div>
        </ng-container>
      </div>
    </div>
  </div>
</div>

<div *ngIf="isLoading()" class="flex items-center justify-center py-2xl">
  <span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
</div>
  `,
  styles: `
    .shadow-glow {
      box-shadow: 0 0 15px rgba(173, 198, 255, 0.1);
    }
  `
})
export class LeaderboardComponent implements OnInit {
  private achievementService = inject(AchievementService);
  private authService = inject(AuthService);

  isLoading = signal(true);
  leaderboard = signal<LeaderboardUser[]>([]);
  myAchievements = signal<UserAchievement[]>([]);
  allAchievements = signal<Achievement[]>([]);
  activeTab = signal<'my' | 'all'>('my');

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    
    // Parallel fetching
    this.achievementService.getLeaderboard().subscribe({
      next: (data) => this.leaderboard.set(data),
      error: (err) => console.error(err)
    });

    this.achievementService.getMyAchievements().subscribe({
      next: (data) => this.myAchievements.set(data),
      error: (err) => console.error(err)
    });

    this.achievementService.getAchievements().subscribe({
      next: (data) => {
        this.allAchievements.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  isCurrentUser(userId: number): boolean {
    return this.authService.currentUser()?.id === userId;
  }

  getRankClass(index: number) {
    if (index === 0) return 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30';
    if (index === 1) return 'bg-slate-300/20 text-slate-300 border border-slate-300/30';
    if (index === 2) return 'bg-amber-600/20 text-amber-600 border border-amber-600/30';
    return 'bg-surface-container-high text-on-surface-variant border border-outline-variant';
  }

  getIcon(iconName?: string): string {
    return iconName || 'emoji_events';
  }

  hasUnlocked(achievementId: number): boolean {
    return this.myAchievements().some(a => a.achievementId === achievementId);
  }
}
