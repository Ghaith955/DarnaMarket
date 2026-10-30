export type Lang = 'fr' | 'en' | 'ar';
export type L10n = Record<Lang, string>;
export type Role = 'CLIENT' | 'FOURNISSEUR' | 'ADMIN';
export type ProductStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface User {
  _id: string; name: string; email: string; password: string; role: Role;
  phone?: string; address?: string; city?: string;
  isBlocked: boolean; isApproved: boolean; createdAt: string;
}
export interface Category { _id: string; slug: string; name: L10n; parent: string | null; }
export interface Review { userId: string; userName: string; rating: number; comment: string; createdAt: string; }
export interface Product {
  _id: string; title: L10n; description: L10n; price: number; brand: string;
  images: string[]; stock: number; category: string; vendor: string;
  status: ProductStatus; rejectionReason?: string; reviews: Review[]; createdAt: string;
}
export interface CartItem { productId: string; vendorId: string; title: L10n; price: number; image: string; quantity: number; }
export interface Shipping { fullName: string; phone: string; street: string; city: string; zip: string; }
export type PaymentMethod = 'CASH_ON_DELIVERY' | 'CARD';
export interface Order {
  _id: string; customerId: string; items: CartItem[]; shipping: Shipping;
  paymentMethod: PaymentMethod; total: number; status: OrderStatus; createdAt: string;
}

export function ratingOf(p: Product): number {
  return p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0;
}
