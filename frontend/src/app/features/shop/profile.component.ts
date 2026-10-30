import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  template: `
  <div class="max-w-xl mx-auto px-4 py-8">
    <h1 class="h1">{{ 'PROFILE.TITLE' | translate }}</h1>
    <div class="card space-y-4">
      <div>
        <label class="block text-sm mb-1">{{ 'COMMON.EMAIL' | translate }}</label>
        <input class="input bg-stone-100" [value]="email" disabled dir="ltr">
      </div>
      <div>
        <label class="block text-sm mb-1">{{ 'COMMON.NAME' | translate }}</label>
        <input class="input" [(ngModel)]="name">
      </div>
      <div>
        <label class="block text-sm mb-1">{{ 'COMMON.PHONE' | translate }}</label>
        <input class="input" [(ngModel)]="phone">
      </div>
      <div>
        <label class="block text-sm mb-1">{{ 'COMMON.ADDRESS' | translate }}</label>
        <input class="input" [(ngModel)]="address">
      </div>
      <div>
        <label class="block text-sm mb-1">{{ 'COMMON.CITY' | translate }}</label>
        <input class="input" [(ngModel)]="city">
      </div>
      <button class="btn" (click)="save()">{{ 'COMMON.SAVE' | translate }}</button>
      @if (saved()) { <span class="text-green-700 text-sm ms-3">✓ {{ 'PROFILE.SAVED' | translate }}</span> }
    </div>
  </div>`,
})
export class ProfileComponent {
  private auth = inject(AuthService);
  private data = inject(DataService);
  private u = this.auth.user()!;
  email = this.u.email;
  name = this.u.name;
  phone = this.u.phone ?? '';
  address = this.u.address ?? '';
  city = this.u.city ?? '';
  saved = signal(false);

  save() {
    this.data.updateUser(this.u._id, { name: this.name.trim(), phone: this.phone, address: this.address, city: this.city });
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2500);
  }
}
