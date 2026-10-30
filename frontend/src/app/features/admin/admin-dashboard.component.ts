import { Component, computed, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataService } from '../../core/services/data.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe, TranslatePipe, StatusBadgeComponent],
  template: `
  <div class="page">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <h1 class="text-2xl font-bold">{{ 'ADMIN.DASHBOARD' | translate }}</h1>
      <button class="btn-outline btn-sm" (click)="reset()">{{ 'ADMIN.RESET_DEMO' | translate }}</button>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div class="card"><div class="text-sm text-stone-500">{{ 'ADMIN.STAT_REVENUE' | translate }}</div><div class="text-2xl font-bold text-amber-700">{{ s().revenue | number: '1.0-0' }} DT</div></div>
      <div class="card"><div class="text-sm text-stone-500">{{ 'ADMIN.STAT_ORDERS' | translate }}</div><div class="text-2xl font-bold">{{ s().orders }}</div></div>
      <div class="card"><div class="text-sm text-stone-500">{{ 'ADMIN.STAT_CLIENTS' | translate }}</div><div class="text-2xl font-bold">{{ s().clients }}</div></div>
      <div class="card"><div class="text-sm text-stone-500">{{ 'ADMIN.STAT_VENDORS' | translate }}</div><div class="text-2xl font-bold">{{ s().vendors }}</div></div>
      <div class="card"><div class="text-sm text-stone-500">{{ 'ADMIN.STAT_PRODUCTS' | translate }}</div><div class="text-2xl font-bold">{{ s().products }}</div></div>
      <a routerLink="/admin/products" class="card hover:shadow-md"><div class="text-sm text-stone-500">{{ 'ADMIN.STAT_PENDING_PRODUCTS' | translate }}</div><div class="text-2xl font-bold text-yellow-700">{{ s().pendingProducts }}</div></a>
      <a routerLink="/admin/vendors" class="card hover:shadow-md"><div class="text-sm text-stone-500">{{ 'ADMIN.STAT_PENDING_VENDORS' | translate }}</div><div class="text-2xl font-bold text-yellow-700">{{ s().pendingVendors }}</div></a>
    </div>

    <div class="flex flex-wrap gap-2 mb-8">
      <a routerLink="/admin/vendors" class="btn-outline">{{ 'ADMIN.VENDORS' | translate }}</a>
      <a routerLink="/admin/products" class="btn-outline">{{ 'ADMIN.PRODUCTS' | translate }}</a>
      <a routerLink="/admin/users" class="btn-outline">{{ 'ADMIN.USERS' | translate }}</a>
      <a routerLink="/admin/categories" class="btn-outline">{{ 'ADMIN.CATEGORIES' | translate }}</a>
    </div>

    <h2 class="text-lg font-semibold mb-3">{{ 'ADMIN.RECENT_ORDERS' | translate }}</h2>
    <div class="card overflow-x-auto">
      <table class="tbl">
        <thead><tr><th>#</th><th>{{ 'COMMON.DATE' | translate }}</th><th>{{ 'VENDOR.CUSTOMER' | translate }}</th><th>{{ 'COMMON.TOTAL' | translate }}</th><th>{{ 'COMMON.STATUS' | translate }}</th></tr></thead>
        <tbody>
          @for (o of recent(); track o._id) {
            <tr>
              <td>{{ o._id.replace('o_', '') }}</td>
              <td>{{ o.createdAt | date: 'dd/MM/yyyy' }}</td>
              <td>{{ o.shipping.fullName }}</td>
              <td>{{ o.total | number: '1.0-2' }} DT</td>
              <td><app-status-badge [status]="o.status" /></td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>`,
})
export class AdminDashboardComponent {
  data = inject(DataService);
  private tr = inject(TranslateService);
  s = computed(() => { this.data.users(); this.data.products(); this.data.orders(); return this.data.stats(); });
  recent = computed(() => [...this.data.orders()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8));
  reset() { if (confirm(this.tr.instant('ADMIN.RESET_CONFIRM'))) this.data.resetDemo(); }
}
