'use client';

import { cn } from '@/lib/utils';
import { OrderStatus, PaymentStatus, StockStatus } from '@/types';

const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const PAYMENT_STATUS_STYLES: Record<PaymentStatus, string> = {
  unpaid: 'bg-red-100 text-red-800',
  partial: 'bg-orange-100 text-orange-800',
  paid: 'bg-green-100 text-green-800',
};

const STOCK_STATUS_STYLES: Record<StockStatus, string> = {
  in_stock: 'bg-green-100 text-green-800',
  low_stock: 'bg-yellow-100 text-yellow-800',
  out_of_stock: 'bg-red-100 text-red-800',
};

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', className)}>
      {children}
    </span>
  );
}

export function OrderStatusBadge({ status, label }: { status: OrderStatus; label: string }) {
  return <Badge className={ORDER_STATUS_STYLES[status]}>{label}</Badge>;
}

export function PaymentStatusBadge({ status, label }: { status: PaymentStatus; label: string }) {
  return <Badge className={PAYMENT_STATUS_STYLES[status]}>{label}</Badge>;
}

export function StockStatusBadge({ status, label }: { status: StockStatus; label: string }) {
  return <Badge className={STOCK_STATUS_STYLES[status]}>{label}</Badge>;
}

const METHOD_STYLES: Record<string, string> = {
  cash: 'bg-green-100 text-green-800',
  card: 'bg-blue-100 text-blue-800',
  bank_transfer: 'bg-indigo-100 text-indigo-800',
  ez_cash: 'bg-orange-100 text-orange-800',
  mcash: 'bg-purple-100 text-purple-800',
  credit: 'bg-gray-100 text-gray-800',
};

export function PaymentMethodBadge({ method, label }: { method: string; label: string }) {
  return <Badge className={METHOD_STYLES[method] ?? 'bg-gray-100 text-gray-800'}>{label}</Badge>;
}
