import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DataService } from '../../core/services/data.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-vendors',
  standalone: true,
  imports: [RouterLink, DatePipe, TranslatePipe, StatusBadgeComponent],
  template: `
  <div class="page">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ 'ADMIN.VENDORS' | translate }}</h1>
      <a routerLink="/admin" class="btn-outline">{{ 'ADMIN.DASHBOARD' | translate }}</a>
    </div>
    <div class="card overflow-x-auto">
      <table class="tbl">
        <thead><tr>
          <th>{{ 'COMMON.NAME' | translate }}</th><th>{{ 'COMMON.EMAIL' | translate }}</th><th>{{ 'COMMON.PHONE' | translate }}</th>
          <th>{{ 'COMMON.CITY' | translate }}</th><th>{{ 'COMMON.DATE' | translate }}</th><th>{{ 'COMMON.STATUS' | translate }}</th><th>{{ 'COMMON.ACTIONS' | translate }}</th>
        </tr></thead>
        <tbody>
          @for (v of vendors(); track v._id) {
            <tr>
              <td class="font-medium">{{ v.name }}</td>
              <td dir="ltr">{{ v.email }}</td>
              <td dir="ltr">{{ v.phone }}</td>
              <td>{{ v.city }}</td>
              <td>{{ v.createdAt | date: 'dd/MM/yyyy' }}</td>
              <td><app-status-badge [status]="v.isBlocked ? 'BLOCKED' : v.isApproved ? 'APPROVED' : 'PENDING'" /></td>
              <td class="whitespace-nowrap">
                @if (!v.isApproved) {
                  <button class="btn btn-sm" (click)="data.updateUser(v._id, { isApproved: true })">{{ 'ADMIN.APPROVE' | translate }}</button>
                }
                @if (!v.isBlocked) {
                  <button class="btn-danger ms-2" (click)="data.updateUser(v._id, { isBlocked: true })">{{ 'ADMIN.BLOCK' | translate }}</button>
                } @else {
                  <button class="btn-outline btn-sm" (click)="data.updateUser(v._id, { isBlocked: false })">{{ 'ADMIN.UNBLOCK' | translate }}</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>`,
})
export class AdminVendorsComponent {
  data = inject(DataService);
  vendors = computed(() => this.data.users().filter(u => u.role === 'FOURNISSEUR'));
}
