import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface RoadmapNode {
  id: string;
  title: string;
  status: 'locked' | 'in-progress' | 'completed';
  description: string;
  index: number;
}

@Component({
  selector: 'app-roadmap-node',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="flex relative group">
  <!-- Connector Line -->
  <div *ngIf="!isLast" class="absolute left-[1.1875rem] top-10 bottom-[-24px] w-[2px]"
       [ngClass]="{
         'bg-primary': node.status === 'completed',
         'bg-outline-variant': node.status !== 'completed'
       }">
  </div>

  <!-- Node Icon/Indicator -->
  <div class="relative z-10 flex-shrink-0 mr-lg">
    <!-- Completed State -->
    <div *ngIf="node.status === 'completed'" class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-glow ring-4 ring-surface">
      <span class="material-symbols-outlined text-[20px]">check</span>
    </div>
    
    <!-- In-Progress State -->
    <div *ngIf="node.status === 'in-progress'" class="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary ring-4 ring-surface relative">
      <div class="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
      <span class="font-bold font-label-caps">{{ node.index }}</span>
    </div>
    
    <!-- Locked State -->
    <div *ngIf="node.status === 'locked'" class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-outline ring-4 ring-surface">
      <span class="material-symbols-outlined text-[20px]">lock</span>
    </div>
  </div>

  <!-- Content -->
  <div class="pb-xl flex-1">
    <div class="bg-surface-container rounded-xl p-lg border transition-all duration-300"
         [ngClass]="{
           'border-primary/50 shadow-glow': node.status === 'in-progress',
           'border-outline-variant hover:border-outline': node.status !== 'in-progress',
           'opacity-60': node.status === 'locked'
         }">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-[18px] font-bold"
            [ngClass]="{'text-primary': node.status === 'in-progress', 'text-on-surface': node.status !== 'in-progress'}">
          {{ node.title }}
        </h3>
        
        <span *ngIf="node.status === 'completed'" class="text-[12px] font-label-caps text-primary bg-primary/10 px-2 py-1 rounded">Completed</span>
        <span *ngIf="node.status === 'in-progress'" class="text-[12px] font-label-caps text-tertiary bg-tertiary/10 px-2 py-1 rounded">In Progress</span>
      </div>
      <p class="text-on-surface-variant text-body-md">{{ node.description }}</p>
      
      <!-- Action button for in-progress -->
      <button *ngIf="node.status === 'in-progress'" class="mt-md px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-colors rounded-lg font-label-caps text-[12px] flex items-center gap-2">
        Continue Learning
        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
      </button>
    </div>
  </div>
</div>
  `,
  styles: `
    .shadow-glow {
      box-shadow: 0 0 15px rgba(173, 198, 255, 0.4);
    }
  `
})
export class RoadmapNodeComponent {
  @Input({ required: true }) node!: RoadmapNode;
  @Input() isLast = false;
}
