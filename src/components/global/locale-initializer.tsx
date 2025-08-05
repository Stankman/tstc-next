'use client';

import { useEffect } from 'react';

export function LocaleInitializer() {
  useEffect(() => {
    // Check if we have a saved locale in localStorage
    const savedLocale = localStorage.getItem('locale');
    
    if (savedLocale && ['en', 'es'].includes(savedLocale)) {
      // Set the cookie if it doesn't match
      const currentCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('locale='))
        ?.split('=')[1];
        
      if (currentCookie !== savedLocale) {
        document.cookie = `locale=${savedLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;
        window.location.reload();
      }
    } else if (!localStorage.getItem('locale')) {
      // Set default locale if none exists
      localStorage.setItem('locale', 'en');
      document.cookie = `locale=en; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
  }, []);

  return null;
}
