import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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
  icons: {
    icon: '/Logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#000000] text-[#FFFFFF] selection:bg-[#00AFFF] selection:text-[#000000]">
        {children}
      </body>
    </html>
  );
}
