import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar.component';
import { FooterComponent } from './shared/components/footer.component';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <div class="min-h-screen flex flex-col bg-stone-50 text-stone-800">
      <app-navbar />
      <main class="grow"><router-outlet /></main>
      <app-footer />
    </div>`,
})
export class AppComponent {
  private lang = inject(LanguageService); // initialise la langue et la direction (RTL)
}
