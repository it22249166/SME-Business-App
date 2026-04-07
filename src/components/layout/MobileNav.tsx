'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Package, Users,
  Megaphone, CreditCard
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { getBusinessConfig } from '@/lib/businessConfig';
import { useTranslation } from '@/hooks/useTranslation';
import { ModuleKey } from '@/types';
import { cn } from '@/lib/utils';

const MODULE_ICONS: Record<ModuleKey, React.ElementType> = {
  dashboard: LayoutDashboard,
  orders: ShoppingCart,
  inventory: Package,
  customers: Users,
  promotions: Megaphone,
  payments: CreditCard,
};

export function MobileNav() {
  const pathname = usePathname();
  const businessType = useAppStore((s) => s.businessType);
  const config = getBusinessConfig(businessType);
  const { t } = useTranslation();

  // Show max 5 modules on mobile
  const mobileModules = config.modules.slice(0, 5);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 md:hidden">
      <div className="flex">
        {mobileModules.map((module) => {
          const Icon = MODULE_ICONS[module];
          const href = `/${module === 'dashboard' ? '' : module}`;
          const isActive = module === 'dashboard' ? pathname === '/' : pathname.startsWith(`/${module}`);

          return (
            <Link
              key={module}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center py-2 text-xs gap-1 transition-colors',
                isActive ? 'text-gray-900' : 'text-gray-500'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-gray-900' : 'text-gray-400')} />
              <span className="truncate">{t(`nav.${module}`)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
