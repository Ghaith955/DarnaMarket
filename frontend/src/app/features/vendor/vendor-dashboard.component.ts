import { Component, computed, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { OrderStatus } from '../../core/models';
import { LocalizedPipe } from '../../shared/localized.pipe';

@Component({
  selector: 'app-vendor-dashboard',
  standalone: true,
  imports: [FormsModule, RouterLink, DatePipe, DecimalPipe, TranslatePipe, LocalizedPipe],
  template: `
  <div class="page">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <h1 class="text-2xl font-bold">{{ 'VENDOR.DASHBOARD' | translate }}</h1>
      <div class="flex gap-2">
        <a routerLink="/vendor/products" class="btn-outline">{{ 'VENDOR.MY_PRODUCTS' | translate }}</a>
        <a routerLink="/vendor/products/new" class="btn">+ {{ 'VENDOR.ADD_PRODUCT' | translate }}</a>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div class="card"><div class="text-sm text-stone-500">{{ 'VENDOR.STAT_PRODUCTS' | translate }}</div><div class="text-2xl font-bold">{{ stats().products }}</div></div>
      <div class="card"><div class="text-sm text-stone-500">{{ 'VENDOR.STAT_PENDING' | translate }}</div><div class="text-2xl font-bold">{{ stats().pending }}</div></div>
      <div class="card"><div class="text-sm text-stone-500">{{ 'VENDOR.STAT_LOW_STOCK' | translate }}</div><div class="text-2xl font-bold text-red-600">{{ stats().lowStock }}</div></div>
      <div class="card"><div class="text-sm text-stone-500">{{ 'VENDOR.STAT_ORDERS' | translate }}</div><div class="text-2xl font-bold">{{ stats().orders }}</div></div>
      <div class="card"><div class="text-sm text-stone-500">{{ 'VENDOR.STAT_UNITS' | translate }}</div><div class="text-2xl font-bold">{{ stats().units }}</div></div>
      <div class="card"><div class="text-sm text-stone-500">{{ 'VENDOR.STAT_REVENUE' | translate }}</div><div class="text-2xl font-bold text-amber-700">{{ stats().revenue | number: '1.0-0' }} DT</div></div>
    </div>

    <h2 class="text-lg font-semibold mb-3">{{ 'VENDOR.ORDERS' | translate }}</h2>
    <div class="card overflow-x-auto">
      <table class="tbl">
        <thead><tr>
          <th>#</th><th>{{ 'COMMON.DATE' | translate }}</th><th>{{ 'VENDOR.CUSTOMER' | translate }}</th>
          <th>{{ 'VENDOR.ITEMS' | translate }}</th><th>{{ 'COMMON.TOTAL' | translate }}</th><th>{{ 'COMMON.STATUS' | translate }}</th>
        </tr></thead>
        <tbody>
          @for (v of orders(); track v.order._id) {
            <tr>
              <td>{{ v.order._id.replace('o_', '') }}</td>
              <td>{{ v.order.createdAt | date: 'dd/MM/yyyy' }}</td>
              <td>{{ v.customer?.name }}<div class="text-xs text-stone-500">{{ v.order.shipping.city }}</div></td>
              <td>@for (i of v.items; track i.productId) { <div>{{ i.quantity }} × {{ i.title | localized }}</div> }</td>
              <td>{{ v.subtotal | number: '1.0-2' }} DT</td>
              <td>
                <select class="input py-1 w-auto" [ngModel]="v.order.status" (ngModelChange)="setStatus(v.order._id, $event)">
                  @for (s of statuses; track s) { <option [value]="s">{{ 'STATUS.' + s | translate }}</option> }
                </select>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="text-center text-stone-500 py-6">{{ 'VENDOR.NO_ORDERS' | translate }}</td></tr>
          }
        </tbody>
      </table>
    </div>
  </div>`,
})
export class VendorDashboardComponent {
  private auth = inject(AuthService);
  private data = inject(DataService);
  statuses: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
  stats = computed(() => { this.data.orders(); this.data.products(); return this.data.vendorStats(this.auth.user()!._id); });
  orders = computed(() => this.data.vendorOrders(this.auth.user()!._id));
  setStatus(id: string, s: OrderStatus) { this.data.setOrderStatus(id, s); }
}
