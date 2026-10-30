import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { L10n, Product } from '../../core/models';
import { readImage } from '../../core/utils';
import { LocalizedPipe } from '../../shared/localized.pipe';

const MAX_IMAGES = 8;

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe, LocalizedPipe],
  template: `
  <div class="max-w-3xl mx-auto px-4 py-8">
    <h1 class="h1">{{ (id() ? 'VENDOR.EDIT_PRODUCT' : 'VENDOR.ADD_PRODUCT') | translate }}</h1>
    <div class="card space-y-5">
      @for (lang of langs; track lang.code) {
        <div class="grid gap-3 border-b border-stone-100 pb-4">
          <div class="text-xs font-semibold text-amber-700">{{ lang.label }}</div>
          <div>
            <label class="block text-sm mb-1">{{ 'VENDOR.FIELD_TITLE' | translate }}</label>
            <input class="input" [dir]="lang.code === 'ar' ? 'rtl' : 'ltr'" [(ngModel)]="title[lang.code]">
          </div>
          <div>
            <label class="block text-sm mb-1">{{ 'VENDOR.FIELD_DESCRIPTION' | translate }}</label>
            <textarea class="input" rows="3" [dir]="lang.code === 'ar' ? 'rtl' : 'ltr'" [(ngModel)]="description[lang.code]"></textarea>
          </div>
        </div>
      }

      <div class="grid sm:grid-cols-2 gap-4">
        <div><label class="block text-sm mb-1">{{ 'COMMON.PRICE' | translate }} (DT)</label>
          <input class="input" type="number" min="0" [(ngModel)]="price"></div>
        <div><label class="block text-sm mb-1">{{ 'COMMON.STOCK' | translate }}</label>
          <input class="input" type="number" min="0" [(ngModel)]="stock"></div>
        <div><label class="block text-sm mb-1">{{ 'CATALOGUE.BRAND' | translate }}</label>
          <input class="input" [(ngModel)]="brand"></div>
        <div><label class="block text-sm mb-1">{{ 'CATALOGUE.CATEGORY' | translate }}</label>
          <select class="input" [(ngModel)]="category">
            <option value="">—</option>
            @for (o of categoryOptions(); track o.cat._id) {
              <option [value]="o.cat._id">{{ o.indent ? '— ' : '' }}{{ o.cat.name | localized }}</option>
            }
          </select></div>
      </div>

      <div>
        <label class="block text-sm mb-1">{{ 'VENDOR.IMAGES' | translate }} ({{ images().length }}/8)</label>
        <input type="file" accept="image/*" multiple class="input" (change)="onFiles($event)">
        <div class="flex flex-wrap gap-3 mt-3">
          @for (img of images(); track $index) {
            <div class="relative">
              <img [src]="img" alt="" class="w-24 h-20 object-cover rounded-lg border">
              <button type="button" class="absolute -top-2 -end-2 w-6 h-6 rounded-full bg-red-600 text-white text-xs cursor-pointer" (click)="removeImage($index)">✕</button>
            </div>
          }
        </div>
      </div>

      @if (error()) { <p class="text-sm text-red-600">{{ 'VENDOR.ERR_FORM' | translate }}</p> }
      <p class="text-xs text-stone-500">{{ 'VENDOR.REVIEW_NOTICE' | translate }}</p>
      <div class="flex gap-3">
        <button class="btn" (click)="save()">{{ 'COMMON.SAVE' | translate }}</button>
        <a routerLink="/vendor/products" class="btn-outline">{{ 'COMMON.CANCEL' | translate }}</a>
      </div>
    </div>
  </div>`,
})
export class ProductFormComponent implements OnInit {
  private data = inject(DataService);
  private auth = inject(AuthService);
  private router = inject(Router);

  id = input<string>(); // présent en édition (:id)
  langs = [{ code: 'fr' as const, label: 'Français' }, { code: 'en' as const, label: 'English' }, { code: 'ar' as const, label: 'العربية' }];
  title: L10n = { fr: '', en: '', ar: '' };
  description: L10n = { fr: '', en: '', ar: '' };
  price = 0; stock = 0; brand = ''; category = '';
  images = signal<string[]>([]);
  error = signal(false);
  categoryOptions = computed(() =>
    this.data.roots().flatMap(r => [{ cat: r, indent: false }, ...this.data.children(r._id).map(c => ({ cat: c, indent: true }))]));

  ngOnInit() {
    const p = this.id() ? this.data.product(this.id()!) : undefined;
    // Un fournisseur ne peut modifier que ses propres produits
    if (this.id() && (!p || p.vendor !== this.auth.user()!._id)) { this.router.navigate(['/vendor/products']); return; }
    if (p) {
      this.title = { ...p.title }; this.description = { ...p.description };
      this.price = p.price; this.stock = p.stock; this.brand = p.brand; this.category = p.category;
      this.images.set([...p.images]);
    }
  }

  async onFiles(ev: Event) {
    const files = Array.from((ev.target as HTMLInputElement).files ?? []);
    const room = MAX_IMAGES - this.images().length;
    const added = await Promise.all(files.slice(0, room).map(f => readImage(f)));
    this.images.update(l => [...l, ...added]);
    (ev.target as HTMLInputElement).value = '';
  }
  removeImage(i: number) { this.images.update(l => l.filter((_, idx) => idx !== i)); }

  save() {
    const ok = this.title.fr.trim() && this.title.en.trim() && this.title.ar.trim() && this.category && this.price > 0 && this.images().length > 0;
    if (!ok) { this.error.set(true); return; }
    const existing = this.id() ? this.data.product(this.id()!) : undefined;
    const product: Product = {
      _id: existing?._id ?? this.data.newProductId(),
      title: this.title, description: this.description,
      price: this.price, stock: this.stock, brand: this.brand.trim(), category: this.category,
      images: this.images(), vendor: this.auth.user()!._id,
      status: 'PENDING', // toute création / modification repasse par la validation admin
      reviews: existing?.reviews ?? [], createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    this.data.saveProduct(product);
    this.router.navigate(['/vendor/products']);
  }
}
