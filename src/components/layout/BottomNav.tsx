'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, MagnifyingGlass, ShoppingCart } from '@phosphor-icons/react';
import { useCartStore } from '@/store/cart';

const links = [
  { href: '/', label: 'Inicio', Icon: House },
  { href: '/buscar', label: 'Buscar', Icon: MagnifyingGlass },
  { href: '/carrito', label: 'Carrito', Icon: ShoppingCart },
];

export default function BottomNav() {
  const pathname = usePathname();
  const count = useCartStore((s) => s.count());

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-md mx-auto flex flex-col items-center">
        <div className="flex justify-around items-center py-2 w-full">
        {links.map(({ href, label, Icon }) => {
          const active = pathname === href;
          const isCart = href === '/carrito';
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 transition-colors duration-150 ${active ? 'text-orange-500' : 'text-gray-400'}`}
            >
              <div className="relative">
                <Icon size={23} weight={active ? 'fill' : 'regular'} />
                {isCart && count > 0 && (
                  <span
                    key={count}
                    className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bouncePop"
                  >
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-semibold">{label}</span>
            </Link>
          );
        })}
        </div>
        <div className="flex flex-col items-center pb-1 gap-0.5">
          <p className="text-[9px] text-gray-300 font-medium tracking-wide">
            © {new Date().getFullYear()} <span className="font-bold">Kiosco Kramer</span>
          </p>
          <p className="text-[9px] text-gray-300 font-medium tracking-wide">
            Desarrollado por{' '}
            <a
              href="https://www.innovadev.it.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-gray-400 underline underline-offset-2"
            >
              innovaDev
            </a>
            {' · '}
            <a
              href="https://www.innovadev.it.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 underline underline-offset-2"
            >
              www.innovadev.it.com
            </a>
          </p>
        </div>
      </div>
    </nav>
  );
}
