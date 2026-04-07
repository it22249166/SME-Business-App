'use client';

import { Locale } from '@/types';

type TranslationValue = string | Record<string, TranslationValue>;
type TranslationMap = Record<string, TranslationValue>;

let cachedTranslations: Record<Locale, TranslationMap | null> = {
  en: null,
  si: null,
  ta: null,
};

export async function loadTranslations(locale: Locale): Promise<TranslationMap> {
  if (cachedTranslations[locale]) return cachedTranslations[locale]!;
  const response = await fetch(`/locales/${locale}/common.json`);
  const data = await response.json();
  cachedTranslations[locale] = data;
  return data;
}

export function getNestedValue(obj: TranslationMap, path: string): string {
  const keys = path.split('.');
  let current: TranslationValue = obj;
  for (const key of keys) {
    if (typeof current !== 'object' || current === null) return path;
    current = (current as Record<string, TranslationValue>)[key];
  }
  return typeof current === 'string' ? current : path;
}

export function interpolate(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => String(vars[key] ?? `{{${key}}}`));
}
