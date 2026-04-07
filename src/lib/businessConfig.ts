import { BusinessConfig, BusinessType } from '@/types';

export const BUSINESS_CONFIG: Record<BusinessType, BusinessConfig> = {
  shop: {
    type: 'shop',
    label: 'Shop',
    icon: '🏪',
    primaryColor: '#2563eb',
    accentClass: 'blue',
    modules: ['dashboard', 'orders', 'inventory', 'customers', 'promotions', 'payments'],
    inventoryLabel: 'Products',
    orderLabel: 'Orders',
    customerLabel: 'Customers',
    gradient: 'from-blue-500 to-blue-700',
  },
  salon: {
    type: 'salon',
    label: 'Salon',
    icon: '💇',
    primaryColor: '#db2777',
    accentClass: 'pink',
    modules: ['dashboard', 'orders', 'customers', 'promotions', 'payments'],
    inventoryLabel: 'Services',
    orderLabel: 'Appointments',
    customerLabel: 'Clients',
    gradient: 'from-pink-500 to-pink-700',
  },
  pharmacy: {
    type: 'pharmacy',
    label: 'Pharmacy',
    icon: '💊',
    primaryColor: '#16a34a',
    accentClass: 'green',
    modules: ['dashboard', 'orders', 'inventory', 'customers', 'payments'],
    inventoryLabel: 'Medicines',
    orderLabel: 'Prescriptions',
    customerLabel: 'Patients',
    gradient: 'from-green-500 to-green-700',
  },
  boutique: {
    type: 'boutique',
    label: 'Boutique',
    icon: '👗',
    primaryColor: '#7c3aed',
    accentClass: 'purple',
    modules: ['dashboard', 'orders', 'inventory', 'customers', 'promotions', 'payments'],
    inventoryLabel: 'Items',
    orderLabel: 'Orders',
    customerLabel: 'Customers',
    gradient: 'from-purple-500 to-purple-700',
  },
  cafe: {
    type: 'cafe',
    label: 'Café',
    icon: '☕',
    primaryColor: '#d97706',
    accentClass: 'amber',
    modules: ['dashboard', 'orders', 'inventory', 'payments'],
    inventoryLabel: 'Menu Items',
    orderLabel: 'Orders',
    customerLabel: 'Customers',
    gradient: 'from-amber-500 to-amber-700',
  },
};

export function getBusinessConfig(type: BusinessType): BusinessConfig {
  return BUSINESS_CONFIG[type];
}
