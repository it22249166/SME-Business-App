'use client';

import { useState } from 'react';
import { X, Megaphone } from 'lucide-react';
import { Promotion, PromotionType, PromotionChannel } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { generateId } from '@/lib/utils';

interface Props {
  onCreate: (promo: Promotion) => void;
  onClose: () => void;
}

const PROMO_TYPES: PromotionType[] = ['percentage_discount', 'fixed_discount', 'buy_x_get_y', 'announcement', 'seasonal'];

export function CreatePromotionDialog({ onCreate, onClose }: Props) {
  const { t } = useTranslation();
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    title: '',
    message: '',
    messageSi: '',
    messageTa: '',
    type: 'announcement' as PromotionType,
    discountValue: '',
    channel: 'whatsapp' as PromotionChannel,
    validFrom: today,
    validUntil: '',
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleCreate = () => {
    if (!form.title.trim() || !form.message.trim()) return;
    onCreate({
      id: generateId(),
      title: form.title,
      message: form.message,
      messageSi: form.messageSi,
      messageTa: form.messageTa,
      type: form.type,
      discountValue: form.discountValue ? Math.round(parseFloat(form.discountValue) * 100) : null,
      channel: form.channel,
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      isActive: true,
      sentCount: 0,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelCls = 'text-sm font-medium text-gray-700 block mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white w-full sm:w-[520px] max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            {t('promotions.createPromotion')}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div>
            <label className={labelCls}>Title (English) *</label>
            <input value={form.title} onChange={set('title')} className={inputCls} placeholder="e.g. New Year Special - 15% Off" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('promotions.type')}</label>
              <select value={form.type} onChange={set('type')} className={inputCls}>
                {PROMO_TYPES.map((t_) => (
                  <option key={t_} value={t_}>{t(`promotions.types.${t_}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Channel</label>
              <select value={form.channel} onChange={set('channel')} className={inputCls}>
                <option value="whatsapp">WhatsApp</option>
                <option value="sms">SMS</option>
                <option value="both">Both</option>
              </select>
            </div>
          </div>

          {(form.type === 'percentage_discount' || form.type === 'fixed_discount') && (
            <div>
              <label className={labelCls}>
                {form.type === 'percentage_discount' ? 'Discount (%)' : 'Discount Amount (LKR)'}
              </label>
              <input value={form.discountValue} onChange={set('discountValue')} className={inputCls} inputMode="decimal" placeholder="0" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>{t('promotions.validFrom')}</label>
              <input value={form.validFrom} onChange={set('validFrom')} className={inputCls} type="date" />
            </div>
            <div>
              <label className={labelCls}>{t('promotions.validUntil')}</label>
              <input value={form.validUntil} onChange={set('validUntil')} className={inputCls} type="date" />
            </div>
          </div>

          <div>
            <label className={labelCls}>{t('promotions.message')} (English) *</label>
            <textarea value={form.message} onChange={set('message')} rows={3} className={`${inputCls} resize-none`}
              placeholder="Your promotional message..." />
          </div>

          <div>
            <label className={labelCls}>{t('promotions.message')} (සිංහල)</label>
            <textarea value={form.messageSi} onChange={set('messageSi')} rows={2} className={`${inputCls} resize-none`}
              placeholder="සිංහල පණිවිඩය..." />
          </div>

          <div>
            <label className={labelCls}>{t('promotions.message')} (தமிழ்)</label>
            <textarea value={form.messageTa} onChange={set('messageTa')} rows={2} className={`${inputCls} resize-none`}
              placeholder="தமிழ் செய்தி..." />
          </div>
        </div>

        <div className="p-4 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            {t('common.cancel')}
          </button>
          <button
            onClick={handleCreate}
            disabled={!form.title.trim() || !form.message.trim()}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  );
}
