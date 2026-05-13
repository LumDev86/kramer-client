'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash, Plus, Minus } from '@phosphor-icons/react';
import { useCartStore } from '@/store/cart';

export default function CarritoPage() {
  const { items, increment, decrement, remove, total } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-400 animate-fadeIn">
        <p className="text-5xl">🛒</p>
        <p className="font-bold text-gray-500">Tu carrito está vacío</p>
        <Link href="/" className="mt-2 text-sm text-orange-500 font-bold underline">
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-fadeIn">
      <h1 className="text-lg font-extrabold text-gray-800">Mi carrito</h1>

      <div className="flex flex-col gap-3">
        {items.map(({ product, quantity }, i) => (
          <div
            key={product.id}
            className="flex gap-3 bg-white rounded-2xl p-3 shadow-sm animate-slideUp"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
              <Image
                src={product.imageUrl}
                alt={product.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-tight">{product.title}</p>
              <p className="text-orange-500 font-extrabold text-sm mt-1">
                ${parseFloat(product.price).toLocaleString('es-AR')}
              </p>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => decrement(product.id)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-100 transition-colors"
                  >
                    <Minus size={13} weight="bold" />
                  </button>
                  <span className="text-sm font-bold w-4 text-center">{quantity}</span>
                  <button
                    onClick={() => increment(product.id)}
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 active:bg-gray-100 transition-colors"
                  >
                    <Plus size={13} weight="bold" />
                  </button>
                </div>
                <button onClick={() => remove(product.id)} className="text-gray-300 active:text-red-400 transition-colors">
                  <Trash size={16} weight="fill" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm animate-slideUp" style={{ animationDelay: '120ms' }}>
        <div className="flex justify-between text-sm text-gray-400 mb-1 font-medium">
          <span>Subtotal ({items.reduce((a, i) => a + i.quantity, 0)} productos)</span>
        </div>
        <div className="flex justify-between font-extrabold text-gray-800 text-lg">
          <span>Total</span>
          <span className="text-orange-500">${total().toLocaleString('es-AR')}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="w-full bg-orange-500 text-white font-bold py-4 rounded-2xl text-center shadow-md active:scale-95 transition-transform duration-150 block animate-slideUp text-base"
        style={{ animationDelay: '180ms' }}
      >
        Continuar al checkout
      </Link>
    </div>
  );
}
