import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';
import { LocalizedPipe } from '../../shared/localized.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-my-products',
  standalone: true,
  imports: [RouterLink, DecimalPipe, TranslatePipe, LocalizedPipe, StatusBadgeComponent],
  template: `
  <div class="page">
    <div class="flex items-center justify-between mb-6 flex-wrap gap-3">
      <h1 class="text-2xl font-bold">{{ 'VENDOR.MY_PRODUCTS' | translate }}</h1>
      <div class="flex gap-2">
        <a routerLink="/vendor" class="btn-outline">{{ 'VENDOR.DASHBOARD' | translate }}</a>
        <a routerLink="/vendor/products/new" class="btn">+ {{ 'VENDOR.ADD_PRODUCT' | translate }}</a>
      </div>
    </div>
    <div class="card overflow-x-auto">
      <table class="tbl">
        <thead><tr>
          <th></th><th>{{ 'COMMON.NAME' | translate }}</th><th>{{ 'COMMON.PRICE' | translate }}</th>
          <th>{{ 'COMMON.STOCK' | translate }}</th><th>{{ 'COMMON.STATUS' | translate }}</th><th>{{ 'COMMON.ACTIONS' | translate }}</th>
        </tr></thead>
        <tbody>
          @for (p of products(); track p._id) {
            <tr>
              <td><img [src]="p.images[0]" alt="" class="w-14 h-12 object-cover rounded"></td>
              <td class="max-w-64">{{ p.title | localized }}<div class="text-xs text-stone-500">{{ p.brand }}</div></td>
              <td>{{ p.price | number: '1.0-2' }} DT</td>
              <td>
                <div class="flex items-center gap-1">
                  <button class="btn-outline btn-sm" (click)="data.setStock(p._id, p.stock - 1)">−</button>
                  <span class="w-8 text-center font-semibold" [class.text-red-600]="p.stock <= 3">{{ p.stock }}</span>
                  <button class="btn-outline btn-sm" (click)="data.setStock(p._id, p.stock + 1)">+</button>
                </div>
              </td>
              <td>
                <app-status-badge [status]="p.status" />
                @if (p.status === 'REJECTED' && p.rejectionReason) { <div class="text-xs text-red-600 mt-1">{{ p.rejectionReason }}</div> }
              </td>
              <td class="whitespace-nowrap">
                <a [routerLink]="['/vendor/products', p._id, 'edit']" class="btn-outline btn-sm">{{ 'COMMON.EDIT' | translate }}</a>
                <button class="btn-danger ms-2" (click)="remove(p._id)">{{ 'COMMON.DELETE' | translate }}</button>
              </td>
            </tr>
          } @empty {
            <tr><td colspan="6" class="text-center text-stone-500 py-6">{{ 'VENDOR.NO_PRODUCTS' | translate }}</td></tr>
          }
        </tbody>
      </table>
    </div>
  </div>`,
})
export class MyProductsComponent {
  private auth = inject(AuthService);
  data = inject(DataService);
  private tr = inject(TranslateService);
  products = computed(() => this.data.byVendor(this.auth.user()!._id));
  remove(id: string) { if (confirm(this.tr.instant('COMMON.CONFIRM_DELETE'))) this.data.deleteProduct(id); }
}
