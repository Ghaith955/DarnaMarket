import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { DataService } from '../../core/services/data.service';
import { ratingOf } from '../../core/models';
import { ProductCardComponent } from '../../shared/components/product-card.component';
import { LocalizedPipe } from '../../shared/localized.pipe';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [FormsModule, TranslatePipe, LocalizedPipe, ProductCardComponent],
  template: `
  <div class="page grid lg:grid-cols-[16rem_1fr] gap-8">
    <aside class="card h-fit space-y-4">
      <h2 class="font-semibold">{{ 'CATALOGUE.FILTERS' | translate }}</h2>
      <div>
        <label class="block text-sm mb-1">{{ 'COMMON.SEARCH' | translate }}</label>
        <input class="input" [(ngModel)]="q">
      </div>
      <div>
        <label class="block text-sm mb-1">{{ 'CATALOGUE.CATEGORY' | translate }}</label>
        <select class="input" [(ngModel)]="cat">
          <option value="">{{ 'COMMON.ALL' | translate }}</option>
          @for (o of categoryOptions(); track o.cat._id) {
            <option [value]="o.cat._id">{{ o.indent ? '— ' : '' }}{{ o.cat.name | localized }}</option>
          }
        </select>
      </div>
      <div>
        <label class="block text-sm mb-1">{{ 'CATALOGUE.BRAND' | translate }}</label>
        <select class="input" [(ngModel)]="brand">
          <option value="">{{ 'COMMON.ALL' | translate }}</option>
          @for (b of brands(); track b) { <option [value]="b">{{ b }}</option> }
        </select>
      </div>
      <div class="grid grid-cols-2 gap-2">
        <div>
          <label class="block text-sm mb-1">{{ 'CATALOGUE.MIN_PRICE' | translate }}</label>
          <input class="input" type="number" min="0" [(ngModel)]="min">
        </div>
        <div>
          <label class="block text-sm mb-1">{{ 'CATALOGUE.MAX_PRICE' | translate }}</label>
          <input class="input" type="number" min="0" [(ngModel)]="max">
        </div>
      </div>
      <button class="btn-outline w-full" (click)="reset()">{{ 'CATALOGUE.RESET' | translate }}</button>
    </aside>

    <section>
      <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h1 class="text-xl font-bold">{{ 'NAV.CATALOGUE' | translate }}
          <span class="text-sm font-normal text-stone-500">({{ list().length }})</span></h1>
        <select class="input w-auto" [(ngModel)]="sort">
          <option value="new">{{ 'CATALOGUE.SORT_NEW' | translate }}</option>
          <option value="priceAsc">{{ 'CATALOGUE.SORT_PRICE_ASC' | translate }}</option>
          <option value="priceDesc">{{ 'CATALOGUE.SORT_PRICE_DESC' | translate }}</option>
          <option value="rating">{{ 'CATALOGUE.SORT_RATING' | translate }}</option>
        </select>
      </div>
      @if (list().length) {
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          @for (p of list(); track p._id) { <app-product-card [p]="p" /> }
        </div>
      } @else {
        <p class="card text-center text-stone-500">{{ 'CATALOGUE.EMPTY' | translate }}</p>
      }
    </section>
  </div>`,
})
export class CatalogueComponent implements OnInit {
  private data = inject(DataService);
  category = input<string>(); // ?category=<id> (lié automatiquement depuis l'URL)

  q = signal('');
  cat = signal('');
  brand = signal('');
  min = signal<number | null>(null);
  max = signal<number | null>(null);
  sort = signal('new');

  brands = computed(() => [...new Set(this.data.approved().map(p => p.brand))].sort());
  categoryOptions = computed(() =>
    this.data.roots().flatMap(r => [{ cat: r, indent: false }, ...this.data.children(r._id).map(c => ({ cat: c, indent: true }))]));

  list = computed(() => {
    let l = this.data.approved();
    const q = this.q().trim().toLowerCase();
    if (q) l = l.filter(p => Object.values(p.title).some(t => t.toLowerCase().includes(q)) || p.brand.toLowerCase().includes(q));
    const c = this.cat();
    if (c) {
      const ids = new Set([c, ...this.data.children(c).map(x => x._id)]);
      l = l.filter(p => ids.has(p.category));
    }
    if (this.brand()) l = l.filter(p => p.brand === this.brand());
    if (this.min() != null) l = l.filter(p => p.price >= this.min()!);
    if (this.max() != null) l = l.filter(p => p.price <= this.max()!);
    const sorted = [...l];
    switch (this.sort()) {
      case 'priceAsc': sorted.sort((a, b) => a.price - b.price); break;
      case 'priceDesc': sorted.sort((a, b) => b.price - a.price); break;
      case 'rating': sorted.sort((a, b) => ratingOf(b) - ratingOf(a)); break;
      default: sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }
    return sorted;
  });

  ngOnInit() { if (this.category()) this.cat.set(this.category()!); }
  reset() { this.q.set(''); this.cat.set(''); this.brand.set(''); this.min.set(null); this.max.set(null); this.sort.set('new'); }
}
