'use client';

import { Menu } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Locale } from '@/types';

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'si', label: 'සිං' },
  { code: 'ta', label: 'த' },
];

interface Props {
  onMenuClick: () => void;
  title?: string;
}

export function Topbar({ onMenuClick, title }: Props) {
  const locale = useAppStore((s) => s.locale);
  const setLocale = useAppStore((s) => s.setLocale);
  const businessName = useAppStore((s) => s.businessName);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-14 flex items-center px-4 gap-3">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      <div className="flex-1 min-w-0">
        {title && (
          <h1 className="text-base font-semibold text-gray-900 truncate">{title}</h1>
        )}
        {!title && (
          <span className="text-sm text-gray-500 truncate hidden sm:block">{businessName}</span>
        )}
      </div>

      {/* Language Toggle */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {LOCALES.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLocale(code)}
            className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
              locale === code
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </header>
  );
}
