import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataService } from '../../core/services/data.service';
import { LocalizedPipe } from '../../shared/localized.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [FormsModule, RouterLink, DecimalPipe, TranslatePipe, LocalizedPipe, StatusBadgeComponent],
  template: `
  <div class="page">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <h1 class="text-2xl font-bold">{{ 'ADMIN.PRODUCTS' | translate }}</h1>
      <div class="flex gap-2">
        <select class="input w-auto" [(ngModel)]="filter">
          <option value="">{{ 'COMMON.ALL' | translate }}</option>
          <option value="PENDING">{{ 'STATUS.PENDING' | translate }}</option>
          <option value="APPROVED">{{ 'STATUS.APPROVED' | translate }}</option>
          <option value="REJECTED">{{ 'STATUS.REJECTED' | translate }}</option>
        </select>
        <a routerLink="/admin" class="btn-outline">{{ 'ADMIN.DASHBOARD' | translate }}</a>
      </div>
    </div>
    <div class="card overflow-x-auto">
      <table class="tbl">
        <thead><tr>
          <th></th><th>{{ 'COMMON.NAME' | translate }}</th><th>{{ 'ADMIN.VENDOR' | translate }}</th><th>{{ 'COMMON.PRICE' | translate }}</th>
          <th>{{ 'COMMON.STOCK' | translate }}</th><th>{{ 'COMMON.STATUS' | translate }}</th><th>{{ 'COMMON.ACTIONS' | translate }}</th>
        </tr></thead>
        <tbody>
          @for (p of list(); track p._id) {
            <tr>
              <td><img [src]="p.images[0]" alt="" class="w-14 h-12 object-cover rounded"></td>
              <td class="max-w-64"><a [routerLink]="['/product', p._id]" class="text-amber-700">{{ p.title | localized }}</a></td>
              <td>{{ vendorName(p.vendor) }}</td>
              <td>{{ p.price | number: '1.0-2' }} DT</td>
              <td>{{ p.stock }}</td>
              <td><app-status-badge [status]="p.status" />
                @if (p.rejectionReason) { <div class="text-xs text-red-600 mt-1">{{ p.rejectionReason }}</div> }</td>
              <td class="whitespace-nowrap">
                @if (p.status !== 'APPROVED') {
                  <button class="btn btn-sm" (click)="data.setProductStatus(p._id, 'APPROVED')">{{ 'ADMIN.APPROVE' | translate }}</button>
                }
                @if (p.status !== 'REJECTED') {
                  <button class="btn-danger ms-2" (click)="reject(p._id)">{{ 'ADMIN.REJECT' | translate }}</button>
                }
              </td>
            </tr>
          } @empty {
            <tr><td colspan="7" class="text-center text-stone-500 py-6">{{ 'ADMIN.NOTHING' | translate }}</td></tr>
          }
        </tbody>
      </table>
    </div>
  </div>`,
})
export class AdminProductsComponent {
  data = inject(DataService);
  private tr = inject(TranslateService);
  filter = signal('PENDING');
  list = computed(() => this.data.products().filter(p => !this.filter() || p.status === this.filter()));
  vendorName(id: string) { return this.data.user(id)?.name ?? '—'; }
  reject(id: string) {
    const reason = prompt(this.tr.instant('ADMIN.REJECT_REASON'));
    if (reason !== null) this.data.setProductStatus(id, 'REJECTED', reason.trim() || undefined);
  }
}
