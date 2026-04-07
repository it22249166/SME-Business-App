'use client';

import { useAppStore } from '@/lib/store';
import { formatCurrency } from '@/lib/currency';

interface Props {
  amountCents: number;
  className?: string;
}

export function CurrencyDisplay({ amountCents, className }: Props) {
  const locale = useAppStore((s) => s.locale);
  return <span className={className}>{formatCurrency(amountCents, locale)}</span>;
}
