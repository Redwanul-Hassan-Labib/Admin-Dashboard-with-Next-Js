import ClientClerkProvider from '@/components/providers/clerk-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import ToasterProvider from '@/components/providers/toaster-provider';

import { cn } from '@/lib/utils';

import OfflineProvider from '@/components/providers/offline-provider';
import ReduxProvider from '@/components/providers/redux-provider';
import { hindSiliguri, spaceGrotesk } from '@/constant/fonts';
import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Next TS Starter',
  description: 'Next TS Starter...',
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('dark:bg-dark-deep bg-light overflow-x-hidden scroll-smooth antialiased', spaceGrotesk.variable, hindSiliguri.variable)}>
        <ReduxProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
            <ClientClerkProvider>
              <main className="min-h-screen overflow-x-hidden">{children}</main>
              <OfflineProvider />
              <ToasterProvider />
            </ClientClerkProvider>
          </ThemeProvider>
        </ReduxProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
