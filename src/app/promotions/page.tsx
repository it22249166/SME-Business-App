'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Share2, Send } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { CreatePromotionDialog } from '@/components/promotions/CreatePromotionDialog';
import { EmptyState } from '@/components/shared/EmptyState';
import { useTranslation } from '@/hooks/useTranslation';
import { Promotion } from '@/types';
import { mockPromotions } from '@/data/mock/promotions';
import { buildWhatsAppBroadcastLink, buildSMSLink } from '@/lib/whatsapp';
import { formatDate } from '@/lib/utils';
import { Megaphone } from 'lucide-react';

export default function PromotionsPage() {
  const router = useRouter();
  const { isOnboarded } = useAppStore();
  const { t, locale } = useTranslation();
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    if (!isOnboarded) router.replace('/');
  }, [isOnboarded, router]);

  const getMessage = (promo: Promotion) => {
    if (locale === 'si' && promo.messageSi) return promo.messageSi;
    if (locale === 'ta' && promo.messageTa) return promo.messageTa;
    return promo.message;
  };

  const isExpired = (promo: Promotion) => promo.validUntil && new Date(promo.validUntil) < new Date();

  if (!isOnboarded) return null;

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">{t('promotions.title')}</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t('promotions.createPromotion')}</span>
          </button>
        </div>

        {/* Promotions List */}
        {promotions.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title={t('promotions.noPromotions')}
            action={
              <button onClick={() => setShowCreate(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">
                {t('promotions.createPromotion')}
              </button>
            }
          />
        ) : (
          <div className="space-y-3">
            {promotions.map((promo) => {
              const expired = isExpired(promo);
              const message = getMessage(promo);
              const waLink = buildWhatsAppBroadcastLink(message);
              return (
                <div key={promo.id} className="bg-white rounded-xl border border-gray-200 p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-gray-900">{promo.title}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${expired ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                          {expired ? t('promotions.expired') : t('promotions.active')}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {t(`promotions.types.${promo.type}`)}
                        {promo.validUntil && ` · Until ${formatDate(promo.validUntil)}`}
                        {promo.sentCount > 0 && ` · Sent ${promo.sentCount}x`}
                      </p>
                    </div>
                  </div>

                  {/* Message Preview */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm text-gray-700 whitespace-pre-line">{message}</p>
                  </div>

                  {/* Share Buttons */}
                  <div className="flex gap-2">
                    {(promo.channel === 'whatsapp' || promo.channel === 'both') && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg text-xs font-medium hover:bg-green-600 transition-colors"
                      >
                        <Share2 className="h-3.5 w-3.5" />
                        {t('promotions.shareViaWhatsApp')}
                      </a>
                    )}
                    {(promo.channel === 'sms' || promo.channel === 'both') && (
                      <a
                        href={buildSMSLink('', message)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                        {t('promotions.shareViaSMS')}
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreate && (
        <CreatePromotionDialog
          onCreate={(p) => setPromotions((prev) => [p, ...prev])}
          onClose={() => setShowCreate(false)}
        />
      )}
    </AppShell>
  );
}
