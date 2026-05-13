'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { StoreConfig } from '@/types';

function computeIsOpen(cfg: StoreConfig): boolean {
  if (cfg.status === 'closed') return false;
  const now = new Date();
  const day = cfg.schedule.find((d) => d.dayOfWeek === now.getDay());
  if (!day || !day.isOpen) return false;
  const h = now.getHours();
  return h >= day.openHour && h < day.closeHour;
}

export function useStoreStatus() {
  const { data, isLoading } = useQuery({
    queryKey: ['store-config'],
    queryFn: () => api.config.get(),
    refetchInterval: 30_000,
    staleTime: 20_000,
  });

  const isOpen = data ? computeIsOpen(data) : null;

  return {
    status:   data?.status   ?? null,
    busyTime: data?.busyTime ?? null,
    isOpen,
    isLoading,
  };
}
