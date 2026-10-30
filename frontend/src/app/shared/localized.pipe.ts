import { Pipe, PipeTransform, inject } from '@angular/core';
import { L10n } from '../core/models';
import { LanguageService } from '../core/services/language.service';

/** Affiche un champ trilingue {fr,en,ar} dans la langue active. */
@Pipe({ name: 'localized', standalone: true, pure: false })
export class LocalizedPipe implements PipeTransform {
  private lang = inject(LanguageService);
  transform(v: L10n | null | undefined): string {
    return v ? (v[this.lang.current()] || v.fr || '') : '';
  }
}
