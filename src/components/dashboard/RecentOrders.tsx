'use client';

import Link from 'next/link';
import { Order } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/shared/StatusBadge';
import { formatRelativeDate } from '@/lib/utils';

interface Props {
  orders: Order[];
}

export function RecentOrders({ orders }: Props) {
  const { t } = useTranslation();
  const recent = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">{t('dashboard.recentOrders')}</h2>
        <Link href="/orders" className="text-xs text-blue-600 hover:underline">
          {t('dashboard.viewAll')}
        </Link>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">{t('common.noData')}</p>
      ) : (
        <div className="space-y-3">
          {recent.map((order) => (
            <div key={order.id} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{order.orderNumber}</span>
                  <OrderStatusBadge
                    status={order.status}
                    label={t(`orders.statuses.${order.status}`)}
                  />
                </div>
                <p className="text-xs text-gray-500 truncate">
                  {order.customerName} · {formatRelativeDate(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <CurrencyDisplay amountCents={order.total} className="text-sm font-semibold text-gray-900" />
                <PaymentStatusBadge
                  status={order.paymentStatus}
                  label={t(`orders.paymentStatuses.${order.paymentStatus}`)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
