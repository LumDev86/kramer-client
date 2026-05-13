'use client';

import Image from 'next/image';
import { Bicycle, Clock } from '@phosphor-icons/react';
import { useStoreStatus } from '@/hooks/useStoreStatus';
import { StoreScheduleDay } from '@/types';

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

function formatSchedule(schedule: StoreScheduleDay[]): string {
  const open = schedule.filter((d) => d.isOpen);
  if (open.length === 0) return 'Sin horario';

  const groups: { days: number[]; openHour: number; closeHour: number }[] = [];
  for (const day of open) {
    const last = groups[groups.length - 1];
    const consecutive = last && day.dayOfWeek === last.days[last.days.length - 1] + 1;
    const sameHours = last && last.openHour === day.openHour && last.closeHour === day.closeHour;
    if (consecutive && sameHours) {
      last.days.push(day.dayOfWeek);
    } else {
      groups.push({ days: [day.dayOfWeek], openHour: day.openHour, closeHour: day.closeHour });
    }
  }

  return groups
    .map((g) => {
      const dayStr =
        g.days.length === 1
          ? DAY_NAMES[g.days[0]]
          : `${DAY_NAMES[g.days[0]]}-${DAY_NAMES[g.days[g.days.length - 1]]}`;
      const h = `${String(g.openHour).padStart(2, '0')}:00-${String(g.closeHour).padStart(2, '0')}:00`;
      return `${dayStr} ${h}`;
    })
    .join(' / ');
}

export default function Header() {
  const { status, busyTime, isOpen, isLoading, schedule } = useStoreStatus();
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? 'Kiosco Kramer';
  const hours = schedule.length > 0
    ? formatSchedule(schedule)
    : (process.env.NEXT_PUBLIC_STORE_HOURS ?? 'Lun-Dom 8:00-22:00');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-orange-600 px-4 pt-3 pb-3 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 shadow-md ring-2 ring-white/30 bg-white">
            <Image
              src="/logo.png"
              alt={storeName}
              width={48}
              height={48}
              className="object-cover w-full h-full"
              priority
            />
          </div>

          <div className="min-w-0">
            <p className="text-white font-extrabold text-base leading-tight truncate tracking-tight drop-shadow-sm">
              {storeName}
            </p>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                <Bicycle size={10} weight="fill" />
                Envíos
              </span>
              <span className="flex items-center gap-1 bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm truncate max-w-[160px]">
                <Clock size={10} weight="fill" className="flex-shrink-0" />
                <span className="truncate">{hours}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          {isLoading ? (
            <div className="w-16 h-6 bg-white/20 rounded-full animate-pulse" />
          ) : status === 'busy' && isOpen ? (
            <span className="flex items-center gap-1.5 bg-yellow-400 text-yellow-900 text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-md">
              <span className="w-1.5 h-1.5 bg-yellow-800/60 rounded-full animate-pulse flex-shrink-0" />
              Ocupado · {busyTime}m
            </span>
          ) : isOpen ? (
            <span className="flex items-center gap-1.5 bg-green-400 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-md">
              <span className="w-1.5 h-1.5 bg-white/70 rounded-full animate-pulse flex-shrink-0" />
              Abierto
            </span>
          ) : (
            <span className="flex items-center gap-1.5 bg-black/30 text-white/90 text-[11px] font-bold px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-white/40 rounded-full flex-shrink-0" />
              Cerrado
            </span>
          )}
        </div>

      </div>
    </header>
  );
}
