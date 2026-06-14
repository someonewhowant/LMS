import { Component, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-content></ng-content>{{ text }}`,
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.5rem; /* px-2 py-1 or px-3 py-1 */
      border-radius: 9999px; /* rounded-full */
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      line-height: 1;
    }

    /* Variants */
    :host.badge-outline {
      background-color: rgba(29, 32, 39, 0.8); /* surface/80 */
      backdrop-filter: blur(12px);
      border: 1px solid #424754; /* outline-variant */
      color: #e1e2ec; /* on-surface */
    }

    :host.badge-primary {
      background-color: rgba(77, 142, 255, 0.1); /* primary-container/10 */
      color: #adc6ff; /* primary */
      border: 1px solid rgba(173, 198, 255, 0.2);
    }

    :host.badge-secondary {
      background-color: rgba(62, 73, 93, 0.2); /* surface-variant */
      color: #c2c6d6; /* on-surface-variant */
      border-radius: 0.25rem; /* less rounded */
    }

    :host.badge-tertiary {
      background-color: rgba(223, 116, 18, 0.1); /* tertiary-container/10 */
      color: #ffb786; /* tertiary */
      border: 1px solid rgba(255, 183, 134, 0.2);
    }

    /* Used for tags in article cards */
    :host.badge-tag {
      background-color: #272a31; /* surface-container-high */
      color: #8c909f; /* outline */
      border-radius: 0.25rem; /* rounded */
    }
  `
})
export class BadgeComponent {
  @Input() text = '';
  @Input() variant: 'outline' | 'primary' | 'secondary' | 'tertiary' | 'tag' = 'outline';

  @HostBinding('class')
  get classes() {
    return `badge-${this.variant}`;
  }
}
