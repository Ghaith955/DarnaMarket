import { Component, computed, inject, input, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { ratingOf } from '../../core/models';
import { ImageGalleryComponent } from '../../shared/components/image-gallery.component';
import { LocalizedPipe } from '../../shared/localized.pipe';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, DatePipe, TranslatePipe, LocalizedPipe, ImageGalleryComponent],
  template: `
  <div class="page">
    @if (product(); as p) {
      <div class="grid md:grid-cols-2 gap-8">
        <app-image-gallery [images]="p.images" />

        <div class="space-y-4">
          <a routerLink="/catalogue" class="text-sm text-amber-700">← {{ 'NAV.CATALOGUE' | translate }}</a>
          <h1 class="text-2xl font-bold">{{ p.title | localized }}</h1>
          <div class="text-sm text-stone-500">{{ p.brand }} · {{ categoryName() | localized }}</div>
          <div class="text-amber-500">★ {{ rating() | number: '1.1-1' }}
            <span class="text-stone-400 text-sm">({{ p.reviews.length }} {{ 'PRODUCT.REVIEWS' | translate }})</span></div>
          <div class="text-3xl font-bold text-amber-700">{{ p.price | number: '1.0-2' }} DT</div>
          <p class="text-stone-600">{{ p.description | localized }}</p>
          <div class="text-sm" [class]="p.stock > 0 ? 'text-green-700' : 'text-red-600'">
            {{ (p.stock > 0 ? 'PRODUCT.IN_STOCK' : 'SHOP.OUT_OF_STOCK') | translate }}
            @if (p.stock > 0 && p.stock <= 5) { · {{ 'PRODUCT.ONLY_LEFT' | translate: { count: p.stock } }} }
          </div>

          @if (canBuy() && p.stock > 0) {
            <div class="flex items-center gap-3">
              <select class="input w-24" [(ngModel)]="qty">
                @for (n of qtyOptions(); track n) { <option [ngValue]="n">{{ n }}</option> }
              </select>
              <button class="btn" (click)="add()">{{ 'SHOP.ADD_TO_CART' | translate }}</button>
            </div>
            @if (added()) { <p class="text-sm text-green-700">✓ {{ 'SHOP.ADDED' | translate }} — <a routerLink="/cart" class="underline">{{ 'NAV.CART' | translate }}</a></p> }
          }
        </div>
      </div>

      <section class="mt-12">
        <h2 class="text-xl font-bold mb-4">{{ 'PRODUCT.REVIEWS' | translate }}</h2>
        @for (r of p.reviews; track $index) {
          <div class="card mb-3">
            <div class="flex items-center justify-between text-sm">
              <span class="font-medium">{{ r.userName }}</span>
              <span class="text-stone-400">{{ r.createdAt | date: 'dd/MM/yyyy' }}</span>
            </div>
            <div class="text-amber-500 text-sm">{{ stars(r.rating) }}</div>
            <p class="text-sm mt-1">{{ r.comment }}</p>
          </div>
        } @empty {
          <p class="text-stone-500 text-sm mb-4">{{ 'PRODUCT.NO_REVIEWS' | translate }}</p>
        }

        @if (auth.user(); as u) {
          @if (canReview()) {
            <div class="card space-y-3 max-w-xl">
              <h3 class="font-semibold">{{ 'PRODUCT.LEAVE_REVIEW' | translate }}</h3>
              <select class="input w-32" [(ngModel)]="rating_">
                @for (n of [5, 4, 3, 2, 1]; track n) { <option [ngValue]="n">{{ stars(n) }}</option> }
              </select>
              <textarea class="input" rows="3" [(ngModel)]="comment"></textarea>
              <button class="btn" [disabled]="!comment.trim()" (click)="submitReview(u._id, u.name)">{{ 'PRODUCT.SUBMIT_REVIEW' | translate }}</button>
            </div>
          } @else if (u.role === 'CLIENT') {
            <p class="text-sm text-stone-500">{{ 'PRODUCT.REVIEW_RULE' | translate }}</p>
          }
        }
      </section>
    } @else {
      <p class="card text-center">{{ 'PRODUCT.NOT_FOUND' | translate }}</p>
    }
  </div>`,
})
export class ProductDetailComponent {
  private data = inject(DataService);
  auth = inject(AuthService);
  private cart = inject(CartService);

  id = input.required<string>(); // paramètre de route :id
  product = computed(() => {
    const p = this.data.product(this.id());
    // Un produit non validé reste visible uniquement par son fournisseur et l'admin.
    if (!p) return undefined;
    const u = this.auth.user();
    return p.status === 'APPROVED' || u?.role === 'ADMIN' || u?._id === p.vendor ? p : undefined;
  });
  rating = computed(() => (this.product() ? ratingOf(this.product()!) : 0));
  categoryName = computed(() => this.data.category(this.product()?.category ?? '')?.name);
  qtyOptions = computed(() => Array.from({ length: Math.min(this.product()?.stock ?? 0, 10) }, (_, i) => i + 1));

  qty = 1;
  added = signal(false);
  rating_ = 5;
  comment = '';

  canBuy() { const r = this.auth.role(); return r !== 'ADMIN' && r !== 'FOURNISSEUR'; }
  canReview() {
    const u = this.auth.user();
    const p = this.product();
    return !!u && !!p && u.role === 'CLIENT' && this.data.hasPurchased(u._id, p._id) && !p.reviews.some(r => r.userId === u._id);
  }
  stars(n: number) { return '★'.repeat(n) + '☆'.repeat(5 - n); }

  add() {
    this.cart.add(this.product()!, this.qty);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2500);
  }
  submitReview(userId: string, userName: string) {
    this.data.addReview(this.id(), { userId, userName, rating: this.rating_, comment: this.comment.trim(), createdAt: new Date().toISOString() });
    this.comment = '';
  }
}
