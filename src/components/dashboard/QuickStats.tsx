'use client';

import { TrendingUp, ShoppingCart, AlertTriangle, Clock } from 'lucide-react';
import { Order, InventoryItem, Payment } from '@/types';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { useTranslation } from '@/hooks/useTranslation';
import { getStockStatus } from '@/types/inventory';

interface Props {
  orders: Order[];
  inventory: InventoryItem[];
  payments: Payment[];
}

export function QuickStats({ orders, inventory, payments }: Props) {
  const { t } = useTranslation();

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(today));
  const todayRevenue = payments
    .filter((p) => p.recordedAt.startsWith(today))
    .reduce((sum, p) => sum + p.amount, 0);
  const lowStockCount = inventory.filter((i) => getStockStatus(i) !== 'in_stock').length;
  const pendingAmount = orders
    .filter((o) => o.paymentStatus !== 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: t('dashboard.todayRevenue'),
      value: <CurrencyDisplay amountCents={todayRevenue} className="text-2xl font-bold text-gray-900" />,
      icon: TrendingUp,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: t('dashboard.totalOrders'),
      value: <span className="text-2xl font-bold text-gray-900">{todayOrders.length}</span>,
      icon: ShoppingCart,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: t('dashboard.lowStockItems'),
      value: <span className="text-2xl font-bold text-gray-900">{lowStockCount}</span>,
      icon: AlertTriangle,
      color: lowStockCount > 0 ? 'bg-yellow-50 text-yellow-600' : 'bg-gray-50 text-gray-400',
    },
    {
      label: t('dashboard.pendingPayments'),
      value: <CurrencyDisplay amountCents={pendingAmount} className="text-2xl font-bold text-gray-900" />,
      icon: Clock,
      color: pendingAmount > 0 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-400',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="h-4 w-4" />
            </div>
          </div>
          {stat.value}
          <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
