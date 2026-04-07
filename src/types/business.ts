export type BusinessType = 'shop' | 'salon' | 'pharmacy' | 'boutique' | 'cafe';

export type Locale = 'en' | 'si' | 'ta';

export type ModuleKey =
  | 'dashboard'
  | 'orders'
  | 'inventory'
  | 'customers'
  | 'promotions'
  | 'payments';

export interface BusinessConfig {
  type: BusinessType;
  label: string;
  icon: string;
  primaryColor: string;
  accentClass: string;
  modules: ModuleKey[];
  inventoryLabel: string;
  orderLabel: string;
  customerLabel: string;
  gradient: string;
}
