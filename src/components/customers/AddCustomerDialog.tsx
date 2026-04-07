'use client';

import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Customer, CustomerTag } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { SL_DISTRICTS, generateId } from '@/lib/utils';

interface Props {
  onCreate: (customer: Customer) => void;
  onClose: () => void;
}

const ALL_TAGS: CustomerTag[] = ['vip', 'regular', 'new', 'wholesale', 'inactive'];

export function AddCustomerDialog({ onCreate, onClose }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    phone: '+94',
    email: '',
    address: '',
    district: 'Colombo',
    notes: '',
    whatsappOptIn: true,
    smsOptIn: false,
  });
  const [selectedTags, setSelectedTags] = useState<CustomerTag[]>(['new']);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const toggle = (key: 'whatsappOptIn' | 'smsOptIn') =>
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleTag = (tag: CustomerTag) =>
    setSelectedTags((prev) => prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]);

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const now = new Date().toISOString();
    onCreate({
      id: generateId(),
      name: form.name,
      phone: form.phone,
      email: form.email || null,
      address: form.address,
      district: form.district,
      tags: selectedTags,
      totalSpend: 0,
      totalOrders: 0,
      lastOrderDate: null,
      followUpReminders: [],
      whatsappOptIn: form.whatsappOptIn,
      smsOptIn: form.smsOptIn,
      notes: form.notes,
      createdAt: now,
      updatedAt: now,
    });
    onClose();
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelCls = 'text-sm font-medium text-gray-700 block mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white w-full sm:w-[460px] max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t('customers.addCustomer')}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div>
            <label className={labelCls}>{t('customers.name')} *</label>
            <input value={form.name} onChange={set('name')} className={inputCls} placeholder="Customer name" />
          </div>
          <div>
            <label className={labelCls}>{t('customers.phone')}</label>
            <input value={form.phone} onChange={set('phone')} className={inputCls} inputMode="tel" placeholder="+94XXXXXXXXX" />
          </div>
          <div>
            <label className={labelCls}>{t('customers.email')}</label>
            <input value={form.email} onChange={set('email')} className={inputCls} type="email" placeholder="optional" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('customers.district')}</label>
              <select value={form.district} onChange={set('district')} className={inputCls}>
                {SL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t('customers.address')}</label>
              <input value={form.address} onChange={set('address')} className={inputCls} placeholder="Street address" />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelCls}>{t('customers.tags')}</label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {t(`customers.tags_.${tag}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Opt-ins */}
          <div className="space-y-2">
            {(['whatsappOptIn', 'smsOptIn'] as const).map((key) => (
              <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                <span className="text-sm text-gray-700">{t(`customers.${key}`)}</span>
                <div
                  onClick={() => toggle(key)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form[key] ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </div>
              </label>
            ))}
          </div>

          <div>
            <label className={labelCls}>{t('common.notes')}</label>
            <textarea value={form.notes} onChange={set('notes')} rows={2} className={`${inputCls} resize-none`} />
          </div>
        </div>

        <div className="p-4 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleCreate}
            disabled={!form.name.trim()}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
