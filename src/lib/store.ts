'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BusinessType, Locale } from '@/types';

interface AppState {
  businessType: BusinessType;
  businessName: string;
  locale: Locale;
  isOnboarded: boolean;
  setBusinessType: (type: BusinessType) => void;
  setBusinessName: (name: string) => void;
  setLocale: (locale: Locale) => void;
  completeOnboarding: (type: BusinessType, name: string, locale: Locale) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      businessType: 'shop',
      businessName: '',
      locale: 'en',
      isOnboarded: false,
      setBusinessType: (type) => set({ businessType: type }),
      setBusinessName: (name) => set({ businessName: name }),
      setLocale: (locale) => set({ locale }),
      completeOnboarding: (type, name, locale) =>
        set({ businessType: type, businessName: name, locale, isOnboarded: true }),
      reset: () => set({ isOnboarded: false, businessType: 'shop', businessName: '', locale: 'en' }),
    }),
    {
      name: 'sme-app-store',
      skipHydration: true,
    }
  )
);
