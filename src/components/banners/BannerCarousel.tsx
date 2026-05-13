'use client';

import { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import LogoLoader from '@/components/ui/LogoLoader';

export default function BannerCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { data: banners = [], isLoading, error } = useQuery({
    queryKey: ['banners'],
    queryFn: api.banners.getAll,
    staleTime: 1000 * 60 * 5,
  });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  if (isLoading) {
    return <LogoLoader size={56} />;
  }

  if (error || banners.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {banners.map((banner) => {
            const content = (
              <div className="relative w-full h-44 flex-shrink-0 overflow-hidden" style={{ minWidth: '100%' }}>
                {/* Fondo difuminado para rellenar bordes */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60"
                />
                {/* Imagen principal centrada sin recorte */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.imageUrl}
                  alt={banner.title ?? 'Banner'}
                  className="relative w-full h-full object-contain"
                />
              </div>
            );

            return banner.linkUrl ? (
              <Link key={banner.id} href={banner.linkUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0 w-full">
                {content}
              </Link>
            ) : (
              <div key={banner.id} className="flex-shrink-0 w-full">
                {content}
              </div>
            );
          })}
        </div>
      </div>

      {banners.length > 1 && (
        <div className="flex justify-center gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === selectedIndex ? 'w-4 bg-orange-500' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
