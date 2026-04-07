import { useMemo } from 'react';
import { InventoryItem, StockAlert } from '@/types';
import { daysUntil } from '@/lib/utils';

export function useStockAlerts(items: InventoryItem[]): StockAlert[] {
  return useMemo(() => {
    return items
      .filter((item) => item.stockQuantity <= item.lowStockThreshold)
      .map((item) => ({
        item,
        status: item.stockQuantity === 0 ? 'out_of_stock' : 'low_stock',
        daysUntilExpiry: item.expiryDate ? daysUntil(item.expiryDate) : null,
      } as StockAlert))
      .sort((a, b) => a.item.stockQuantity - b.item.stockQuantity);
  }, [items]);
}
