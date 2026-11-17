'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Heart, ArrowUpDown, Camera } from 'lucide-react';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

export default function PhotosPage() {
  const { media, searchQuery } = useMedia();
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'size'>('newest');
  const [selectedCamera, setSelectedCamera] = useState<string>('all');

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
      return 0;
    });
  }, [photos, searchQuery, filterFavorites, selectedCamera, sortBy]);

  return (
    <AppLayout>
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
              <span>Negative Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Master Photographs
            </h1>
            <p className="text-xs font-mono text-photon-muted mt-1">
              {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photograph' : 'photographs'} &bull; IndexedDB sandboxed
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
            {/* Favorites Toggle */}
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

            {/* Camera Model Filter */}
            {cameraModels.length > 0 && (
              <div className="flex items-center space-x-1.5 bg-photon-card border border-photon-border rounded-full px-3.5 py-1.5 text-xs">
                <Camera className="h-3.5 w-3.5 text-photon-muted" />
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="bg-transparent text-photon-light focus:outline-none text-xs font-sans"
                >
                  <option value="all">All Apparatus</option>
                  {cameraModels.map((cam) => (
                    <option key={cam} value={cam}>
                      {cam}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sorting */}
            <div className="flex items-center space-x-1.5 bg-photon-card border border-photon-border rounded-full px-3.5 py-1.5 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-photon-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-photon-light focus:outline-none text-xs font-sans"
              >
                <option value="newest">Chronological (Newest)</option>
                <option value="oldest">Chronological (Oldest)</option>
                <option value="size">Largest Resolution</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Photos Grid */}
        <motion.div variants={itemFadeUp}>
          <MediaGrid
            media={filteredPhotos}
            emptyMessage="No photographs detected"
            emptySubtext="Ingest raw photographs to build your master exhibition."
          />
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
