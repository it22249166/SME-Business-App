import { BusinessType } from './business';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export type PaymentMethod =
  | 'cash'
  | 'card'
  | 'bank_transfer'
  | 'ez_cash'
  | 'mcash'
  | 'credit';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes: string;
  createdAt: string;
  updatedAt: string;
  businessType: BusinessType;
}

export type CreateOrderInput = Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>;
