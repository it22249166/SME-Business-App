'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, ShoppingCart, Package, Users,
  Megaphone, CreditCard, Settings, X
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

interface Props {
  onClose?: () => void;
}

export function Sidebar({ onClose }: Props) {
  const pathname = usePathname();
  const businessType = useAppStore((s) => s.businessType);
  const businessName = useAppStore((s) => s.businessName);
  const config = getBusinessConfig(businessType);
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64">
      {/* Header */}
      <div className={`bg-gradient-to-r ${config.gradient} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <p className="font-bold text-sm leading-tight">{businessName || t('app.name')}</p>
                <p className="text-xs opacity-80">{t(`businessTypes.${businessType}`)}</p>
              </div>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-1 rounded hover:bg-white/20">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {config.modules.map((module) => {
          const Icon = MODULE_ICONS[module];
          const href = `/${module === 'dashboard' ? '' : module}`;
          const isActive = module === 'dashboard' ? pathname === '/' : pathname.startsWith(`/${module}`);

          return (
            <Link
              key={module}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon className={cn('h-5 w-5', isActive ? 'text-gray-700' : 'text-gray-400')} />
              {t(`nav.${module}`)}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <Settings className="h-5 w-5 text-gray-400" />
          {t('nav.settings')}
        </Link>
      </div>
    </div>
  );
}
