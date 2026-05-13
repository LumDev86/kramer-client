'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { ProductFilters } from '@/types';
import ProductCard from './ProductCard';
import LogoLoader from '@/components/ui/LogoLoader';

interface Props {
  filters?: ProductFilters;
  title?: string;
}

const LIMIT = 20;

export default function ProductGrid({ filters = {}, title }: Props) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['products', filters],
    queryFn: ({ pageParam }) =>
      api.products.getAll({ ...filters, limit: LIMIT, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.page < lastPage.meta.totalPages
        ? lastPage.meta.page + 1
        : undefined,
  });

  const products = data?.pages.flatMap((p) => p.data) ?? [];

  if (isLoading) {
    return (
      <div>
        {title && <h2 className="text-base font-extrabold text-gray-800 mb-3">{title}</h2>}
        <LogoLoader size={64} />
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-4xl mb-2">🛒</p>
        <p className="text-sm font-medium">No se encontraron productos</p>
      </div>
    );
  }

  return (
    <div>
      {title && <h2 className="text-base font-extrabold text-gray-800 mb-3">{title}</h2>}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full mt-5 py-3 rounded-2xl border-2 border-orange-400 text-orange-500 font-bold text-sm active:scale-95 transition-transform duration-150 disabled:opacity-50"
        >
          {isFetchingNextPage ? 'Cargando...' : 'Cargar más productos'}
        </button>
      )}
    </div>
  );
}
