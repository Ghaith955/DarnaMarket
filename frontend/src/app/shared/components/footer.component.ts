import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  template: `
  <footer class="bg-stone-900 text-stone-300 mt-12">
    <div class="max-w-7xl mx-auto px-4 py-8 text-sm flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
      <span class="font-semibold text-white">🏠 {{ 'APP.NAME' | translate }}</span>
      <span>{{ 'APP.TAGLINE' | translate }}</span>
      <span>© 2026 {{ 'APP.NAME' | translate }}</span>
    </div>
  </footer>`,
})
export class FooterComponent {}
