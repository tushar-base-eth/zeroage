'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeType, themes } from '@/lib/themes';

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: ThemeType) => void;
};

const initialState: ThemeProviderState = {
  theme: themes.light,
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'light',
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeType;
}) {
  const [theme, setTheme] = useState<Theme>(themes[defaultTheme]);

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Update CSS variables
    Object.entries(theme).forEach(([key, value]) => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, value);
    });
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: ThemeType) => setTheme(themes[newTheme]),
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
