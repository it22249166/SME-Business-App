'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, MessageCircle, Bell } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { AddCustomerDialog } from '@/components/customers/AddCustomerDialog';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { EmptyState } from '@/components/shared/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import { useFollowUpReminders } from '@/hooks/useFollowUpReminders';
import { Customer, CustomerTag } from '@/types';
import { mockCustomers } from '@/data/mock/customers';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { formatRelativeDate } from '@/lib/utils';
import { Users } from 'lucide-react';

const TAG_COLORS: Record<CustomerTag, string> = {
  vip: 'bg-yellow-100 text-yellow-800',
  regular: 'bg-blue-100 text-blue-800',
  new: 'bg-green-100 text-green-800',
  inactive: 'bg-gray-100 text-gray-600',
  wholesale: 'bg-purple-100 text-purple-800',
};

export default function CustomersPage() {
  const router = useRouter();
  const { isOnboarded, businessType } = useAppStore();
  const { t } = useTranslation();
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const reminders = useFollowUpReminders(customers);

  useEffect(() => {
    if (!isOnboarded) router.replace('/');
  }, [isOnboarded, router]);

  const filtered = customers.filter((c) =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  if (!isOnboarded) return null;

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{t('customers.title')}</h1>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('customers.addCustomer')}</span>
          </button>
        </div>

        {/* Reminders banner */}
        {reminders.length > 0 && (
          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <Bell className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              {reminders.length} follow-up{reminders.length !== 1 ? 's' : ''} pending today
            </p>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('common.search')}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Customer List */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={t('customers.noCustomers')}
            action={
              <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                {t('customers.addCustomer')}
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((customer) => {
              const hasReminder = customer.followUpReminders.some((r) => !r.completed);
              const waLink = buildWhatsAppLink(customer.phone, `Hello ${customer.name}!`);
              return (
                <div key={customer.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-base font-semibold text-gray-600">
                      {customer.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{customer.name}</span>
                        {customer.tags.map((tag) => (
                          <span key={tag} className={`text-xs px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[tag]}`}>
                            {t(`customers.tags_.${tag}`)}
                          </span>
                        ))}
                        {hasReminder && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700">
                            <Bell className="h-3 w-3 inline mr-0.5" />
                            {t('customers.followUp')}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{customer.phone}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{customer.district}</span>
                        {customer.lastOrderDate && (
                          <span className="text-xs text-gray-500">
                            Last: {formatRelativeDate(customer.lastOrderDate)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 flex flex-col items-end gap-2">
                      <CurrencyDisplay amountCents={customer.totalSpend} className="text-sm font-semibold text-gray-900" />
                      <p className="text-xs text-gray-500">{customer.totalOrders} orders</p>
                      {customer.whatsappOptIn && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600"
                        >
                          <MessageCircle className="h-3 w-3" />
                          WA
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showAdd && (
        <AddCustomerDialog
          onCreate={(c) => setCustomers((prev) => [c, ...prev])}
          onClose={() => setShowAdd(false)}
        />
      )}
    </AppShell>
  );
}
