'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Heart, ArrowUpDown, Film } from 'lucide-react';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

export default function VideosPage() {
  const { media, searchQuery } = useMedia();
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration' | 'size'>('newest');

  const videos = useMemo(() => {
    return media.filter((m) => !m.is_deleted && m.media_type === 'video');
  }, [media]);

  const filteredVideos = useMemo(() => {
    let result = videos;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.filename.toLowerCase().includes(q) ||
          v.original_name.toLowerCase().includes(q)
      );
    }

    if (filterFavorites) {
      result = result.filter((v) => v.is_favorite);
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'newest') {
        return (
          new Date(b.metadata.taken_at || b.created_at).getTime() -
          new Date(a.metadata.taken_at || a.created_at).getTime()
        );
      }
      if (sortBy === 'oldest') {
        return (
          new Date(a.metadata.taken_at || a.created_at).getTime() -
          new Date(b.metadata.taken_at || b.created_at).getTime()
        );
      }
      if (sortBy === 'duration') {
        return (b.metadata.duration || 0) - (a.metadata.duration || 0);
      }
      if (sortBy === 'size') {
        return b.file_size - a.file_size;
      }
      return 0;
    });
  }, [videos, searchQuery, filterFavorites, sortBy]);

  return (
    <AppLayout>
      <motion.div
        variants={staggerEditorial}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Header & Controls */}
        <motion.div
          variants={itemFadeUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-photon-border"
        >
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
              <Film className="h-3.5 w-3.5" />
              <span>Cinematic Film & Clips</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Motion Archive
            </h1>
            <p className="text-xs font-mono text-photon-muted mt-1">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'film negative' : 'film negatives'} &bull; In-browser hardware accelerated playback
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            <button
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full border transition-colors ${
                filterFavorites
                  ? 'border-accent-crimson/50 bg-accent-crimson/10 text-accent-crimson'
                  : 'border-photon-border bg-photon-card text-photon-light hover:text-white'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${filterFavorites ? 'fill-accent-crimson' : ''}`} />
              <span>Favorites</span>
            </button>

            <div className="flex items-center space-x-1.5 bg-photon-card border border-photon-border rounded-full px-3.5 py-1.5 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-photon-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-photon-light focus:outline-none text-xs font-sans"
              >
                <option value="newest">Chronological (Newest)</option>
                <option value="oldest">Chronological (Oldest)</option>
                <option value="duration">Longest Length</option>
                <option value="size">Largest Resolution</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Video Grid */}
        <motion.div variants={itemFadeUp}>
          <MediaGrid
            media={filteredVideos}
            emptyMessage="No motion negatives in vault"
            emptySubtext="Ingest MP4, WebM, or QuickTime clips to build your cinema reel."
          />
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
