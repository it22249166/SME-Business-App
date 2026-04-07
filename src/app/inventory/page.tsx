'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { AddProductDialog } from '@/components/inventory/AddProductDialog';
import { StockStatusBadge } from '@/components/shared/StatusBadge';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { EmptyState } from '@/components/shared/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import { useStockAlerts } from '@/hooks/useStockAlerts';
import { InventoryItem } from '@/types';
import { getStockStatus } from '@/types/inventory';
import { mockInventory } from '@/data/mock/inventory';
import { formatDate, daysUntil } from '@/lib/utils';
import { Package } from 'lucide-react';

export default function InventoryPage() {
  const router = useRouter();
  const { isOnboarded, businessType } = useAppStore();
  const { t } = useTranslation();
  const [items, setItems] = useState<InventoryItem[]>(
    mockInventory.filter((i) => i.businessType === businessType)
  );
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const stockAlerts = useStockAlerts(items);

  useEffect(() => {
    if (!isOnboarded) router.replace('/');
  }, [isOnboarded, router]);

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = items.filter((i) => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || i.category === category;
    return matchSearch && matchCat && i.isActive;
  });

  if (!isOnboarded) return null;

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{t('inventory.title')}</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('inventory.addProduct')}</span>
          </button>
        </div>

        {/* Low Stock Alert Banner */}
        {stockAlerts.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              {t('inventory.lowStockAlert', { count: stockAlerts.length })}
            </p>
          </div>
        )}

        {/* Search + Category filter */}
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
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  category === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat === 'all' ? t('inventory.allCategories') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Grid */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title={t('inventory.noItems')}
            action={
              <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                {t('inventory.addProduct')}
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((item) => {
              const status = getStockStatus(item);
              const expiry = item.expiryDate ? daysUntil(item.expiryDate) : null;
              return (
                <div key={item.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                        <StockStatusBadge
                          status={status}
                          label={t(`inventory.${status}`)}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {item.sku} · {item.category}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-600">
                          Stock: <strong>{item.stockQuantity} {item.unit}</strong>
                        </span>
                        {businessType === 'pharmacy' && expiry !== null && (
                          <span className={`text-xs font-medium ${expiry <= 30 ? 'text-red-600' : expiry <= 90 ? 'text-yellow-600' : 'text-gray-500'}`}>
                            {expiry > 0 ? t('inventory.expiryWarning', { days: expiry }) : 'EXPIRED'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <CurrencyDisplay amountCents={item.unitPrice} className="text-sm font-bold text-gray-900" />
                      <p className="text-xs text-gray-500 mt-0.5">
                        Cost: <CurrencyDisplay amountCents={item.costPrice} className="text-xs" />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <AddProductDialog
          businessType={businessType}
          categories={categories.filter((c) => c !== 'all')}
          onCreate={(item) => setItems((prev) => [item, ...prev])}
          onClose={() => setShowAdd(false)}
        />
      )}
    </AppShell>
  );
}
