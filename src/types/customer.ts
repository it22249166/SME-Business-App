export type CustomerTag = 'vip' | 'regular' | 'new' | 'inactive' | 'wholesale';

export interface FollowUpReminder {
  id: string;
  customerId: string;
  dueDate: string;
  note: string;
  completed: boolean;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string;
  district: string;
  tags: CustomerTag[];
  totalSpend: number;
  totalOrders: number;
  lastOrderDate: string | null;
  followUpReminders: FollowUpReminder[];
  whatsappOptIn: boolean;
  smsOptIn: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}
