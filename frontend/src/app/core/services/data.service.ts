import { Injectable, computed, effect, signal } from '@angular/core';
import { Category, CartItem, Order, OrderStatus, PaymentMethod, Product, ProductStatus, Review, Role, Shipping, User } from '../models';
import { Db, seedDb } from '../mock/mock-db';

const KEY = 'darna_db_v1';

/**
 * Store de démonstration (localStorage). Remplace le backend le temps du développement :
 * chaque méthode correspondra plus tard à un appel HttpClient vers l'API Express.
 */
@Injectable({ providedIn: 'root' })
export class DataService {
  private db = signal<Db>(this.load());
  readonly users = computed(() => this.db().users);
  readonly categories = computed(() => this.db().categories);
  readonly products = computed(() => this.db().products);
  readonly orders = computed(() => this.db().orders);
  readonly approved = computed(() => this.products().filter(p => p.status === 'APPROVED'));

  constructor() {
    effect(() => {
      try { localStorage.setItem(KEY, JSON.stringify(this.db())); } catch { /* quota */ }
    });
  }

  private load(): Db {
    try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw) as Db; } catch { /* ignore */ }
    return seedDb();
  }
  private uid(prefix: string) { return prefix + '_' + Math.random().toString(36).slice(2, 9); }
  resetDemo() { this.db.set(seedDb()); }

  // ---------- Utilisateurs ----------
  login(email: string, password: string): { user?: User; error?: 'INVALID' | 'BLOCKED' | 'PENDING' } {
    const u = this.users().find(x => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
    if (!u) return { error: 'INVALID' };
    if (u.isBlocked) return { error: 'BLOCKED' };
    if (u.role === 'FOURNISSEUR' && !u.isApproved) return { error: 'PENDING' };
    return { user: u };
  }
  register(d: { name: string; email: string; password: string; phone?: string; role: Exclude<Role, 'ADMIN'> }): { user?: User; error?: 'EXISTS' } {
    if (this.users().some(u => u.email.toLowerCase() === d.email.trim().toLowerCase())) return { error: 'EXISTS' };
    const user: User = { _id: this.uid('u'), ...d, email: d.email.trim(), isBlocked: false, isApproved: d.role === 'CLIENT', createdAt: new Date().toISOString() };
    this.db.update(db => ({ ...db, users: [...db.users, user] }));
    return { user };
  }
  user(id: string) { return this.users().find(u => u._id === id); }
  updateUser(id: string, patch: Partial<User>) {
    this.db.update(db => ({ ...db, users: db.users.map(u => u._id === id ? { ...u, ...patch } : u) }));
  }

  // ---------- Catégories ----------
  roots() { return this.categories().filter(c => !c.parent); }
  children(id: string) { return this.categories().filter(c => c.parent === id); }
  category(id: string) { return this.categories().find(c => c._id === id); }
  addCategory(c: Omit<Category, '_id'>) {
    this.db.update(db => ({ ...db, categories: [...db.categories, { ...c, _id: this.uid('c') }] }));
  }
  /** Refuse la suppression si la catégorie a des sous-catégories ou des produits. */
  deleteCategory(id: string): boolean {
    if (this.children(id).length || this.products().some(p => p.category === id)) return false;
    this.db.update(db => ({ ...db, categories: db.categories.filter(c => c._id !== id) }));
    return true;
  }

  // ---------- Produits ----------
  product(id: string) { return this.products().find(p => p._id === id); }
  byVendor(vendorId: string) { return this.products().filter(p => p.vendor === vendorId); }
  saveProduct(p: Product) {
    this.db.update(db => ({
      ...db,
      products: db.products.some(x => x._id === p._id) ? db.products.map(x => x._id === p._id ? p : x) : [...db.products, p],
    }));
  }
  newProductId() { return this.uid('p'); }
  deleteProduct(id: string) { this.db.update(db => ({ ...db, products: db.products.filter(p => p._id !== id) })); }
  setProductStatus(id: string, status: ProductStatus, reason?: string) {
    this.db.update(db => ({ ...db, products: db.products.map(p => p._id === id ? { ...p, status, rejectionReason: status === 'REJECTED' ? reason : undefined } : p) }));
  }
  setStock(id: string, stock: number) {
    this.db.update(db => ({ ...db, products: db.products.map(p => p._id === id ? { ...p, stock: Math.max(0, stock) } : p) }));
  }
  addReview(productId: string, r: Review) {
    this.db.update(db => ({ ...db, products: db.products.map(p => p._id === productId ? { ...p, reviews: [...p.reviews, r] } : p) }));
  }
  /** Un avis n'est autorisé que si le client a reçu le produit. */
  hasPurchased(userId: string, productId: string) {
    return this.orders().some(o => o.customerId === userId && o.status === 'DELIVERED' && o.items.some(i => i.productId === productId));
  }

  // ---------- Commandes ----------
  placeOrder(customerId: string, items: CartItem[], shipping: Shipping, paymentMethod: PaymentMethod): { order?: Order; outOfStock?: L10nTitle } {
    for (const it of items) {
      const p = this.product(it.productId);
      if (!p || p.status !== 'APPROVED' || p.stock < it.quantity) return { outOfStock: it.title };
    }
    const order: Order = {
      _id: 'o_' + Math.floor(1000 + Math.random() * 9000) + Date.now().toString().slice(-3),
      customerId, items, shipping, paymentMethod,
      total: items.reduce((s, i) => s + i.price * i.quantity, 0),
      status: 'PENDING', createdAt: new Date().toISOString(),
    };
    this.db.update(db => ({
      ...db,
      orders: [order, ...db.orders],
      products: db.products.map(p => {
        const it = items.find(i => i.productId === p._id);
        return it ? { ...p, stock: p.stock - it.quantity } : p;
      }),
    }));
    return { order };
  }
  ordersOf(customerId: string) { return this.orders().filter(o => o.customerId === customerId); }
  /** Commandes contenant des produits du fournisseur (seules ses lignes sont retournées). */
  vendorOrders(vendorId: string) {
    return this.orders()
      .filter(o => o.items.some(i => i.vendorId === vendorId))
      .map(o => {
        const items = o.items.filter(i => i.vendorId === vendorId);
        return { order: o, items, subtotal: items.reduce((s, i) => s + i.price * i.quantity, 0), customer: this.user(o.customerId) };
      });
  }
  setOrderStatus(id: string, status: OrderStatus) {
    this.db.update(db => ({ ...db, orders: db.orders.map(o => o._id === id ? { ...o, status } : o) }));
  }

  // ---------- Statistiques ----------
  stats() {
    const valid = this.orders().filter(o => o.status !== 'CANCELLED');
    const users = this.users();
    return {
      clients: users.filter(u => u.role === 'CLIENT').length,
      vendors: users.filter(u => u.role === 'FOURNISSEUR').length,
      pendingVendors: users.filter(u => u.role === 'FOURNISSEUR' && !u.isApproved).length,
      products: this.products().length,
      pendingProducts: this.products().filter(p => p.status === 'PENDING').length,
      orders: valid.length,
      revenue: valid.reduce((s, o) => s + o.total, 0),
    };
  }
  vendorStats(vendorId: string) {
    const mine = this.byVendor(vendorId);
    const sold = this.vendorOrders(vendorId).filter(v => v.order.status !== 'CANCELLED');
    return {
      products: mine.length,
      pending: mine.filter(p => p.status === 'PENDING').length,
      lowStock: mine.filter(p => p.stock <= 3).length,
      units: sold.reduce((s, v) => s + v.items.reduce((n, i) => n + i.quantity, 0), 0),
      revenue: sold.reduce((s, v) => s + v.subtotal, 0),
      orders: sold.length,
    };
  }
}

type L10nTitle = import('../models').L10n;
