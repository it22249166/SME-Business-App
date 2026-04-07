import { Payment } from '@/types';

const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
const d = (offset: number) => new Date(today.getTime() + offset * 86400000).toISOString();

export const mockPayments: Payment[] = [
  { id: 'pay1', orderId: 'ord1', orderNumber: 'ORD-0001', customerName: 'Nimal Perera', amount: 202000, method: 'cash', reference: null, recordedAt: d(0), notes: '' },
  { id: 'pay2', orderId: 'ord2', orderNumber: 'ORD-0002', customerName: 'Mohamed Farhan', amount: 315000, method: 'bank_transfer', reference: 'TXN-887441', recordedAt: d(0), notes: 'Partial payment' },
  { id: 'pay3', orderId: 'ord3', orderNumber: 'ORD-0003', customerName: 'Walk-in', amount: 16500, method: 'cash', reference: null, recordedAt: d(-1), notes: '' },
  { id: 'pay4', orderId: 'ord5', orderNumber: 'ORD-0005', customerName: 'Priya Krishnaswamy', amount: 66000, method: 'ez_cash', reference: '0754445555', recordedAt: d(-3), notes: '' },
  { id: 'pay5', orderId: 'ord6', orderNumber: 'ORD-0006', customerName: 'Walk-in', amount: 135000, method: 'cash', reference: null, recordedAt: d(0), notes: '' },
  { id: 'pay6', orderId: 'ord7', orderNumber: 'ORD-0007', customerName: 'Walk-in', amount: 45000, method: 'card', reference: '****4523', recordedAt: d(-1), notes: '' },
  { id: 'pay7', orderId: 'ord8', orderNumber: 'ORD-0008', customerName: 'Suresh Gunawardena', amount: 250000, method: 'mcash', reference: '0723334444', recordedAt: d(-2), notes: '' },
];
