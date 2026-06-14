import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'button[app-button], a[app-button]',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 0.5rem; /* rounded-lg */
      font-family: 'JetBrains Mono', monospace; /* font-label-caps */
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      transition-property: all;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
      cursor: pointer;
    }
    :host:active {
      transform: scale(0.95);
    }
    :host:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      pointer-events: none;
    }
    
    /* Variants */
    :host.btn-primary {
      background-color: #adc6ff; /* primary */
      color: #002e6a; /* on-primary */
    }
    :host.btn-primary:hover {
      filter: brightness(1.1);
      box-shadow: 0 4px 14px 0 rgba(173, 198, 255, 0.2);
    }

    :host.btn-secondary {
      background-color: #3e495d; /* secondary-container */
      color: #aeb9d0; /* on-secondary-container */
    }
    :host.btn-secondary:hover {
      background-color: #adc6ff; /* primary */
      color: #002e6a; /* on-primary */
    }

    :host.btn-outline {
      background-color: transparent;
      border: 1px solid #424754; /* outline-variant */
      color: #e1e2ec; /* on-surface */
    }
    :host.btn-outline:hover {
      background-color: #32353c; /* surface-container-highest */
    }

    :host.btn-text {
      background-color: transparent;
      color: #c2c6d6; /* on-surface-variant */
    }
    :host.btn-text:hover {
      color: #adc6ff; /* primary */
    }

    /* Sizes */
    :host.btn-sm {
      padding: 0.5rem 1rem;
      font-size: 10px;
    }
    :host.btn-md {
      padding: 0.5rem 1.5rem;
    }
    :host.btn-lg {
      padding: 1rem 3rem; /* px-lg py-4 */
      font-size: 14px;
    }

    /* Full Width */
    :host.btn-full {
      width: 100%;
    }
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'text' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() fullWidth = false;

  @HostBinding('class')
  get classes() {
    return `btn-${this.variant} btn-${this.size} ${this.fullWidth ? 'btn-full' : ''}`;
  }
}
