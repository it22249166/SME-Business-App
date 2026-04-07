import { PaymentMethod } from './order';

export interface Payment {
  id: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  amount: number;
  method: PaymentMethod;
  reference: string | null;
  recordedAt: string;
  notes: string;
}

export interface PaymentSummary {
  totalRevenue: number;
  totalByMethod: Partial<Record<PaymentMethod, number>>;
  pendingAmount: number;
  period: 'today' | 'week' | 'month';
}

export { PaymentMethod };
