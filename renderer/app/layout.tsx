import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import { ThemeProvider, themeInitScript } from '@/lib/theme';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Mount — Mechanical Keyboard Acoustics',
  description: 'Real mechanical keyboard sounds for your PC. Open source & offline.',
  // The favicon comes from app/icon.svg — Next fingerprints that URL, so a
  // changed mark replaces the one browsers have cached.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-sans antialiased bg-bg text-content">
        <ThemeProvider>{children}</ThemeProvider>
        {process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === '1' && <Analytics />}
      </body>
    </html>
  );
}
