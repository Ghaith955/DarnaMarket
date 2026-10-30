import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { LocalizedPipe } from '../../shared/localized.pipe';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, DecimalPipe, TranslatePipe, LocalizedPipe],
  template: `
  <div class="page">
    <h1 class="h1">{{ 'NAV.CART' | translate }}</h1>
    @if (cart.items().length) {
      <div class="grid lg:grid-cols-[1fr_20rem] gap-6">
        <div class="space-y-3">
          @for (i of cart.items(); track i.productId) {
            <div class="card flex items-center gap-4">
              <img [src]="i.image" alt="" class="w-24 h-20 object-cover rounded-lg">
              <div class="grow">
                <a [routerLink]="['/product', i.productId]" class="font-medium">{{ i.title | localized }}</a>
                <div class="text-sm text-stone-500">{{ i.price | number: '1.0-2' }} DT</div>
              </div>
              <div class="flex items-center gap-2">
                <button class="btn-outline btn-sm" (click)="cart.setQty(i.productId, i.quantity - 1)">−</button>
                <span class="w-6 text-center">{{ i.quantity }}</span>
                <button class="btn-outline btn-sm" (click)="cart.setQty(i.productId, i.quantity + 1)">+</button>
              </div>
              <div class="w-28 text-end font-semibold">{{ i.price * i.quantity | number: '1.0-2' }} DT</div>
              <button class="text-red-600 cursor-pointer" (click)="cart.remove(i.productId)" aria-label="Remove">✕</button>
            </div>
          }
        </div>
        <aside class="card h-fit space-y-4">
          <div class="flex justify-between text-lg font-bold">
            <span>{{ 'COMMON.TOTAL' | translate }}</span><span>{{ cart.total() | number: '1.0-2' }} DT</span>
          </div>
          @if (auth.role() === 'CLIENT') {
            <a routerLink="/checkout" class="btn w-full">{{ 'CART.CHECKOUT' | translate }}</a>
          } @else if (!auth.isLoggedIn()) {
            <a routerLink="/checkout" class="btn w-full">{{ 'CART.LOGIN_TO_ORDER' | translate }}</a>
          }
          <button class="btn-outline w-full" (click)="cart.clear()">{{ 'CART.CLEAR' | translate }}</button>
        </aside>
      </div>
    } @else {
      <div class="card text-center space-y-4">
        <p>{{ 'CART.EMPTY' | translate }}</p>
        <a routerLink="/catalogue" class="btn">{{ 'HOME.CTA' | translate }}</a>
      </div>
    }
  </div>`,
})
export class CartComponent {
  cart = inject(CartService);
  auth = inject(AuthService);
}
