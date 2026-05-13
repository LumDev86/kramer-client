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
      const h = `${String(g.openHour).padStart(2, '0')}:00 - ${String(g.closeHour).padStart(2, '0')}:00`;
      return `${dayStr} ${h}`;
    })
    .join(' / ');
}

export default function Header() {
  const { status, busyTime, isOpen, isLoading, schedule } = useStoreStatus();
  const storeName = process.env.NEXT_PUBLIC_STORE_NAME ?? 'Kiosco Kramer';
  const hours = schedule.length > 0
    ? formatSchedule(schedule)
    : (process.env.NEXT_PUBLIC_STORE_HOURS ?? 'Lun-Dom 8:00 - 22:00');

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-orange-500 px-4 py-3 shadow-md">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">

        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white flex-shrink-0 shadow-sm">
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
            <p className="text-white font-extrabold text-base leading-tight truncate tracking-tight">{storeName}</p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1 text-orange-100 text-xs font-medium">
                <Bicycle size={13} weight="fill" />
                Envíos a domicilio
              </span>
              <span className="text-orange-300 text-xs">·</span>
              <span className="flex items-center gap-1 text-orange-100 text-xs font-medium">
                <Clock size={12} weight="fill" />
                {hours}
              </span>
            </div>
          </div>
        </div>

        {!isLoading && (
          <div className="flex-shrink-0 animate-scaleIn">
            {status === 'busy' && isOpen ? (
              <span className="flex items-center gap-1.5 bg-yellow-400 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Ocupado · {busyTime} min
              </span>
            ) : isOpen ? (
              <span className="flex items-center gap-1.5 bg-green-400 text-white text-xs font-bold px-2.5 py-1.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Abierto
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-black/30 text-white text-xs font-semibold px-2.5 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                Cerrado
              </span>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
