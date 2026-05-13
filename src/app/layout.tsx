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
  title: 'Tienda Kramer',
  description: 'Instrumentos musicales',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
