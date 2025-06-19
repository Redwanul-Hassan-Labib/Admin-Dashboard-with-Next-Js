import { Hind_Siliguri, Space_Grotesk } from 'next/font/google';

// English font family
export const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['300', '400', '500', '600', '700'],
});

// Bengali font family
export const hindSiliguri = Hind_Siliguri({
  variable: '--font-hind-siliguri',
  subsets: ['bengali', 'latin', 'latin-ext'],
  weight: ['300', '400', '500', '600', '700'],
});
