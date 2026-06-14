import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';
import { Sidebar } from '../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, Sidebar],
  template: `
    <div class="min-h-screen flex flex-col font-body-md text-body-md bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <app-header></app-header>
      
      <div class="flex flex-1 pt-16 h-[calc(100vh-64px)] overflow-hidden">
        <!-- Sidebar is hidden on mobile, visible on lg -->
        <app-sidebar class="hidden lg:block h-full"></app-sidebar>
        
        <main class="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          <div class="flex-1">
            <router-outlet></router-outlet>
          </div>
          <app-footer></app-footer>
        </main>
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {}
