'use client';

import { useState } from 'react';
import { X, Package } from 'lucide-react';
import { InventoryItem, BusinessType } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { generateId } from '@/lib/utils';

interface Props {
  businessType: BusinessType;
  categories: string[];
  onCreate: (item: InventoryItem) => void;
  onClose: () => void;
}

export function AddProductDialog({ businessType, categories, onCreate, onClose }: Props) {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: categories[0] ?? 'General',
    unitPrice: '',
    costPrice: '',
    stockQuantity: '',
    lowStockThreshold: '10',
    unit: 'pcs',
    expiryDate: '',
    description: '',
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleCreate = () => {
    if (!form.name.trim()) return;
    const now = new Date().toISOString();
    onCreate({
      id: generateId(),
      sku: form.sku || `${businessType.toUpperCase().slice(0, 3)}-${Date.now()}`,
      name: form.name,
      description: form.description,
      category: form.category,
      unitPrice: Math.round(parseFloat(form.unitPrice || '0') * 100),
      costPrice: Math.round(parseFloat(form.costPrice || '0') * 100),
      stockQuantity: parseInt(form.stockQuantity || '0'),
      lowStockThreshold: parseInt(form.lowStockThreshold || '10'),
      unit: form.unit,
      barcode: null,
      expiryDate: form.expiryDate || null,
      isActive: true,
      businessType,
      createdAt: now,
      updatedAt: now,
    });
    onClose();
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
  const labelCls = 'text-sm font-medium text-gray-700 block mb-1';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white w-full sm:w-[500px] max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <Package className="h-5 w-5" />
            {t('inventory.addProduct')}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>{t('inventory.name')} *</label>
              <input value={form.name} onChange={set('name')} className={inputCls} placeholder="Product name" />
            </div>
            <div>
              <label className={labelCls}>{t('inventory.sku')}</label>
              <input value={form.sku} onChange={set('sku')} className={inputCls} placeholder="Auto" />
            </div>
            <div>
              <label className={labelCls}>{t('inventory.category')}</label>
              <input value={form.category} onChange={set('category')} className={inputCls} list="categories" />
              <datalist id="categories">
                {categories.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>
            <div>
              <label className={labelCls}>{t('inventory.sellingPrice')} (LKR)</label>
              <input value={form.unitPrice} onChange={set('unitPrice')} className={inputCls} inputMode="decimal" placeholder="0.00" />
            </div>
            <div>
              <label className={labelCls}>{t('inventory.costPrice')} (LKR)</label>
              <input value={form.costPrice} onChange={set('costPrice')} className={inputCls} inputMode="decimal" placeholder="0.00" />
            </div>
            <div>
              <label className={labelCls}>{t('inventory.stock')}</label>
              <input value={form.stockQuantity} onChange={set('stockQuantity')} className={inputCls} inputMode="numeric" placeholder="0" />
            </div>
            <div>
              <label className={labelCls}>{t('inventory.threshold')}</label>
              <input value={form.lowStockThreshold} onChange={set('lowStockThreshold')} className={inputCls} inputMode="numeric" placeholder="10" />
            </div>
            <div>
              <label className={labelCls}>{t('inventory.unit')}</label>
              <select value={form.unit} onChange={set('unit')} className={inputCls}>
                {['pcs', 'kg', 'g', 'litre', 'ml', 'box', 'pkt', 'btl', 'scht', 'tab', 'cap', 'svc', 'cup'].map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            {businessType === 'pharmacy' && (
              <div>
                <label className={labelCls}>{t('inventory.expiry')}</label>
                <input value={form.expiryDate} onChange={set('expiryDate')} className={inputCls} type="date" />
              </div>
            )}
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
