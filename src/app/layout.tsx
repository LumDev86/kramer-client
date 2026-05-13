import type { Metadata, Viewport } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});
import QueryProvider from '@/components/layout/QueryProvider';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

export const metadata: Metadata = {
  metadataBase: new URL('https://kramer-client.vercel.app'),
  title: 'Kiosco Kramer',
  description: 'Pedidos a domicilio de almacén. Comprá desde tu celular y recibí en tu puerta.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  openGraph: {
    title: 'Kiosco Kramer',
    description: 'Pedidos a domicilio de almacén. Comprá desde tu celular y recibí en tu puerta.',
    siteName: 'Kiosco Kramer',
    locale: 'es_AR',
    type: 'website',
    images: [{ url: '/logo.png', width: 800, height: 800, alt: 'Kiosco Kramer' }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#f97316',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${nunito.className} bg-gray-50`} suppressHydrationWarning>
        <QueryProvider>
          <Header />
          <main className="max-w-md mx-auto pt-24 pb-24 px-4 min-h-screen animate-fadeIn">
            {children}
          </main>
          <BottomNav />
        </QueryProvider>
      </body>
    </html>
  );
}
