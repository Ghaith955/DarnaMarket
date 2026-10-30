import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DataService } from '../../core/services/data.service';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { LocalizedPipe } from '../../shared/localized.pipe';

const ICONS: Record<string, string> = { salon: '🛋️', chambre: '🛏️', cuisine: '🍽️', decoration: '🖼️', equipement: '🧰' };

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslatePipe, LocalizedPipe, ProductCardComponent],
  template: `
  <section class="bg-linear-to-br from-amber-100 via-amber-50 to-stone-100">
    <div class="max-w-7xl mx-auto px-4 py-16 text-center">
      <h1 class="text-3xl md:text-5xl font-bold text-amber-900">{{ 'HOME.HERO_TITLE' | translate }}</h1>
      <p class="mt-4 text-stone-600 max-w-2xl mx-auto">{{ 'HOME.HERO_SUB' | translate }}</p>
      <a routerLink="/catalogue" class="btn mt-8 text-lg px-6 py-3">{{ 'HOME.CTA' | translate }}</a>
    </div>
  </section>

  <section class="page">
    <h2 class="text-xl font-bold mb-4">{{ 'HOME.CATEGORIES' | translate }}</h2>
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      @for (c of data.roots(); track c._id) {
        <a [routerLink]="['/catalogue']" [queryParams]="{ category: c._id }"
           class="card text-center hover:shadow-md transition">
          <div class="text-4xl mb-2">{{ icon(c.slug) }}</div>
          <div class="font-medium text-sm">{{ c.name | localized }}</div>
        </a>
      }
    </div>

    <h2 class="text-xl font-bold mt-12 mb-4">{{ 'HOME.FEATURED' | translate }}</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      @for (p of featured(); track p._id) { <app-product-card [p]="p" /> }
    </div>
  </section>`,
})
export class HomeComponent {
  data = inject(DataService);
  featured = computed(() => this.data.approved().slice(0, 8));
  icon(slug: string) { return ICONS[slug] ?? '🏠'; }
}
