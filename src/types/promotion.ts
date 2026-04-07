export type PromotionType =
  | 'percentage_discount'
  | 'fixed_discount'
  | 'buy_x_get_y'
  | 'announcement'
  | 'seasonal';

export type PromotionChannel = 'whatsapp' | 'sms' | 'both';

export interface Promotion {
  id: string;
  title: string;
  message: string;
  messageSi: string;
  messageTa: string;
  type: PromotionType;
  discountValue: number | null;
  channel: PromotionChannel;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  sentCount: number;
  createdAt: string;
}
