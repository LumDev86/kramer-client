'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from '@phosphor-icons/react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cart';
import { useStoreStatus } from '@/hooks/useStoreStatus';

interface Props {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: Props) {
  const add = useCartStore((s) => s.add);
  const { isOpen } = useStoreStatus();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    add(product);
  };

  return (
    <Link
      href={`/producto/${product.id}`}
      prefetch={false}
      className="block bg-white rounded-2xl shadow-sm overflow-hidden active:scale-95 transition-transform duration-150 animate-slideUp"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="relative w-full aspect-square bg-white">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-contain p-2"
          sizes="(max-width: 768px) 50vw"
        />
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 truncate font-medium">{product.category?.name ?? 'Sin categoría'}</p>
        <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight mt-0.5">{product.title}</p>
        {product.quantity != null && product.unit && (
          <span className="inline-block text-[10px] font-bold text-orange-500 bg-orange-50 rounded-full px-2 py-0.5 mt-1">
            {product.quantity} {product.unit}
          </span>
        )}
        <div className="flex items-center justify-between mt-2">
          <span className="text-orange-500 font-extrabold text-sm">
            ${parseFloat(product.price).toLocaleString('es-AR')}
          </span>
          <button
            onClick={handleAdd}
            disabled={isOpen === false}
            className="bg-orange-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-md active:scale-90 transition-transform duration-150 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <ShoppingCart size={14} weight="fill" />
          </button>
        </div>
      </div>
    </Link>
  );
}
