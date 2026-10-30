import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { LanguageService } from '../../core/services/language.service';
import { Lang } from '../../core/models';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  template: `
  <header class="bg-white border-b border-stone-200 sticky top-0 z-30">
    <div class="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2">
      <a routerLink="/" class="text-xl font-bold text-amber-700">🏠 {{ 'APP.NAME' | translate }}</a>

      <nav class="flex items-center gap-4 text-sm ms-2">
        <a routerLink="/" routerLinkActive="text-amber-700 font-semibold" [routerLinkActiveOptions]="{ exact: true }">{{ 'NAV.HOME' | translate }}</a>
        <a routerLink="/catalogue" routerLinkActive="text-amber-700 font-semibold">{{ 'NAV.CATALOGUE' | translate }}</a>
        @if (auth.role() === 'FOURNISSEUR') {
          <a routerLink="/vendor" routerLinkActive="text-amber-700 font-semibold">{{ 'NAV.VENDOR_SPACE' | translate }}</a>
        }
        @if (auth.role() === 'ADMIN') {
          <a routerLink="/admin" routerLinkActive="text-amber-700 font-semibold">{{ 'NAV.ADMIN_SPACE' | translate }}</a>
        }
      </nav>

      <div class="ms-auto flex items-center gap-4 text-sm">
        <select class="border border-stone-300 rounded-lg px-2 py-1 bg-white" [value]="lang.current()"
                (change)="lang.setLang($any($event.target).value)" aria-label="Language">
          @for (l of lang.langs; track l.code) { <option [value]="l.code">{{ l.label }}</option> }
        </select>

        @if (auth.role() !== 'ADMIN' && auth.role() !== 'FOURNISSEUR') {
          <a routerLink="/cart" class="relative text-lg" aria-label="Cart">
            🛒
            @if (cart.count() > 0) {
              <span class="absolute -top-2 -end-3 bg-amber-700 text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">{{ cart.count() }}</span>
            }
          </a>
        }

        @if (auth.user(); as u) {
          @if (u.role === 'CLIENT') { <a routerLink="/orders">{{ 'NAV.ORDERS' | translate }}</a> }
          <a routerLink="/profile" class="font-medium">👤 {{ u.name }}</a>
          <button class="btn-outline btn-sm" (click)="auth.logout()">{{ 'NAV.LOGOUT' | translate }}</button>
        } @else {
          <a routerLink="/auth/login">{{ 'NAV.LOGIN' | translate }}</a>
          <a routerLink="/auth/register" class="btn btn-sm">{{ 'NAV.REGISTER' | translate }}</a>
        }
      </div>
    </div>
  </header>`,
})
export class NavbarComponent {
  auth = inject(AuthService);
  cart = inject(CartService);
  lang = inject(LanguageService);
}
