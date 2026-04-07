'use client';

import { useState } from 'react';
import { Plus, Minus, X, ShoppingCart } from 'lucide-react';
import { Order, OrderItem, InventoryItem, Customer, PaymentMethod } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { generateId, centsToDisplay } from '@/lib/utils';

interface Props {
  inventory: InventoryItem[];
  customers: Customer[];
  businessType: Order['businessType'];
  onCreate: (order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => void;
  onClose: () => void;
}

const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'card', 'bank_transfer', 'ez_cash', 'mcash', 'credit'];

export function NewOrderDialog({ inventory, customers, businessType, onCreate, onClose }: Props) {
  const { t } = useTranslation();
  const [customerId, setCustomerId] = useState<string>('');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');

  const selectedCustomer = customers.find((c) => c.id === customerId);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity - i.discount, 0);

  const addItem = () => {
    const product = inventory.find((p) => p.id === selectedProductId);
    if (!product) return;
    const existing = items.find((i) => i.productId === product.id);
    if (existing) {
      setItems((prev) =>
        prev.map((i) => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i)
      );
    } else {
      setItems((prev) => [
        ...prev,
        { id: generateId(), productId: product.id, productName: product.name, quantity: 1, unitPrice: product.unitPrice, discount: 0 },
      ]);
    }
    setSelectedProductId('');
  };

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
        .filter((i) => i.quantity > 0)
    );
  };

  const handleCreate = () => {
    if (items.length === 0) return;
    const customerName = selectedCustomer?.name ?? guestName || 'Walk-in';
    const customerPhone = selectedCustomer?.phone ?? guestPhone;
    onCreate({
      customerId: customerId || null,
      customerName,
      customerPhone,
      items,
      subtotal,
      discountTotal: 0,
      total: subtotal,
      status: 'pending',
      paymentStatus: 'unpaid',
      paymentMethod,
      notes,
      businessType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div className="bg-white w-full sm:w-[540px] max-h-[90vh] rounded-t-2xl sm:rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {t('orders.newOrder')}
          </h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Customer */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              {t('orders.selectCustomer')}
            </label>
            <select
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('orders.guestCustomer')}</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>
              ))}
            </select>
            {!customerId && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  placeholder="Guest name"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  placeholder="+94XXXXXXXXX"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  inputMode="tel"
                />
              </div>
            )}
          </div>

          {/* Add Item */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              {t('orders.addItem')}
            </label>
            <div className="flex gap-2">
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t('orders.selectItem')}</option>
                {inventory.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} - LKR {centsToDisplay(p.unitPrice)}
                  </option>
                ))}
              </select>
              <button
                onClick={addItem}
                disabled={!selectedProductId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Items List */}
          {items.length > 0 && (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                    <p className="text-xs text-gray-500">
                      LKR {centsToDisplay(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="p-1 rounded-full border border-gray-300 hover:bg-gray-100"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                      LKR {centsToDisplay(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t">
                <span className="text-sm font-semibold text-gray-900">{t('orders.grandTotal')}</span>
                <CurrencyDisplay amountCents={subtotal} className="text-sm font-bold text-gray-900" />
              </div>
            </div>
          )}

          {/* Payment Method */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              {t('orders.paymentMethod')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border transition-colors ${
                    paymentMethod === method
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {t(`payments.methods.${method}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              {t('orders.notes')}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleCreate}
            disabled={items.length === 0}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-blue-700"
          >
            {t('orders.createOrder')}
          </button>
        </div>
      </div>
    </div>
  );
}
