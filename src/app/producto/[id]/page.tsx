'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { CaretLeft, ShoppingCart } from '@phosphor-icons/react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import LogoLoader from '@/components/ui/LogoLoader';

export default function ProductoPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const add = useCartStore((s) => s.add);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.products.getById(id),
  });

  if (isLoading) return <LogoLoader size={64} />;

  if (!product) return <p className="text-center text-gray-400 mt-10">Producto no encontrado</p>;

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <button onClick={() => router.back()} className="flex items-center gap-1 text-gray-500 active:text-orange-500 w-fit transition-colors">
        <CaretLeft size={22} weight="bold" />
        <span className="text-sm font-semibold">Volver</span>
      </button>

      <div className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw"
          priority
        />
      </div>

      {product.category && (
        <span className="text-xs text-orange-500 font-bold uppercase tracking-wide">
          {product.category.name}
        </span>
      )}

      <h1 className="text-xl font-extrabold text-gray-800 leading-snug">{product.title}</h1>

      <p className="text-2xl font-extrabold text-orange-500">
        ${parseFloat(product.price).toLocaleString('es-AR')}
      </p>

      <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

      <button
        onClick={() => add(product)}
        className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform duration-150 text-base"
      >
        <ShoppingCart size={20} weight="fill" />
        Agregar al carrito
      </button>
    </div>
  );
}
