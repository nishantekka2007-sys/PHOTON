'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Clock } from 'lucide-react';
import { MediaFile } from '@/types';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

export default function TimelinePage() {
  const { media } = useMedia();

  const activeMedia = useMemo(() => {
    return media.filter((m) => !m.is_deleted);
  }, [media]);

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
      <motion.div
        variants={staggerEditorial}
        initial="hidden"
        animate="show"
        className="space-y-10"
      >
        {/* Header */}
        <motion.div variants={itemFadeUp} className="pb-6 border-b border-photon-border">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Chronological Epoch</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
            Memory Timeline
          </h1>
          <p className="text-xs font-mono text-photon-muted mt-1">
            A chronological tapestry of moments arranged by verified EXIF capture timestamps
          </p>
        </motion.div>

        {groupedTimeline.length === 0 ? (
          <motion.div
            variants={itemFadeUp}
            className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-photon-border rounded-3xl bg-photon-dark/50"
          >
            <div className="h-16 w-16 rounded-3xl border border-photon-border bg-photon-card flex items-center justify-center text-photon-muted mb-4 shadow-inner">
              <Clock className="h-7 w-7 stroke-1" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-white">
              Timeline is unpopulated
            </h3>
            <p className="text-xs font-sans text-photon-light max-w-sm mt-1.5 font-light">
              Ingest photographs with capture dates to construct your timeline.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-12">
            {groupedTimeline.map((group) => (
              <motion.div
                key={group.label}
                variants={itemFadeUp}
                className="relative pl-7 border-l border-photon-border"
              >
                {/* Hairline timeline node */}
                <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-white ring-4 ring-photon-obsidian" />

                <div className="mb-5">
                  <h2 className="font-serif text-2xl font-normal text-white flex items-center gap-2.5">
                    <span>{group.label}</span>
                    <span className="text-xs font-mono text-photon-muted font-normal">
                      &bull; {group.items.length} {group.items.length === 1 ? 'negative' : 'negatives'}
                    </span>
                  </h2>
                </div>

                <MediaGrid media={group.items} />
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
