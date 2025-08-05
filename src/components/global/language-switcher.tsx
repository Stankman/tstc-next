'use client';

import {useLocale} from 'next-intl';
import {useRouter} from 'next/navigation';
import {routing} from '../../i18n/routing';
import { useState, useEffect } from 'react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState(locale);
  
  useEffect(() => {
    setCurrentLocale(locale);
  }, [locale]);
  
  const switchLocale = (newLocale: string) => {
    // Save to localStorage
    localStorage.setItem('locale', newLocale);
    
    // Save to cookie
    document.cookie = `locale=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`; // 1 year
    
    // Refresh the page to apply new locale
    window.location.reload();
  };

  return (
    <div className="flex gap-2">
      {routing.locales.map((lng) => (
        <button
          key={lng}
          onClick={() => switchLocale(lng)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            lng === currentLocale
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
