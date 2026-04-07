import { useMemo } from 'react';
import { Customer, FollowUpReminder } from '@/types';

export interface ReminderWithCustomer {
  reminder: FollowUpReminder;
  customer: Customer;
  isOverdue: boolean;
}

export function useFollowUpReminders(customers: Customer[]): ReminderWithCustomer[] {
  return useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const results: ReminderWithCustomer[] = [];

    for (const customer of customers) {
      for (const reminder of customer.followUpReminders) {
        if (!reminder.completed && reminder.dueDate <= today) {
          results.push({
            reminder,
            customer,
            isOverdue: reminder.dueDate < today,
          });
        }
      }
    }

    return results.sort((a, b) => a.reminder.dueDate.localeCompare(b.reminder.dueDate));
  }, [customers]);
}
