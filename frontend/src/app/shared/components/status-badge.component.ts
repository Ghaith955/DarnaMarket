import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { STATUS_CLASSES } from '../../core/utils';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [TranslatePipe],
  template: `<span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium" [class]="classes()">{{ 'STATUS.' + status() | translate }}</span>`,
})
export class StatusBadgeComponent {
  status = input.required<string>();
  classes() { return STATUS_CLASSES[this.status()] ?? 'bg-stone-100 text-stone-700'; }
}
