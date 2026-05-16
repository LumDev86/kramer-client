'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';

export default function BuscarPage() {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedSub, setSelectedSub] = useState('');

  const { data: categories } = useQuery({
    queryKey: ['categories', { parentId: 'null', limit: 100 }],
    queryFn: () => api.categories.getAll({ parentId: 'null', limit: 100 }),
  });

  const activeCat = categories?.data.find((c) => c.id === selectedCat);
  const subcategories = activeCat?.children ?? [];

  const handleSelectCat = (id: string) => {
    setSelectedCat(id);
    setSelectedSub('');
  };

  const productFilters = {
    search: search || undefined,
    ...(selectedSub
      ? { categoryId: selectedSub }
      : selectedCat
        ? subcategories.length > 0
          ? { parentCategoryId: selectedCat }
          : { categoryId: selectedCat }
        : {}),
  };

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

      {/* Fila 1: categorías top-level */}
      <div className="relative">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => handleSelectCat('')}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              selectedCat === '' ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            Todos
          </button>
          {categories?.data.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleSelectCat(cat.id)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                selectedCat === cat.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>

      {/* Fila 2: subcategorías (solo si la categoría activa tiene hijos) */}
      {subcategories.length > 0 && (
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedSub('')}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                selectedSub === '' ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              Todas
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                onClick={() => setSelectedSub(sub.id)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  selectedSub === sub.id ? 'bg-gray-800 text-white border-gray-800' : 'bg-white text-gray-500 border-gray-200'
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
