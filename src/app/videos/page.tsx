'use client';

import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Heart, ArrowUpDown, Film } from 'lucide-react';

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
      <div className="space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Film className="h-5 w-5 text-indigo-500" />
              All Videos
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'} with in-browser thumbnail generation
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterFavorites(!filterFavorites)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                filterFavorites
                  ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <Heart className={`h-3.5 w-3.5 ${filterFavorites ? 'fill-rose-500' : ''}`} />
              <span>Favorites</span>
            </button>

            <div className="flex items-center space-x-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-1 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-zinc-700 dark:text-zinc-300 focus:outline-none text-xs"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="duration">Longest duration</option>
                <option value="size">Largest size</option>
              </select>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <MediaGrid
          media={filteredVideos}
          emptyMessage="No videos uploaded yet"
          emptySubtext="Upload MP4, WebM, or MOV video clips to playback and preserve your video archives."
        />
      </div>
    </AppLayout>
  );
}
