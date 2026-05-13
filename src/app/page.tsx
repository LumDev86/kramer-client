'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import CategoryList from '@/components/categories/CategoryList';
import ProductGrid from '@/components/products/ProductGrid';

const BannerCarousel = dynamic(() => import('@/components/banners/BannerCarousel'), {
  ssr: false,
  loading: () => <div className="w-full h-40 rounded-2xl bg-gray-200 animate-pulse" />,
});

function HomeContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? '';

  return (
    <div className="flex flex-col gap-6">
      {!search && (
        <>
          <section>
            <BannerCarousel />
          </section>
          <section>
            <h2 className="text-base font-bold text-gray-800 mb-3">Categorías</h2>
            <CategoryList />
          </section>
        </>
      )}
      <section>
        <ProductGrid
          filters={{ search: search || undefined }}
          title={search ? `Resultados para "${search}"` : 'Todos los productos'}
        />
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
