import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Lang } from '../models';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private translate = inject(TranslateService);
  readonly langs: { code: Lang; label: string }[] = [
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' },
    { code: 'ar', label: 'العربية' },
  ];
  readonly current = signal<Lang>('fr');

  constructor() {
    this.translate.addLangs(['fr', 'en', 'ar']);
    this.translate.setDefaultLang('fr');
    const saved = localStorage.getItem('darna_lang') as Lang | null;
    this.setLang(saved && ['fr', 'en', 'ar'].includes(saved) ? saved : 'fr');
  }

  /** Change la langue à chaud et bascule la direction (RTL pour l'arabe), sans recharger. */
  setLang(lang: Lang) {
    this.translate.use(lang);
    this.current.set(lang);
    localStorage.setItem('darna_lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }
  get isRtl() { return this.current() === 'ar'; }
}
