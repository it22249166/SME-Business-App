'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Payment } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/currency';

interface Props {
  payments: Payment[];
}

export function RevenueChart({ payments }: Props) {
  const { t } = useTranslation();
  const locale = useAppStore((s) => s.locale);

  // Build last 7 days data
  const data = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const dayPayments = payments.filter((p) => p.recordedAt.startsWith(dateStr));
    const revenue = dayPayments.reduce((sum, p) => sum + p.amount, 0);
    return {
      day: date.toLocaleDateString('en-LK', { weekday: 'short' }),
      revenue: revenue / 100,
    };
  });

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">Revenue - Last 7 Days</h2>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="day" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value: number) => [formatCurrency(value * 100, locale), 'Revenue']}
            contentStyle={{ fontSize: 12 }}
          />
          <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
