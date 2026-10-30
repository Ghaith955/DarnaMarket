import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Product, ratingOf } from '../../core/models';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { LocalizedPipe } from '../localized.pipe';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, DecimalPipe, TranslatePipe, LocalizedPipe],
  template: `
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col h-full">
    <a [routerLink]="['/product', p()._id]">
      <img [src]="p().images[0]" [alt]="p().title | localized" class="h-48 w-full object-cover" loading="lazy">
    </a>
    <div class="p-4 flex flex-col gap-2 grow">
      <a [routerLink]="['/product', p()._id]" class="font-medium line-clamp-2">{{ p().title | localized }}</a>
      <div class="text-xs text-stone-500">{{ p().brand }}</div>
      <div class="text-sm text-amber-500">★ {{ rating() | number: '1.1-1' }}
        <span class="text-stone-400">({{ p().reviews.length }})</span></div>
      <div class="mt-auto flex items-center justify-between gap-2">
        <span class="font-bold text-amber-700">{{ p().price | number: '1.0-2' }} DT</span>
        @if (canBuy()) {
          <button class="btn btn-sm" [disabled]="p().stock === 0" (click)="cart.add(p())">
            {{ (p().stock === 0 ? 'SHOP.OUT_OF_STOCK' : 'SHOP.ADD_TO_CART') | translate }}
          </button>
        }
      </div>
    </div>
  </div>`,
})
export class ProductCardComponent {
  p = input.required<Product>();
  cart = inject(CartService);
  private auth = inject(AuthService);
  rating = computed(() => ratingOf(this.p()));
  canBuy() { const r = this.auth.role(); return r !== 'ADMIN' && r !== 'FOURNISSEUR'; }
}
