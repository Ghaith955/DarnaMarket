import { Component, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { DataService } from '../../core/services/data.service';
import { StatusBadgeComponent } from '../../shared/components/status-badge.component';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [RouterLink, DatePipe, TranslatePipe, StatusBadgeComponent],
  template: `
  <div class="page">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ 'ADMIN.USERS' | translate }}</h1>
      <a routerLink="/admin" class="btn-outline">{{ 'ADMIN.DASHBOARD' | translate }}</a>
    </div>
    <div class="card overflow-x-auto">
      <table class="tbl">
        <thead><tr>
          <th>{{ 'COMMON.NAME' | translate }}</th><th>{{ 'COMMON.EMAIL' | translate }}</th><th>{{ 'ADMIN.ROLE' | translate }}</th>
          <th>{{ 'COMMON.PHONE' | translate }}</th><th>{{ 'COMMON.DATE' | translate }}</th><th>{{ 'COMMON.STATUS' | translate }}</th><th>{{ 'COMMON.ACTIONS' | translate }}</th>
        </tr></thead>
        <tbody>
          @for (u of users(); track u._id) {
            <tr>
              <td class="font-medium">{{ u.name }}</td>
              <td dir="ltr">{{ u.email }}</td>
              <td>{{ 'ROLE.' + u.role | translate }}</td>
              <td dir="ltr">{{ u.phone }}</td>
              <td>{{ u.createdAt | date: 'dd/MM/yyyy' }}</td>
              <td><app-status-badge [status]="u.isBlocked ? 'BLOCKED' : 'ACTIVE'" /></td>
              <td>
                @if (!u.isBlocked) {
                  <button class="btn-danger" (click)="data.updateUser(u._id, { isBlocked: true })">{{ 'ADMIN.BLOCK' | translate }}</button>
                } @else {
                  <button class="btn-outline btn-sm" (click)="data.updateUser(u._id, { isBlocked: false })">{{ 'ADMIN.UNBLOCK' | translate }}</button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>`,
})
export class AdminUsersComponent {
  data = inject(DataService);
  users = computed(() => this.data.users().filter(u => u.role !== 'ADMIN'));
}
