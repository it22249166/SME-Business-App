'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { StockAlert } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';

interface Props {
  alerts: StockAlert[];
}

export function StockAlertWidget({ alerts }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">{t('dashboard.stockAlerts')}</h2>
        <Link href="/inventory" className="text-xs text-blue-600 hover:underline">
          {t('dashboard.viewAll')}
        </Link>
      </div>

      {alerts.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">{t('dashboard.noAlerts')}</p>
      ) : (
        <div className="space-y-2">
          {alerts.slice(0, 5).map(({ item, status }) => (
            <div key={item.id} className="flex items-center gap-3">
              <AlertTriangle
                className={`h-4 w-4 flex-shrink-0 ${
                  status === 'out_of_stock' ? 'text-red-500' : 'text-yellow-500'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-xs text-gray-500">
                  {item.stockQuantity} {item.unit} remaining
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  status === 'out_of_stock'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {status === 'out_of_stock' ? t('inventory.outOfStock') : t('inventory.lowStock')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
