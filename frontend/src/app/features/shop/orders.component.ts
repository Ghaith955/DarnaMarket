import { Component, computed, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { LocalizedPipe } from '../../shared/localized.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, TranslatePipe, LocalizedPipe, StatusBadgeComponent],
  template: `
  <div class="page">
    <h1 class="h1">{{ 'ORDERS.TITLE' | translate }}</h1>
    @for (o of orders(); track o._id) {
      <div class="card mb-4">
        <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div><span class="font-semibold">#{{ o._id.replace('o_', '') }}</span>
            <span class="text-sm text-stone-500 ms-2">{{ o.createdAt | date: 'dd/MM/yyyy HH:mm' }}</span></div>
          <app-status-badge [status]="o.status" />
        </div>
        @for (i of o.items; track i.productId) {
          <div class="flex items-center gap-3 py-1 text-sm">
            <img [src]="i.image" alt="" class="w-12 h-10 object-cover rounded">
            <a [routerLink]="['/product', i.productId]" class="grow">{{ i.title | localized }}</a>
            <span>{{ i.quantity }} × {{ i.price | number: '1.0-2' }} DT</span>
          </div>
        }
        <div class="border-t mt-3 pt-3 flex justify-between font-semibold">
          <span>{{ 'COMMON.TOTAL' | translate }}</span><span>{{ o.total | number: '1.0-2' }} DT</span>
        </div>
      </div>
    } @empty {
      <div class="card text-center space-y-4">
        <p>{{ 'ORDERS.EMPTY' | translate }}</p>
        <a routerLink="/catalogue" class="btn">{{ 'HOME.CTA' | translate }}</a>
      </div>
    }
  </div>`,
})
export class OrdersComponent {
  private auth = inject(AuthService);
  private data = inject(DataService);
  orders = computed(() => {
    const u = this.auth.user();
    return u ? this.data.ordersOf(u._id) : [];
  });
}
