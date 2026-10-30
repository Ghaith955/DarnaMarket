import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from './data.service';
import { Role } from '../models';

const SESSION = 'darna_session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private data = inject(DataService);
  private router = inject(Router);
  private userId = signal<string | null>(localStorage.getItem(SESSION));

  /** Utilisateur courant (relu depuis le store : un blocage admin déconnecte aussitôt). */
  readonly user = computed(() => {
    const id = this.userId();
    const u = id ? this.data.user(id) : undefined;
    return u && !u.isBlocked ? u : null;
  });
  readonly role = computed<Role | null>(() => this.user()?.role ?? null);
  readonly isLoggedIn = computed(() => !!this.user());

  /** Faux JWT en mode démo ; le vrai token viendra du backend. */
  get token(): string | null {
    const id = this.userId();
    return id ? 'mock.' + btoa(id) : null;
  }

  login(email: string, password: string) {
    const r = this.data.login(email, password);
    if (r.user) { this.userId.set(r.user._id); localStorage.setItem(SESSION, r.user._id); }
    return r;
  }
  register(d: Parameters<DataService['register']>[0]) { return this.data.register(d); }
  startSession(id: string) { this.userId.set(id); localStorage.setItem(SESSION, id); }

  logout() {
    this.userId.set(null);
    localStorage.removeItem(SESSION);
    this.router.navigateByUrl('/');
  }
  homeFor(role: Role): string {
    return role === 'ADMIN' ? '/admin' : role === 'FOURNISSEUR' ? '/vendor' : '/';
  }
}
