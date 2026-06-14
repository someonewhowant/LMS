import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AvatarComponent } from '../../ui/avatar/avatar';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [AvatarComponent, RouterLink, RouterLinkActive],
  template: `
<aside class="h-full w-64 bg-surface-container-low dark:bg-surface-container-low border-r border-outline-variant flex flex-col py-md px-sm">
  <div class="flex items-center gap-sm px-xs mb-lg">
    <app-avatar [alt]="userEmail()"></app-avatar>
    <div>
      <div class="font-label-caps text-label-caps text-on-surface text-ellipsis overflow-hidden max-w-[150px]">{{ userEmail() }}</div>
      <div class="text-[10px] text-primary font-bold tracking-widest">{{ userRole() }}</div>
    </div>
  </div>
  <nav class="flex-1 space-y-xs overflow-y-auto custom-scrollbar">
    <a routerLink="/dashboard" routerLinkActive="text-primary bg-primary-container/10 border-l-4 border-primary active-nav-glow" [routerLinkActiveOptions]="{exact: true}" class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer">
      <span class="material-symbols-outlined">dashboard</span>
      <span>Dashboard</span>
    </a>
    <a routerLink="/dashboard/courses" routerLinkActive="text-primary bg-primary-container/10 border-l-4 border-primary active-nav-glow" class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer">
      <span class="material-symbols-outlined">school</span>
      <span>My Courses</span>
    </a>
    <a routerLink="/dashboard/achievements" routerLinkActive="text-primary bg-primary-container/10 border-l-4 border-primary active-nav-glow" class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer">
      <span class="material-symbols-outlined">military_tech</span>
      <span>Achievements</span>
    </a>
    <a routerLink="/dashboard/leaderboard" routerLinkActive="text-primary bg-primary-container/10 border-l-4 border-primary active-nav-glow" class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer">
      <span class="material-symbols-outlined">leaderboard</span>
      <span>Leaderboard</span>
    </a>
    <a routerLink="/dashboard/settings" routerLinkActive="text-primary bg-primary-container/10 border-l-4 border-primary active-nav-glow" class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer">
      <span class="material-symbols-outlined">settings</span>
      <span>Settings</span>
    </a>
  </nav>
  <div class="mt-auto pt-md border-t border-outline-variant space-y-xs">
    <a class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer">
      <span class="material-symbols-outlined">help</span>
      <span>Support</span>
    </a>
    <a (click)="logout()" class="flex items-center gap-sm px-sm py-xs rounded text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-all duration-150 ease-in-out font-label-caps text-label-caps cursor-pointer">
      <span class="material-symbols-outlined">logout</span>
      <span>Sign Out</span>
    </a>
  </div>
</aside>
  `,
  styles: ``
})
export class Sidebar {
  authService = inject(AuthService);
  router = inject(Router);

  userEmail() {
    return this.authService.currentUser()?.email?.split('@')[0] || 'User';
  }

  userRole() {
    return this.authService.userRole() || 'STUDENT';
  }

  logout() {
    this.authService.logout();
  }
}


