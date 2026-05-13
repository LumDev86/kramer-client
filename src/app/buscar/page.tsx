'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';

export default function BuscarPage() {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.categories.getAll({ limit: 100 }),
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-bold text-gray-800">Buscar</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Nombre del producto..."
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400"
      />

      <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setCategoryId('')}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            categoryId === '' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200'
          }`}
        >
          Todos
        </button>
        {categories?.data.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoryId(cat.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              categoryId === cat.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>

      <ProductGrid
        filters={{
          search: search || undefined,
          categoryId: categoryId || undefined,
        }}
      />
    </div>
  );
}
