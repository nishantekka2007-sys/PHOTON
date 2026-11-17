'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaFile } from '@/types';
import { useMedia } from '@/lib/context/media-context';
import { MediaLightbox } from './MediaLightbox';
import { formatDuration } from '@/lib/media/metadata';
import { 
  Heart, 
  Check, 
  Play, 
  Trash2, 
  Download, 
  FolderPlus, 
  X,
  Upload,
  Layers,
  Maximize2
} from 'lucide-react';
import { staggerFast, photoReveal } from '@/lib/motion';

interface MediaGridProps {
  media: MediaFile[];
  title?: string;
  emptyMessage?: string;
  emptySubtext?: string;
  onOpenUpload?: () => void;
}

export function MediaGrid({
  media,
  title,
  emptyMessage = 'No photographs in this collection',
  emptySubtext = 'Ingest your media to begin curating this exhibition.',
  onOpenUpload,
}: MediaGridProps) {
  const {
    toggleFavorite,
    moveToTrash,
    selectedIds,
    toggleSelect,
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
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-photon-border rounded-3xl bg-photon-dark/50">
        <div className="h-16 w-16 rounded-3xl border border-photon-border bg-photon-card flex items-center justify-center text-photon-muted mb-4 shadow-inner">
          <Layers className="h-7 w-7 stroke-1" />
        </div>
        <h3 className="font-serif text-2xl font-normal text-white">
          {emptyMessage}
        </h3>
        <p className="text-xs font-sans text-photon-light max-w-sm mt-1.5 mb-6 font-light">
          {emptySubtext}
        </p>
        {onOpenUpload && (
          <button
            onClick={onOpenUpload}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-photon-ivory hover:bg-white text-photon-obsidian text-xs font-mono tracking-wider uppercase font-semibold shadow-soft transition-all active:scale-[0.98]"
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Ingest Media</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {title && (
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-photon-border">
          <h2 className="font-serif text-2xl font-normal text-white">{title}</h2>
          <span className="text-xs font-mono text-photon-muted">
            {media.length} {media.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      )}

      {/* Progressive Staggered Media Grid */}
      <motion.div
        variants={staggerFast}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
      >
        {media.map((item) => {
          const isSelected = selectedIds.includes(item.id);

          return (
            <motion.div
              key={item.id}
              variants={photoReveal}
              className={`group relative aspect-square rounded-2xl overflow-hidden bg-photon-card border transition-all duration-300 cursor-pointer select-none ${
                isSelected
                  ? 'border-white ring-2 ring-white/40'
                  : 'border-photon-border/80 hover:border-photon-subtle'
              }`}
            >
              {/* Media Thumbnail */}
              {item.thumbnail_url || item.data_url ? (
                <img
                  src={item.thumbnail_url || item.data_url}
                  alt={item.filename}
                  loading="lazy"
                  onClick={() => setActiveLightboxMedia(item)}
                  className="h-full w-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                />
              ) : (
                <div
                  onClick={() => setActiveLightboxMedia(item)}
                  className="h-full w-full flex items-center justify-center text-photon-muted"
                >
                  <Layers className="h-8 w-8 stroke-1" />
                </div>
              )}

              {/* Video Play Pill */}
              {item.media_type === 'video' && (
                <div className="absolute bottom-2.5 left-2.5 flex items-center space-x-1 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-white text-[10px] font-mono pointer-events-none border border-white/10">
                  <Play className="h-2.5 w-2.5 fill-white" />
                  <span>{formatDuration(item.metadata.duration)}</span>
                </div>
              )}

              {/* Floating Hover Controls */}
              <div
                className={`absolute inset-x-0 top-0 p-2.5 flex items-center justify-between transition-opacity duration-200 ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                style={{
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)',
                }}
              >
                {/* Selection Checkbox */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(item.id);
                  }}
                  className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-white border-white text-photon-obsidian'
                      : 'bg-black/50 border-white/50 text-transparent hover:border-white'
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                </button>

                {/* Favorite Action */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(item.id);
                  }}
                  className={`p-1.5 rounded-full bg-black/50 backdrop-blur-md transition-colors ${
                    item.is_favorite
                      ? 'text-accent-crimson'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Heart className={`h-3.5 w-3.5 ${item.is_favorite ? 'fill-accent-crimson' : ''}`} />
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Floating Monograph Batch Toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 lg:bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-3 px-5 py-3 rounded-full bg-photon-dark/95 text-white border border-photon-border shadow-cinema backdrop-blur-2xl text-xs font-mono"
          >
            <span className="pr-3 border-r border-photon-border font-semibold text-photon-light">
              {selectedIds.length} chosen
            </span>

            {/* Add to Monograph */}
            <div className="relative">
              <button
                onClick={() => setShowAlbumPicker(!showAlbumPicker)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-photon-card hover:bg-photon-border transition-colors uppercase tracking-wider text-[11px]"
              >
                <FolderPlus className="h-3.5 w-3.5 text-accent-gold" />
                <span>Assign Monograph</span>
              </button>

              {showAlbumPicker && (
                <div className="absolute bottom-full mb-3 left-0 w-52 rounded-2xl bg-photon-dark border border-photon-border shadow-cinema py-2 text-xs z-50">
                  <p className="px-3.5 py-1 text-[10px] font-mono text-photon-muted uppercase tracking-wider">
                    Select Collection
                  </p>
                  {albums.length === 0 ? (
                    <p className="px-3.5 py-2 text-photon-muted italic text-[11px]">No collections created</p>
                  ) : (
                    albums.map((alb) => (
                      <button
                        key={alb.id}
                        onClick={() => handleAddToAlbum(alb.id)}
                        className="w-full text-left px-3.5 py-1.5 hover:bg-photon-card text-white truncate transition-colors"
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
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-photon-card hover:bg-photon-border transition-colors uppercase tracking-wider text-[11px]"
              title="Download originals"
            >
              <Download className="h-3.5 w-3.5 text-accent-titanium" />
              <span>Export</span>
            </button>

            <button
              onClick={() => moveToTrash(selectedIds)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-accent-crimson/20 text-accent-crimson hover:bg-accent-crimson/30 transition-colors uppercase tracking-wider text-[11px]"
              title="Move to trash"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Archive</span>
            </button>

            <button
              onClick={clearSelection}
              className="p-1 rounded-full text-photon-muted hover:text-white"
              title="Clear selection"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cinematic Fullscreen Lightbox */}
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
