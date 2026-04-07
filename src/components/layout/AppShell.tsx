'use client';

import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { MobileNav } from './MobileNav';
import { Topbar } from './Topbar';
import { useAppStore } from '@/lib/store';
import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
}

export function AppShell({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const locale = useAppStore((s) => s.locale);

  // Apply font based on locale
  useEffect(() => {
    const fontMap: Record<string, string> = {
      si: "'Noto Sans Sinhala', sans-serif",
      ta: "'Noto Sans Tamil', sans-serif",
      en: "'Inter', sans-serif",
    };
    document.documentElement.style.setProperty('--font-body', fontMap[locale] ?? fontMap.en);
  }, [locale]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-50 flex">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <main className={cn(
          'flex-1 overflow-y-auto p-4 md:p-6',
          'pb-20 md:pb-6' // extra bottom padding for mobile nav
        )}>
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileNav />
    </div>
  );
}
