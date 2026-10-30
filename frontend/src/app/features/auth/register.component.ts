import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  template: `
  <div class="max-w-md mx-auto px-4 py-10">
    <h1 class="h1">{{ 'AUTH.REGISTER_TITLE' | translate }}</h1>

    @if (pending) {
      <div class="card text-center space-y-4">
        <p>{{ 'AUTH.VENDOR_PENDING' | translate }}</p>
        <a routerLink="/auth/login" class="btn">{{ 'NAV.LOGIN' | translate }}</a>
      </div>
    } @else {
      <form (ngSubmit)="submit()" class="card space-y-4">
        <div>
          <label class="block text-sm mb-1">{{ 'COMMON.NAME' | translate }}</label>
          <input class="input" name="name" required [(ngModel)]="name">
        </div>
        <div>
          <label class="block text-sm mb-1">{{ 'COMMON.EMAIL' | translate }}</label>
          <input class="input" name="email" type="email" required [(ngModel)]="email">
        </div>
        <div>
          <label class="block text-sm mb-1">{{ 'COMMON.PHONE' | translate }}</label>
          <input class="input" name="phone" [(ngModel)]="phone">
        </div>
        <div>
          <label class="block text-sm mb-1">{{ 'COMMON.PASSWORD' | translate }}</label>
          <input class="input" name="password" type="password" minlength="6" required [(ngModel)]="password">
        </div>
        <div>
          <label class="block text-sm mb-1">{{ 'AUTH.ACCOUNT_TYPE' | translate }}</label>
          <select class="input" name="role" [(ngModel)]="role">
            <option value="CLIENT">{{ 'ROLE.CLIENT' | translate }}</option>
            <option value="FOURNISSEUR">{{ 'ROLE.FOURNISSEUR' | translate }}</option>
          </select>
        </div>
        @if (error) { <p class="text-sm text-red-600">{{ 'AUTH.ERR_' + error | translate }}</p> }
        <button class="btn w-full" type="submit">{{ 'AUTH.REGISTER_BTN' | translate }}</button>
        <p class="text-sm text-center">{{ 'AUTH.HAVE_ACCOUNT' | translate }}
          <a routerLink="/auth/login" class="text-amber-700 font-medium">{{ 'NAV.LOGIN' | translate }}</a></p>
      </form>
    }
  </div>`,
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  name = ''; email = ''; phone = ''; password = '';
  role: 'CLIENT' | 'FOURNISSEUR' = 'CLIENT';
  error: string | null = null;
  pending = false;

  submit() {
    const r = this.auth.register({ name: this.name, email: this.email, phone: this.phone, password: this.password, role: this.role });
    if (r.error || !r.user) { this.error = r.error ?? 'EXISTS'; return; }
    if (r.user.role === 'FOURNISSEUR') { this.pending = true; return; }
    this.auth.startSession(r.user._id);
    this.router.navigateByUrl('/');
  }
}
