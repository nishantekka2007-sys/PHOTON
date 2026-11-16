'use client';

import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { Heart, Filter, ArrowUpDown, Camera } from 'lucide-react';

export default function PhotosPage() {
  const { media, searchQuery } = useMedia();
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'size'>('newest');
  const [selectedCamera, setSelectedCamera] = useState<string>('all');

  const photos = useMemo(() => {
    return media.filter((m) => !m.is_deleted && m.media_type === 'image');
  }, [media]);

  // Extract unique camera models
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
      <div className="space-y-6">
        {/* Header & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              All Photos
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {filteredPhotos.length} {filteredPhotos.length === 1 ? 'photo' : 'photos'} in your private library
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Favorites Filter Toggle */}
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

            {/* Camera Model Dropdown */}
            {cameraModels.length > 0 && (
              <div className="flex items-center space-x-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-1 text-xs">
                <Camera className="h-3.5 w-3.5 text-zinc-400" />
                <select
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="bg-transparent text-zinc-700 dark:text-zinc-300 focus:outline-none text-xs"
                >
                  <option value="all">All Cameras</option>
                  {cameraModels.map((cam) => (
                    <option key={cam} value={cam}>
                      {cam}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-2.5 py-1 text-xs">
              <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-zinc-700 dark:text-zinc-300 focus:outline-none text-xs"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="size">Largest size</option>
              </select>
            </div>
          </div>
        </div>

        {/* Photos Grid */}
        <MediaGrid
          media={filteredPhotos}
          emptyMessage="No photos found"
          emptySubtext="Upload JPEG, PNG, WEBP, or HEIC images to build your private photo gallery."
        />
      </div>
    </AppLayout>
  );
}
