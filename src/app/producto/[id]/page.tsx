'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { CaretLeft, ShoppingCart } from '@phosphor-icons/react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import { useStoreStatus } from '@/hooks/useStoreStatus';
import LogoLoader from '@/components/ui/LogoLoader';

export default function ProductoPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const add = useCartStore((s) => s.add);
  const { isOpen } = useStoreStatus();

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

      <div className="flex items-center gap-2 flex-wrap">
        {product.category && (
          <span className="text-xs text-orange-500 font-bold uppercase tracking-wide">
            {product.category.name}
          </span>
        )}
        {product.quantity != null && product.unit && (
          <span className="text-xs font-bold text-white bg-orange-500 rounded-full px-2.5 py-0.5">
            {product.quantity} {product.unit}
          </span>
        )}
      </div>

      <h1 className="text-xl font-extrabold text-gray-800 leading-snug">{product.title}</h1>

      <p className="text-2xl font-extrabold text-orange-500">
        ${parseFloat(product.price).toLocaleString('es-AR')}
      </p>

      <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>

      {isOpen === false ? (
        <div className="w-full bg-gray-100 text-gray-500 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-sm text-center px-4">
          🕐 El local está cerrado en este momento. Podés volver durante el horario de atención.
        </div>
      ) : (
        <button
          onClick={() => add(product)}
          className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform duration-150 text-base"
        >
          <ShoppingCart size={20} weight="fill" />
          Agregar al carrito
        </button>
      )}
    </div>
  );
}
