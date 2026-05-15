'use client';

import { useQuery } from '@tanstack/react-query';
import { CaretLeft } from '@phosphor-icons/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import ProductGrid from '@/components/products/ProductGrid';

export default function CategoriaPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: category, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => api.categories.getById(id),
  });

  const hasChildren = (category?.children?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <div className="flex items-center gap-2">
        <button onClick={() => router.back()} className="text-gray-500 active:text-orange-500 transition-colors">
          <CaretLeft size={26} weight="bold" />
        </button>
        <h1 className="text-lg font-extrabold text-gray-800">{category?.name ?? 'Categoría'}</h1>
      </div>

      {!isLoading && hasChildren ? (
        <div className="grid grid-cols-2 gap-3">
          {category!.children.map((sub) => (
            <Link
              key={sub.id}
              href={`/categoria/${sub.id}`}
              className="bg-white rounded-2xl shadow-sm overflow-hidden active:scale-95 transition-transform duration-150"
            >
              <div className="relative h-28 bg-gray-100">
                {sub.imageUrl ? (
                  <Image src={sub.imageUrl} alt={sub.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-orange-100 flex items-center justify-center text-3xl">🏷️</div>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-bold text-gray-800 truncate">{sub.name}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <ProductGrid filters={{ categoryId: id }} />
      )}
    </div>
  );
}
