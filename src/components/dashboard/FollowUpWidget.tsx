'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { ReminderWithCustomer } from '@/hooks/useFollowUpReminders';
import { useTranslation } from '@/hooks/useTranslation';

interface Props {
  reminders: ReminderWithCustomer[];
}

export function FollowUpWidget({ reminders }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-900">{t('dashboard.followUps')}</h2>
        <Link href="/customers" className="text-xs text-blue-600 hover:underline">
          {t('dashboard.viewAll')}
        </Link>
      </div>

      {reminders.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">{t('dashboard.noFollowUps')}</p>
      ) : (
        <div className="space-y-2">
          {reminders.slice(0, 4).map(({ reminder, customer, isOverdue }) => (
            <div key={reminder.id} className="flex items-start gap-3">
              <div className={`mt-0.5 p-1.5 rounded-full ${isOverdue ? 'bg-red-100' : 'bg-yellow-100'}`}>
                <Bell className={`h-3 w-3 ${isOverdue ? 'text-red-600' : 'text-yellow-600'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                <p className="text-xs text-gray-500 truncate">{reminder.note}</p>
              </div>
              <span className={`text-xs font-medium ${isOverdue ? 'text-red-600' : 'text-yellow-600'}`}>
                {isOverdue ? t('customers.overdue') : t('customers.dueToday')}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
