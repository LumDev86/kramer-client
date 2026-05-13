'use client';

import { useQuery } from '@tanstack/react-query';
import { CaretLeft } from '@phosphor-icons/react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';

export default function CategoriaPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: category } = useQuery({
    queryKey: ['category', id],
    queryFn: () => api.categories.getById(id),
  });

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="text-gray-500 active:text-orange-500 transition-colors">
          <CaretLeft size={26} weight="bold" />
        </button>
        <h1 className="text-lg font-extrabold text-gray-800">{category?.name ?? 'Categoría'}</h1>
      </div>

      <ProductGrid filters={{ categoryId: id }} />
    </div>
  );
}
