'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { NewOrderDialog } from '@/components/orders/NewOrderDialog';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { EmptyState } from '@/components/shared/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import { Order, OrderStatus } from '@/types';
import { mockOrders } from '@/data/mock/orders';
import { mockInventory } from '@/data/mock/inventory';
import { mockCustomers } from '@/data/mock/customers';
import { formatDate, generateId } from '@/lib/utils';
import { ShoppingCart } from 'lucide-react';

const STATUS_FILTERS: Array<'all' | OrderStatus> = ['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'];

export default function OrdersPage() {
  const router = useRouter();
  const { isOnboarded, businessType } = useAppStore();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>(mockOrders.filter((o) => o.businessType === businessType));
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');

  useEffect(() => {
    if (!isOnboarded) router.replace('/');
  }, [isOnboarded, router]);

  const inventory = mockInventory.filter((i) => i.businessType === businessType);

  const filtered = orders.filter((o) => {
    const matchSearch = !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleCreate = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newOrder: Order = {
      ...orderData,
      id: generateId(),
      orderNumber: `ORD-${String(orders.length + 1).padStart(4, '0')}`,
      createdAt: now,
      updatedAt: now,
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  if (!isOnboarded) return null;

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{t('orders.title')}</h1>
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('orders.newOrder')}</span>
          </button>
        </div>

        {/* Search + Filter */}
        <div className="space-y-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('common.search')}
              className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  statusFilter === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {s === 'all' ? t('common.all') : t(`orders.statuses.${s}`)}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title={t('orders.noOrders')}
            action={
              <button onClick={() => setShowNew(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                {t('orders.newOrder')}
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{order.orderNumber}</span>
                      <OrderStatusBadge status={order.status} label={t(`orders.statuses.${order.status}`)} />
                      <PaymentStatusBadge status={order.paymentStatus} label={t(`orders.paymentStatuses.${order.paymentStatus}`)} />
                    </div>
                    <p className="text-sm text-gray-700 mt-1 font-medium">{order.customerName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {formatDate(order.createdAt)}
                    </p>
                    {order.notes && <p className="text-xs text-gray-500 mt-1 italic">"{order.notes}"</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <CurrencyDisplay amountCents={order.total} className="text-base font-bold text-gray-900" />
                    <p className="text-xs text-gray-500 mt-0.5">{t(`payments.methods.${order.paymentMethod}`)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showNew && (
        <NewOrderDialog
          inventory={inventory}
          customers={mockCustomers}
          businessType={businessType}
          onCreate={handleCreate}
          onClose={() => setShowNew(false)}
        />
      )}
    </AppShell>
  );
}
