'use client';

import { useTheme } from 'next-themes';
import { Toaster } from 'sonner';

export default function ToasterProvider() {
  const { theme, systemTheme } = useTheme();
  // Get the effective theme (user selected or system default)
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDarkMode = currentTheme === 'dark';

  return <Toaster theme={isDarkMode ? 'dark' : 'light'} position="top-right" />;
}
