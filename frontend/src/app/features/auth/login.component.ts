import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { DEMO_ACCOUNTS } from '../../core/mock/mock-db';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe],
  template: `
  <div class="max-w-md mx-auto px-4 py-10">
    <h1 class="h1">{{ 'AUTH.LOGIN_TITLE' | translate }}</h1>

    <form (ngSubmit)="submit()" class="card space-y-4">
      <div>
        <label class="block text-sm mb-1">{{ 'COMMON.EMAIL' | translate }}</label>
        <input class="input" name="email" type="email" required [(ngModel)]="email">
      </div>
      <div>
        <label class="block text-sm mb-1">{{ 'COMMON.PASSWORD' | translate }}</label>
        <input class="input" name="password" type="password" required [(ngModel)]="password">
      </div>
      @if (error) { <p class="text-sm text-red-600">{{ 'AUTH.ERR_' + error | translate }}</p> }
      <button class="btn w-full" type="submit">{{ 'AUTH.LOGIN_BTN' | translate }}</button>
      <p class="text-sm text-center">{{ 'AUTH.NO_ACCOUNT' | translate }}
        <a routerLink="/auth/register" class="text-amber-700 font-medium">{{ 'NAV.REGISTER' | translate }}</a></p>
    </form>

    <div class="card mt-6">
      <h2 class="font-semibold mb-1">{{ 'AUTH.DEMO_TITLE' | translate }}</h2>
      <p class="text-xs text-stone-500 mb-3">{{ 'AUTH.DEMO_HINT' | translate }}</p>
      <div class="space-y-2">
        @for (a of demo; track a.email) {
          <button type="button" class="w-full text-start border border-stone-200 rounded-lg px-3 py-2 hover:bg-amber-50 cursor-pointer" (click)="fill(a.email, a.password)">
            <span class="text-xs font-semibold text-amber-700">{{ 'ROLE.' + a.role | translate }}</span>
            <span class="block text-sm">{{ a.name }}</span>
            <span class="block text-xs text-stone-500" dir="ltr">{{ a.email }} · {{ a.password }}</span>
          </button>
        }
      </div>
    </div>
  </div>`,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  returnUrl = input<string>();
  demo = DEMO_ACCOUNTS;
  email = '';
  password = '';
  error: string | null = null;

  fill(email: string, password: string) { this.email = email; this.password = password; this.error = null; }

  submit() {
    const r = this.auth.login(this.email, this.password);
    if (r.error || !r.user) { this.error = r.error ?? 'INVALID'; return; }
    const target = r.user.role === 'CLIENT' ? (this.returnUrl() || '/') : this.auth.homeFor(r.user.role);
    this.router.navigateByUrl(target);
  }
}
