'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { BusinessType, Locale } from '@/types';
import { BUSINESS_CONFIG } from '@/lib/businessConfig';

const LOCALES: { code: Locale; label: string; sublabel: string }[] = [
  { code: 'en', label: 'English', sublabel: 'English' },
  { code: 'si', label: 'සිංහල', sublabel: 'Sinhala' },
  { code: 'ta', label: 'தமிழ்', sublabel: 'Tamil' },
];

const STEPS = ['language', 'business', 'name'] as const;
type Step = (typeof STEPS)[number];

const LABELS: Record<Locale, Record<string, string>> = {
  en: {
    welcome: 'Welcome to SME Manager',
    selectLanguage: 'Choose your language',
    selectBusiness: 'What type of business do you run?',
    enterName: "What's your business name?",
    namePlaceholder: 'e.g. Nimal\'s Hardware Shop',
    letsGo: "Let's Go!",
    back: 'Back',
  },
  si: {
    welcome: 'SME කළමනාකරු වෙත සාදරයෙන් පිළිගනිමු',
    selectLanguage: 'ඔබේ භාෂාව තෝරන්න',
    selectBusiness: 'ඔබ කරන ව්‍යාපාරය කුමක්ද?',
    enterName: 'ඔබේ ව්‍යාපාරයේ නම කුමක්ද?',
    namePlaceholder: 'උදා: නිමල්ගේ දෘඩාංග කඩය',
    letsGo: 'ආරම්භ කරමු!',
    back: 'ආපසු',
  },
  ta: {
    welcome: 'SME மேலாளருக்கு வரவேற்கிறோம்',
    selectLanguage: 'உங்கள் மொழியை தேர்ந்தெடுக்கவும்',
    selectBusiness: 'நீங்கள் நடத்தும் வணிகம் என்ன?',
    enterName: 'உங்கள் வணிக பெயர் என்ன?',
    namePlaceholder: 'எ.கா. நிமல் வன்பொருள் கடை',
    letsGo: 'தொடங்குவோம்!',
    back: 'திரும்பு',
  },
};

const BUSINESS_LABELS: Record<Locale, Record<BusinessType, string>> = {
  en: { shop: 'Shop', salon: 'Salon', pharmacy: 'Pharmacy', boutique: 'Boutique', cafe: 'Café' },
  si: { shop: 'කඩය', salon: 'සැලොන්', pharmacy: 'ෆාමසිය', boutique: 'බූටීකය', cafe: 'කෆේ' },
  ta: { shop: 'கடை', salon: 'சலூன்', pharmacy: 'மருந்தகம்', boutique: 'பூட்டீக்', cafe: 'கஃபே' },
};

export default function OnboardingPage() {
  const router = useRouter();
  const { isOnboarded, completeOnboarding } = useAppStore();
  const [step, setStep] = useState<Step>('language');
  const [locale, setLocale] = useState<Locale>('en');
  const [businessType, setBusinessType] = useState<BusinessType>('shop');
  const [businessName, setBusinessName] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isOnboarded) {
      router.replace('/dashboard');
    }
  }, [mounted, isOnboarded, router]);

  if (!mounted) return null;
  if (isOnboarded) return null;

  const L = LABELS[locale];
  const BL = BUSINESS_LABELS[locale];

  const handleFinish = () => {
    completeOnboarding(businessType, businessName || BL[businessType], locale);
    router.push('/dashboard');
  };

  const fontFamily = locale === 'si' ? "'Noto Sans Sinhala', sans-serif" : locale === 'ta' ? "'Noto Sans Tamil', sans-serif" : 'Inter, sans-serif';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4" style={{ fontFamily }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏪</div>
          <h1 className="text-2xl font-bold text-gray-900">{L.welcome}</h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Step: Language */}
          {step === 'language' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{L.selectLanguage}</h2>
              <div className="space-y-3">
                {LOCALES.map(({ code, label, sublabel }) => (
                  <button
                    key={code}
                    onClick={() => { setLocale(code); setStep('business'); }}
                    className="w-full flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                  >
                    <span className="text-2xl">{code === 'en' ? '🇬🇧' : code === 'si' ? '🇱🇰' : '🇮🇳'}</span>
                    <div>
                      <p className="font-semibold text-gray-900">{label}</p>
                      <p className="text-sm text-gray-500">{sublabel}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step: Business Type */}
          {step === 'business' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{L.selectBusiness}</h2>
              <div className="grid grid-cols-2 gap-3">
                {(Object.keys(BUSINESS_CONFIG) as BusinessType[]).map((type) => {
                  const config = BUSINESS_CONFIG[type];
                  return (
                    <button
                      key={type}
                      onClick={() => { setBusinessType(type); setStep('name'); }}
                      className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-colors hover:border-blue-500 hover:bg-blue-50 ${businessType === type ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      <span className="text-3xl">{config.icon}</span>
                      <span className="text-sm font-semibold text-gray-900">{BL[type]}</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setStep('language')} className="mt-4 text-sm text-gray-500 hover:text-gray-700 w-full text-center">
                ← {L.back}
              </button>
            </div>
          )}

          {/* Step: Business Name */}
          {step === 'name' && (
            <div>
              <div className="text-center mb-4">
                <span className="text-4xl">{BUSINESS_CONFIG[businessType].icon}</span>
                <p className="text-sm text-gray-500 mt-1">{BL[businessType]}</p>
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">{L.enterName}</h2>
              <input
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFinish()}
                placeholder={L.namePlaceholder}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base focus:outline-none focus:border-blue-500 mb-4"
                autoFocus
              />
              <button
                onClick={handleFinish}
                className={`w-full py-3.5 rounded-xl text-base font-bold text-white transition-colors bg-gradient-to-r ${BUSINESS_CONFIG[businessType].gradient} hover:opacity-90`}
              >
                {L.letsGo} →
              </button>
              <button onClick={() => setStep('business')} className="mt-3 text-sm text-gray-500 hover:text-gray-700 w-full text-center">
                ← {L.back}
              </button>
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {STEPS.map((s) => (
            <div key={s} className={`w-2 h-2 rounded-full transition-colors ${s === step ? 'bg-blue-600' : 'bg-gray-300'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
