import { BusinessType } from './business';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  unitPrice: number;
  costPrice: number;
  stockQuantity: number;
  lowStockThreshold: number;
  unit: string;
  barcode: string | null;
  expiryDate: string | null;
  isActive: boolean;
  businessType: BusinessType;
  createdAt: string;
  updatedAt: string;
}

export interface StockAlert {
  item: InventoryItem;
  status: 'low_stock' | 'out_of_stock';
  daysUntilExpiry: number | null;
}

export function getStockStatus(item: InventoryItem): StockStatus {
  if (item.stockQuantity === 0) return 'out_of_stock';
  if (item.stockQuantity <= item.lowStockThreshold) return 'low_stock';
  return 'in_stock';
}
