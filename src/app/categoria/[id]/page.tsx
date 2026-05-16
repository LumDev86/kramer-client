'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CaretLeft } from '@phosphor-icons/react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';

export default function CategoriaPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [selectedSub, setSelectedSub] = useState('');

  const { data: category, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => api.categories.getById(id),
  });

  const subcategories = category?.children ?? [];
  const hasChildren = subcategories.length > 0;

  const productFilters = hasChildren
    ? selectedSub
      ? { categoryId: selectedSub }
      : { parentCategoryId: id }
    : { categoryId: id };

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="text-gray-500 active:text-orange-500 transition-colors">
          <CaretLeft size={26} weight="bold" />
        </button>
        <h1 className="text-lg font-extrabold text-gray-800">
          {category?.name ?? 'Categoría'}
        </h1>
      </div>

      {/* Filtros de subcategoría */}
      {!isLoading && hasChildren && (
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedSub('')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                selectedSub === '' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              Todas
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSub(sub.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  selectedSub === sub.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
          <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        </div>
      )}

      <ProductGrid filters={productFilters} />
    </div>
  );
}
