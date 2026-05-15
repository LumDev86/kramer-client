'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';

const LIMIT = 16;

export default function CategoryList() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['categories', page],
    queryFn: () => api.categories.getAll({ limit: LIMIT, page, parentId: 'null' }),
  });

  const totalPages = data?.meta.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {data?.data.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/categoria/${cat.id}`}
              prefetch={false}
              className="flex-shrink-0 flex flex-col items-center gap-1.5 animate-scaleIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shadow-sm active:scale-90 transition-transform duration-150">
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                    priority={index < 4}
                  />
                ) : (
                  <div className="w-full h-full bg-orange-100 flex items-center justify-center text-2xl">🛒</div>
                )}
              </div>
              <span className="text-[11px] text-gray-600 font-bold text-center w-20 truncate">{cat.name}</span>
            </Link>
          ))}
        </div>
        <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <CaretLeft size={14} weight="bold" />
          </button>
          <span className="text-xs text-gray-500 font-medium">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      )}
    </div>
  );
}
