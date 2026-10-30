import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { L10n, PaymentMethod } from '../../core/models';
import { LocalizedPipe } from '../../shared/localized.pipe';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, TranslatePipe, LocalizedPipe],
  template: `
  <div class="page">
    <h1 class="h1">{{ 'CHECKOUT.TITLE' | translate }}</h1>
    @if (cart.items().length) {
      <div class="grid lg:grid-cols-[1fr_22rem] gap-6">
        <form (ngSubmit)="place()" class="card space-y-4">
          <h2 class="font-semibold">{{ 'CHECKOUT.SHIPPING' | translate }}</h2>
          <div class="grid sm:grid-cols-2 gap-4">
            <div><label class="block text-sm mb-1">{{ 'CHECKOUT.FULL_NAME' | translate }}</label>
              <input class="input" name="fullName" required [(ngModel)]="s.fullName"></div>
            <div><label class="block text-sm mb-1">{{ 'COMMON.PHONE' | translate }}</label>
              <input class="input" name="phone" required [(ngModel)]="s.phone"></div>
          </div>
          <div><label class="block text-sm mb-1">{{ 'COMMON.ADDRESS' | translate }}</label>
            <input class="input" name="street" required [(ngModel)]="s.street"></div>
          <div class="grid sm:grid-cols-2 gap-4">
            <div><label class="block text-sm mb-1">{{ 'COMMON.CITY' | translate }}</label>
              <input class="input" name="city" required [(ngModel)]="s.city"></div>
            <div><label class="block text-sm mb-1">{{ 'COMMON.ZIP' | translate }}</label>
              <input class="input" name="zip" required [(ngModel)]="s.zip"></div>
          </div>

          <h2 class="font-semibold pt-2">{{ 'CHECKOUT.PAYMENT' | translate }}</h2>
          <label class="flex items-center gap-2"><input type="radio" name="pay" value="CASH_ON_DELIVERY" [(ngModel)]="payment"> {{ 'CHECKOUT.COD' | translate }}</label>
          <label class="flex items-center gap-2"><input type="radio" name="pay" value="CARD" [(ngModel)]="payment"> {{ 'CHECKOUT.CARD' | translate }}</label>

          @if (stockError) { <p class="text-sm text-red-600">{{ 'CHECKOUT.ERR_STOCK' | translate }} : {{ stockError | localized }}</p> }
          <button class="btn w-full" type="submit">{{ 'CHECKOUT.PLACE' | translate }}</button>
        </form>

        <aside class="card h-fit space-y-3">
          <h2 class="font-semibold">{{ 'CHECKOUT.SUMMARY' | translate }}</h2>
          @for (i of cart.items(); track i.productId) {
            <div class="flex justify-between text-sm gap-2">
              <span>{{ i.quantity }} × {{ i.title | localized }}</span>
              <span class="whitespace-nowrap">{{ i.price * i.quantity | number: '1.0-2' }} DT</span>
            </div>
          }
          <div class="border-t pt-3 flex justify-between font-bold">
            <span>{{ 'COMMON.TOTAL' | translate }}</span><span>{{ cart.total() | number: '1.0-2' }} DT</span>
          </div>
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
export class CheckoutComponent {
  cart = inject(CartService);
  private auth = inject(AuthService);
  private data = inject(DataService);
  private router = inject(Router);

  payment: PaymentMethod = 'CASH_ON_DELIVERY';
  stockError: L10n | null = null;
  s = (() => {
    const u = this.auth.user();
    return { fullName: u?.name ?? '', phone: u?.phone ?? '', street: u?.address ?? '', city: u?.city ?? '', zip: '' };
  })();

  place() {
    const u = this.auth.user();
    if (!u) return;
    const r = this.data.placeOrder(u._id, this.cart.items(), this.s, this.payment);
    if (r.outOfStock) { this.stockError = r.outOfStock; return; }
    this.cart.clear();
    this.router.navigate(['/orders']);
  }
}
