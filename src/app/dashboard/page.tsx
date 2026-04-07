'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { StockAlertWidget } from '@/components/dashboard/StockAlertWidget';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { FollowUpWidget } from '@/components/dashboard/FollowUpWidget';
import { useTranslation } from '@/hooks/useTranslation';
import { useStockAlerts } from '@/hooks/useStockAlerts';
import { useFollowUpReminders } from '@/hooks/useFollowUpReminders';
import { getBusinessConfig } from '@/lib/businessConfig';
import { mockOrders } from '@/data/mock/orders';
import { mockInventory } from '@/data/mock/inventory';
import { mockCustomers } from '@/data/mock/customers';
import { mockPayments } from '@/data/mock/payments';

export default function DashboardPage() {
  const router = useRouter();
  const { isOnboarded, businessType } = useAppStore();
  const { t } = useTranslation();
  const config = getBusinessConfig(businessType);

  useEffect(() => {
    if (!isOnboarded) router.replace('/');
  }, [isOnboarded, router]);

  // Filter data by business type
  const inventory = mockInventory.filter((i) => i.businessType === businessType);
  const orders = mockOrders.filter((o) => o.businessType === businessType);
  const stockAlerts = useStockAlerts(inventory);
  const followUps = useFollowUpReminders(mockCustomers);

  if (!isOnboarded) return null;

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Greeting */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-sm text-gray-500">{config.icon} {t(`businessTypes.${businessType}`)}</p>
        </div>

        {/* KPI Cards */}
        <QuickStats orders={orders} inventory={inventory} payments={mockPayments} />

        {/* Revenue Chart */}
        <RevenueChart payments={mockPayments} />

        {/* Two-column for alerts + follow-ups */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {config.modules.includes('inventory') && (
            <StockAlertWidget alerts={stockAlerts} />
          )}
          {config.modules.includes('customers') && (
            <FollowUpWidget reminders={followUps} />
          )}
        </div>

        {/* Recent Orders */}
        <RecentOrders orders={orders} />
      </div>
    </AppShell>
  );
}
