'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { PaymentMethodBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import { Payment } from '@/types';
import { mockPayments } from '@/data/mock/payments';
import { formatDate } from '@/lib/utils';
import { CreditCard, TrendingUp, Clock } from 'lucide-react';

type Period = 'today' | 'week' | 'month';

export default function PaymentsPage() {
  const router = useRouter();
  const { isOnboarded } = useAppStore();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('today');
  const payments = mockPayments;

  useEffect(() => {
    if (!isOnboarded) router.replace('/');
  }, [isOnboarded, router]);

  const filterByPeriod = (p: Payment): boolean => {
    const date = new Date(p.recordedAt);
    const now = new Date();
    if (period === 'today') {
      return date.toDateString() === now.toDateString();
    }
    if (period === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 86400000);
      return date >= weekAgo;
    }
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
    return date >= monthAgo;
  };

  const filtered = payments.filter(filterByPeriod);
  const totalRevenue = filtered.reduce((sum, p) => sum + p.amount, 0);

  // Breakdown by method
  const byMethod = filtered.reduce<Record<string, number>>((acc, p) => {
    acc[p.method] = (acc[p.method] ?? 0) + p.amount;
    return acc;
  }, {});

  if (!isOnboarded) return null;

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <h1 className="text-xl font-bold text-gray-900">{t('payments.title')}</h1>

        {/* Period Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
          {(['today', 'week', 'month'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                period === p ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t(`payments.${p}`)}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-green-50 rounded-lg">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
            <CurrencyDisplay amountCents={totalRevenue} className="text-lg font-bold text-gray-900" />
            <p className="text-xs text-gray-500 mt-0.5">{t('payments.totalRevenue')}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-blue-50 rounded-lg">
                <CreditCard className="h-4 w-4 text-blue-600" />
              </div>
            </div>
            <span className="text-lg font-bold text-gray-900">{filtered.length}</span>
            <p className="text-xs text-gray-500 mt-0.5">Transactions</p>
          </div>
        </div>

        {/* Method Breakdown */}
        {Object.keys(byMethod).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">By Payment Method</h2>
            <div className="space-y-2">
              {Object.entries(byMethod).map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between">
                  <PaymentMethodBadge method={method} label={t(`payments.methods.${method}`)} />
                  <CurrencyDisplay amountCents={amount} className="text-sm font-semibold text-gray-900" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transactions List */}
        <div>
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Transactions</h2>
          {filtered.length === 0 ? (
            <EmptyState
              icon={CreditCard}
              title={t('payments.noPayments')}
            />
          ) : (
            <div className="space-y-2">
              {[...filtered].reverse().map((payment) => (
                <div key={payment.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{payment.orderNumber}</span>
                        <PaymentMethodBadge method={payment.method} label={t(`payments.methods.${payment.method}`)} />
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{payment.customerName}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatDate(payment.recordedAt)}
                        {payment.reference && ` · Ref: ${payment.reference}`}
                      </p>
                    </div>
                    <CurrencyDisplay amountCents={payment.amount} className="text-base font-bold text-gray-900 flex-shrink-0" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
