import { Locale } from '@/types';

const CURRENCY_SYMBOLS: Record<Locale, string> = {
  en: 'LKR',
  si: 'රු.',
  ta: 'ரூ.',
};

export function formatCurrency(amountCents: number, locale: Locale = 'en'): string {
  const amount = amountCents / 100;
  const symbol = CURRENCY_SYMBOLS[locale];
  const formatted = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${symbol} ${formatted}`;
}

export function parseCurrencyInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, '');
  return Math.round(parseFloat(cleaned || '0') * 100);
}

export function centsToDisplay(cents: number): string {
  return (cents / 100).toFixed(2);
}
