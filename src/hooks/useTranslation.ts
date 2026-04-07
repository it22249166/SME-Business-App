'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Locale } from '@/types';

type TranslationMap = Record<string, unknown>;

function getNestedValue(obj: TranslationMap, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (typeof current !== 'object' || current === null) return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

const cache: Partial<Record<Locale, TranslationMap>> = {};

export function useTranslation() {
  const locale = useAppStore((s) => s.locale);
  const [translations, setTranslations] = useState<TranslationMap>(cache[locale] ?? {});

  useEffect(() => {
    if (cache[locale]) {
      setTranslations(cache[locale]!);
      return;
    }
    fetch(`/locales/${locale}/common.json`)
      .then((r) => r.json())
      .then((data) => {
        cache[locale] = data;
        setTranslations(data);
      })
      .catch(() => {});
  }, [locale]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>): string => {
      let value = getNestedValue(translations, key);
      if (vars) {
        value = value.replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k] ?? `{{${k}}}`));
      }
      return value;
    },
    [translations]
  );

  return { t, locale };
}
