import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../shared/components/header/header';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Header, Footer],
  template: `
    <div class="min-h-screen flex flex-col font-body-md text-body-md bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
      <app-header></app-header>
      
      <div class="flex flex-1 pt-16">
        <main class="flex-1 flex flex-col min-h-[calc(100vh-64px)] overflow-x-hidden w-full">
          <div class="flex-1">
            <router-outlet></router-outlet>
          </div>
          <app-footer></app-footer>
        </main>
      </div>
    </div>
  `
})
export class MainLayoutComponent {}
