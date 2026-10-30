import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DataService } from '../../core/services/data.service';
import { LocalizedPipe } from '../../shared/localized.pipe';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [FormsModule, RouterLink, TranslatePipe, LocalizedPipe],
  template: `
  <div class="page">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold">{{ 'ADMIN.CATEGORIES' | translate }}</h1>
      <a routerLink="/admin" class="btn-outline">{{ 'ADMIN.DASHBOARD' | translate }}</a>
    </div>

    <div class="grid lg:grid-cols-[1fr_22rem] gap-6">
      <div class="card space-y-4">
        @for (r of data.roots(); track r._id) {
          <div>
            <div class="flex items-center justify-between font-semibold">
              <span>{{ r.name | localized }} <span class="text-xs text-stone-400 font-normal">{{ r.slug }}</span></span>
              <button class="btn-danger" (click)="remove(r._id)">{{ 'COMMON.DELETE' | translate }}</button>
            </div>
            <ul class="ms-5 mt-2 space-y-1">
              @for (c of data.children(r._id); track c._id) {
                <li class="flex items-center justify-between text-sm">
                  <span>— {{ c.name | localized }} <span class="text-xs text-stone-400">{{ c.slug }}</span></span>
                  <button class="text-red-600 cursor-pointer" (click)="remove(c._id)" aria-label="Delete">✕</button>
                </li>
              }
            </ul>
          </div>
        }
      </div>

      <div class="card h-fit space-y-3">
        <h2 class="font-semibold">{{ 'ADMIN.ADD_CATEGORY' | translate }}</h2>
        <div><label class="block text-sm mb-1">Français</label><input class="input" [(ngModel)]="fr"></div>
        <div><label class="block text-sm mb-1">English</label><input class="input" [(ngModel)]="en"></div>
        <div><label class="block text-sm mb-1">العربية</label><input class="input" dir="rtl" [(ngModel)]="ar"></div>
        <div>
          <label class="block text-sm mb-1">{{ 'ADMIN.PARENT' | translate }}</label>
          <select class="input" [(ngModel)]="parent">
            <option value="">— {{ 'ADMIN.MAIN_CATEGORY' | translate }}</option>
            @for (r of data.roots(); track r._id) { <option [value]="r._id">{{ r.name | localized }}</option> }
          </select>
        </div>
        @if (error) { <p class="text-sm text-red-600">{{ error | translate }}</p> }
        <button class="btn w-full" [disabled]="!fr.trim() || !en.trim() || !ar.trim()" (click)="add()">{{ 'COMMON.ADD' | translate }}</button>
      </div>
    </div>
  </div>`,
})
export class AdminCategoriesComponent {
  data = inject(DataService);
  private tr = inject(TranslateService);
  fr = ''; en = ''; ar = ''; parent = '';
  error = '';

  add() {
    const slug = this.fr.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (this.data.categories().some(c => c.slug === slug)) { this.error = 'ADMIN.ERR_SLUG'; return; }
    this.data.addCategory({ slug, name: { fr: this.fr.trim(), en: this.en.trim(), ar: this.ar.trim() }, parent: this.parent || null });
    this.fr = this.en = this.ar = ''; this.error = '';
  }
  remove(id: string) {
    if (!confirm(this.tr.instant('COMMON.CONFIRM_DELETE'))) return;
    if (!this.data.deleteCategory(id)) this.error = 'ADMIN.ERR_CATEGORY_USED'; else this.error = '';
  }
}
