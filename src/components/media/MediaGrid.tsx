'use client';

import React, { useState } from 'react';
import { MediaFile } from '@/types';
import { useMedia } from '@/lib/context/media-context';
import { MediaLightbox } from './MediaLightbox';
import { formatDuration, formatBytes } from '@/lib/media/metadata';
import { 
  Heart, 
  Check, 
  Play, 
  Trash2, 
  Download, 
  FolderPlus, 
  X,
  Upload,
  Calendar,
  Layers
} from 'lucide-react';

interface MediaGridProps {
  media: MediaFile[];
  title?: string;
  emptyMessage?: string;
  emptySubtext?: string;
  onOpenUpload?: () => void;
  showAlbumAssignment?: boolean;
}

export function MediaGrid({
  media,
  title,
  emptyMessage = 'No media found',
  emptySubtext = 'Upload photos and videos to start organizing your memories.',
  onOpenUpload,
}: MediaGridProps) {
  const {
    toggleFavorite,
    moveToTrash,
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    albums,
    addMediaToAlbum,
  } = useMedia();

  const [activeLightboxMedia, setActiveLightboxMedia] = useState<MediaFile | null>(null);
  const [showAlbumPicker, setShowAlbumPicker] = useState(false);

  const handleDownloadBatch = () => {
    selectedIds.forEach((id) => {
      const item = media.find((m) => m.id === id);
      if (item && (item.data_url || item.thumbnail_url)) {
        const link = document.createElement('a');
        link.href = item.data_url || item.thumbnail_url || '';
        link.download = item.original_name || item.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  const handleAddToAlbum = (albumId: string) => {
    addMediaToAlbum(selectedIds, albumId);
    setShowAlbumPicker(false);
    clearSelection();
  };

  if (media.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="h-16 w-16 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
          <Layers className="h-8 w-8 stroke-1" />
        </div>
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
          {emptyMessage}
        </h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-5">
          {emptySubtext}
        </p>
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Your First File</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{title}</h2>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {media.length} {media.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      )}

      {/* Grid of media cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {media.map((item) => {
          const isSelected = selectedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`group relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border transition-all cursor-pointer select-none ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/50'
                  : 'border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-400 dark:hover:border-zinc-600 shadow-sm'
              }`}
            >
              {/* Media Thumbnail */}
              {item.thumbnail_url || item.data_url ? (
                <img
                  src={item.thumbnail_url || item.data_url}
                  alt={item.filename}
                  loading="lazy"
                  onClick={() => setActiveLightboxMedia(item)}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div
                  onClick={() => setActiveLightboxMedia(item)}
                  className="h-full w-full flex items-center justify-center text-zinc-400"
                >
                  <Layers className="h-8 w-8" />
                </div>
              )}

              {/* Video Badge */}
              {item.media_type === 'video' && (
                <div className="absolute bottom-2 left-2 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-medium pointer-events-none">
                  <Play className="h-2.5 w-2.5 fill-white" />
                  <span>{formatDuration(item.metadata.duration)}</span>
                </div>
              )}

              {/* Top Action Overlay (Select & Favorite) */}
              <div
                className={`absolute inset-x-0 top-0 p-2 flex items-center justify-between transition-opacity duration-200 ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)',
                }}
              >
                {/* Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item.id);
                  }}
                  className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'bg-black/40 border-white/60 text-transparent hover:border-white'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </button>

                {/* Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className={`p-1.5 rounded-full bg-black/40 backdrop-blur-sm transition-colors ${
                    item.is_favorite
                      ? 'text-rose-500'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${item.is_favorite ? 'fill-rose-500' : ''}`} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Batch Operations Toolbar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-16 lg:bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-3 px-4 py-2.5 rounded-2xl bg-zinc-900/95 text-white border border-zinc-700 shadow-2xl backdrop-blur-lg animate-in slide-in-from-bottom duration-200">
          <span className="text-xs font-semibold pr-2 border-r border-zinc-700">
            {selectedIds.length} selected
          </span>

          {/* Add to album trigger */}
          <div className="relative">
            <button
              onClick={() => setShowAlbumPicker(!showAlbumPicker)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              <FolderPlus className="h-3.5 w-3.5 text-indigo-400" />
              <span>Add to Album</span>
            </button>

            {showAlbumPicker && (
              <div className="absolute bottom-full mb-2 left-0 w-48 rounded-xl bg-zinc-900 border border-zinc-700 shadow-xl py-1 text-xs z-50">
                <p className="px-3 py-1 text-[10px] text-zinc-400 uppercase font-semibold">
                  Select Album
                </p>
                {albums.length === 0 ? (
                  <p className="px-3 py-2 text-zinc-500 italic">No albums created yet</p>
                ) : (
                  albums.map((alb) => (
                    <button
                      key={alb.id}
                      onClick={() => handleAddToAlbum(alb.id)}
                      className="w-full text-left px-3 py-1.5 hover:bg-zinc-800 text-zinc-200"
                    >
                      {alb.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleDownloadBatch}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-zinc-800 hover:bg-zinc-700 transition-colors"
            title="Download original files"
          >
            <Download className="h-3.5 w-3.5 text-emerald-400" />
            <span>Download</span>
          </button>

          <button
            onClick={() => moveToTrash(selectedIds)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-rose-950/60 text-rose-300 hover:bg-rose-900/80 transition-colors"
            title="Move selected to trash"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Trash</span>
          </button>

          <button
            onClick={clearSelection}
            className="p-1 rounded-lg text-zinc-400 hover:text-white"
            title="Deselect all"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Lightbox Modal */}
      <MediaLightbox
        media={activeLightboxMedia}
        allMedia={media}
        onClose={() => setActiveLightboxMedia(null)}
        onToggleFavorite={toggleFavorite}
        onMoveToTrash={(id) => moveToTrash([id])}
        onNavigate={(nextItem) => setActiveLightboxMedia(nextItem)}
      />
    </div>
  );
}
