'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Heart, ArrowUpDown, Camera, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

function PhotosContent() {
  const searchParams = useSearchParams();
  const isFavoritesFromUrl = searchParams.get('favorites') === 'true';

  const { media, searchQuery } = useMedia();
  const [filterFavorites, setFilterFavorites] = useState(isFavoritesFromUrl);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'size' | 'filename'>('newest');
  const [selectedCamera, setSelectedCamera] = useState<string>('all');

  useEffect(() => {
    if (isFavoritesFromUrl) {
      setFilterFavorites(true);
    }
  }, [isFavoritesFromUrl]);

  const photos = useMemo(() => {
    return media.filter((m) => !m.is_deleted && m.media_type === 'image');
  }, [media]);

  const cameraModels = useMemo(() => {
    const set = new Set<string>();
    photos.forEach((p) => {
      if (p.metadata.camera_model) {
        set.add(p.metadata.camera_model);
      }
    });
    return Array.from(set);
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    let result = photos;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.filename.toLowerCase().includes(q) ||
          p.original_name.toLowerCase().includes(q) ||
          p.metadata.camera_model?.toLowerCase().includes(q) ||
          p.metadata.camera_make?.toLowerCase().includes(q)
      );
    }

    if (filterFavorites) {
      result = result.filter((p) => p.is_favorite);
    }

    if (selectedCamera !== 'all') {
      result = result.filter((p) => p.metadata.camera_model === selectedCamera);
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
      if (sortBy === 'size') {
        return b.file_size - a.file_size;
      }
      if (sortBy === 'filename') {
        return a.filename.localeCompare(b.filename);
      }
      return 0;
    });
  }, [photos, searchQuery, filterFavorites, selectedCamera, sortBy]);

  return (
    <motion.div
      variants={staggerEditorial}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header & Photographic Controls */}
      <motion.div
        variants={itemFadeUp}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-photon-border"
      >
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
            <Camera className="h-3.5 w-3.5" />
            <span>Master Archive</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
            {filterFavorites ? 'Favorite Photographs' : 'All Photographs'}
          </h1>
          <p className="text-xs font-mono text-photon-muted mt-1">
            {filteredPhotos.length} {filteredPhotos.length === 1 ? 'negative' : 'negatives'} &bull; IndexedDB sandboxed
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
          {/* Favorites Toggle */}
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-full border transition-colors ${
              filterFavorites
                ? 'border-accent-crimson bg-accent-crimson/15 text-accent-crimson font-medium'
                : 'border-photon-border bg-photon-card text-photon-muted hover:text-white'
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${filterFavorites ? 'fill-accent-crimson' : ''}`} />
            <span>Favorites</span>
          </button>

          {/* Camera Model Filter */}
          {cameraModels.length > 0 && (
            <div className="relative">
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="appearance-none rounded-full bg-photon-card border border-photon-border px-3.5 py-2 pr-8 text-xs text-photon-light focus:outline-none focus:border-white/40 cursor-pointer font-mono"
              >
                <option value="all">All Apparatus ({cameraModels.length})</option>
                {cameraModels.map((cam) => (
                  <option key={cam} value={cam}>
                    {cam}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-photon-muted text-[10px]">
                ▼
              </div>
            </div>
          )}

          {/* Sorting Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none rounded-full bg-photon-card border border-photon-border px-3.5 py-2 pr-8 text-xs text-photon-light focus:outline-none focus:border-white/40 cursor-pointer font-mono"
            >
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
              <option value="size">Sort: Size</option>
              <option value="filename">Sort: Name</option>
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-photon-muted text-[10px]">
              ▼
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Photographic Grid */}
      <MediaGrid
        media={filteredPhotos}
        emptyMessage={filterFavorites ? 'No favorite photographs flagged' : 'No photographs in vault'}
        emptySubtext={
          filterFavorites
            ? 'Mark photographs as favorite to quickly surface them here.'
            : 'Ingest raw camera negatives or pictures to populate your master archive.'
        }
      />
    </motion.div>
  );
}

export default function PhotosPage() {
  return (
    <AppLayout>
      <Suspense fallback={<div className="p-12 text-center text-xs font-mono text-photon-muted">Loading photographs...</div>}>
        <PhotosContent />
      </Suspense>
    </AppLayout>
  );
}
