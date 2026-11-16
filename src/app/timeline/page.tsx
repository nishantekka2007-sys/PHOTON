'use client';

import React, { useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Calendar, Sparkles } from 'lucide-react';
import { MediaFile } from '@/types';

export default function TimelinePage() {
  const { media } = useMedia();

  const activeMedia = useMemo(() => {
    return media.filter((m) => !m.is_deleted);
  }, [media]);

  // Group media by "Month Year" (e.g. "November 2026")
  const groupedTimeline = useMemo(() => {
    const groups: Record<string, { label: string; date: Date; items: MediaFile[] }> = {};

    activeMedia.forEach((item) => {
      const dateStr = item.metadata.taken_at || item.created_at;
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
      const label = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

      if (!groups[key]) {
        groups[key] = { label, date: d, items: [] };
      }
      groups[key].items.push(item);
    });

    // Sort descending by date
    return Object.entries(groups)
      .sort((a, b) => b[1].date.getTime() - a[1].date.getTime())
      .map(([_, group]) => ({
        label: group.label,
        items: group.items.sort((a, b) => {
          const tA = new Date(a.metadata.taken_at || a.created_at).getTime();
          const tB = new Date(b.metadata.taken_at || b.created_at).getTime();
          return tB - tA;
        }),
      }));
  }, [activeMedia]);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            Memory Timeline
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Your life chronologically arranged by capture date
          </p>
        </div>

        {groupedTimeline.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="h-16 w-16 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
              <Calendar className="h-8 w-8 stroke-1" />
            </div>
            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              Your timeline is waiting
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-5">
              Upload photos with capture dates to see your memories organized in an elegant chronological feed.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedTimeline.map((group) => (
              <div key={group.label} className="relative pl-6 border-l-2 border-indigo-500/30">
                {/* Timeline node badge */}
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-indigo-600 ring-4 ring-zinc-100 dark:ring-zinc-950 flex items-center justify-center text-white" />

                <div className="mb-4">
                  <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                    <span>{group.label}</span>
                    <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400">
                      ({group.items.length} {group.items.length === 1 ? 'memory' : 'memories'})
                    </span>
                  </h2>
                </div>

                <MediaGrid media={group.items} />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
