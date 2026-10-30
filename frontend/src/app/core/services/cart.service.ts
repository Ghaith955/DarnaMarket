import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartItem, Product } from '../models';
import { DataService } from './data.service';

@Injectable({ providedIn: 'root' })
export class CartService {
  private data = inject(DataService);
  readonly items = signal<CartItem[]>(this.load());
  readonly count = computed(() => this.items().reduce((n, i) => n + i.quantity, 0));
  readonly total = computed(() => this.items().reduce((s, i) => s + i.price * i.quantity, 0));

  constructor() {
    effect(() => localStorage.setItem('darna_cart', JSON.stringify(this.items())));
  }
  private load(): CartItem[] {
    try { return JSON.parse(localStorage.getItem('darna_cart') ?? '[]'); } catch { return []; }
  }

  add(p: Product, quantity = 1) {
    this.items.update(list => {
      const found = list.find(i => i.productId === p._id);
      if (found) {
        return list.map(i => i.productId === p._id ? { ...i, quantity: Math.min(i.quantity + quantity, p.stock) } : i);
      }
      return [...list, { productId: p._id, vendorId: p.vendor, title: p.title, price: p.price, image: p.images[0], quantity: Math.min(quantity, p.stock) }];
    });
  }
  setQty(productId: string, quantity: number) {
    const stock = this.data.product(productId)?.stock ?? quantity;
    const q = Math.max(1, Math.min(quantity, stock));
    this.items.update(l => l.map(i => i.productId === productId ? { ...i, quantity: q } : i));
  }
  remove(productId: string) { this.items.update(l => l.filter(i => i.productId !== productId)); }
  clear() { this.items.set([]); }
}
