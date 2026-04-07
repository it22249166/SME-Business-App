'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { AppShell } from '@/components/layout/AppShell';
import { useTranslation } from '@/hooks/useTranslation';
import { BusinessType, Locale } from '@/types';
import { BUSINESS_CONFIG } from '@/lib/businessConfig';

const LOCALES: { code: Locale; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'si', label: 'Sinhala', native: 'සිංහල' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
];

export default function SettingsPage() {
  const router = useRouter();
  const { isOnboarded, businessType, businessName, locale, setBusinessType, setBusinessName, setLocale, reset } = useAppStore();
  const { t } = useTranslation();
  const [name, setName] = useState(businessName);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isOnboarded) router.replace('/');
  }, [isOnboarded, router]);

  useEffect(() => {
    setName(businessName);
  }, [businessName]);

  const handleSave = () => {
    setBusinessName(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isOnboarded) return null;

  return (
    <AppShell>
      <div className="space-y-6 max-w-lg">
        <h1 className="text-xl font-bold text-gray-900">{t('nav.settings')}</h1>

        {/* Business Name */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Business Name</h2>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your business name"
          />
          <button
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
          >
            {saved ? '✓ Saved!' : t('common.save')}
          </button>
        </div>

        {/* Language */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Language / භාෂාව / மொழி</h2>
          <div className="space-y-2">
            {LOCALES.map(({ code, label, native }) => (
              <button
                key={code}
                onClick={() => setLocale(code)}
                className={`w-full flex items-center justify-between p-3 border-2 rounded-xl transition-colors ${
                  locale === code ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{label}</span>
                <span className="text-sm text-gray-500">{native}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Business Type */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Business Type</h2>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(BUSINESS_CONFIG) as BusinessType[]).map((type) => {
              const config = BUSINESS_CONFIG[type];
              return (
                <button
                  key={type}
                  onClick={() => setBusinessType(type)}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl transition-colors ${
                    businessType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{config.icon}</span>
                  <span className="text-sm font-medium text-gray-900">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset */}
        <div className="bg-white rounded-xl border border-red-200 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Reset App</h2>
          <p className="text-sm text-gray-500">This will restart the onboarding process.</p>
          <button
            onClick={() => { reset(); router.push('/'); }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
          >
            Reset & Restart
          </button>
        </div>
      </div>
    </AppShell>
  );
}
