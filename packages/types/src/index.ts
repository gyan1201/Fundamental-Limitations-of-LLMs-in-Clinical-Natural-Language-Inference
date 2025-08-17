export type UserRole = 'admin' | 'customer';

export type UserProfile = {
  id: string;
  email: string;
  fullName?: string;
  role: UserRole;
  createdAt: string;
};

export type Product = {
  id: string;
  title: string;
  description?: string;
  priceCents: number;
  currency: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  stock: number;
};

export type CartItem = {
  productId: string;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  totalCents: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  paymentIntentId?: string;
};