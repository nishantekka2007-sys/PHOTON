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
  Maximize2,
  LayoutGrid,
  Columns,
  Camera
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
  const [layoutMode, setLayoutMode] = useState<'grid' | 'masonry'>('grid');

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
      {/* Grid Subheader & View Controls */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-photon-border">
        <div className="flex items-center space-x-3">
          {title && <h2 className="font-serif text-2xl font-normal text-white">{title}</h2>}
          <span className="text-xs font-mono text-photon-muted">
            {media.length} {media.length === 1 ? 'negative' : 'negatives'}
          </span>
        </div>

        {/* Layout Mode Toggle */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-photon-card border border-photon-border text-xs font-mono">
          <button
            type="button"
            onClick={() => setLayoutMode('grid')}
            title="Uniform Grid"
            className={`p-1.5 rounded-lg transition-colors ${
              layoutMode === 'grid'
                ? 'bg-white text-photon-obsidian shadow-sm'
                : 'text-photon-muted hover:text-white'
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setLayoutMode('masonry')}
            title="Editorial Masonry"
            className={`p-1.5 rounded-lg transition-colors ${
              layoutMode === 'masonry'
                ? 'bg-white text-photon-obsidian shadow-sm'
                : 'text-photon-muted hover:text-white'
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Render Mode: Uniform Grid vs Natural Masonry */}
      {layoutMode === 'grid' ? (
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

                {/* Camera Badge on Hover */}
                {item.metadata.camera_model && (
                  <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[9px] font-mono text-photon-light opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 truncate pointer-events-none">
                    <Camera className="h-2.5 w-2.5 text-accent-titanium shrink-0" />
                    <span className="truncate">{item.metadata.camera_make} {item.metadata.camera_model}</span>
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
      ) : (
        /* Editorial Masonry View with Natural Aspect Ratios */
        <motion.div
          variants={staggerFast}
          initial="hidden"
          animate="show"
          className="columns-2 sm:columns-3 md:columns-4 lg:columns-4 xl:columns-5 gap-3 sm:gap-4 space-y-3 sm:space-y-4"
        >
          {media.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <motion.div
                key={item.id}
                variants={photoReveal}
                className={`break-inside-avoid group relative rounded-2xl overflow-hidden bg-photon-card border transition-all duration-300 cursor-pointer select-none ${
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
                    className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                  />
                ) : (
                  <div
                    onClick={() => setActiveLightboxMedia(item)}
                    className="h-48 w-full flex items-center justify-center text-photon-muted"
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

                {/* Bottom Metadata Info */}
                <div className="p-2.5 bg-photon-dark/90 border-t border-photon-border/50 text-[10px] font-mono flex items-center justify-between text-photon-muted">
                  <span className="truncate font-sans text-photon-light">
                    {item.original_name || item.filename}
                  </span>
                  {item.metadata.f_number && (
                    <span className="shrink-0 text-accent-titanium">ƒ/{item.metadata.f_number}</span>
                  )}
                </div>

                {/* Floating Hover Controls */}
                <div
                  className={`absolute inset-x-0 top-0 p-2.5 flex items-center justify-between transition-opacity duration-200 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}
                  style={{
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%)',
                  }}
                >
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
      )}

      {/* Floating Monograph Batch Toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center space-x-3 px-5 py-3 rounded-full bg-photon-obsidian/95 border border-photon-subtle shadow-cinema backdrop-blur-xl text-xs font-mono"
          >
            <span className="text-white font-medium pr-2 border-r border-photon-border">
              {selectedIds.length} {selectedIds.length === 1 ? 'selected' : 'selected'}
            </span>

            <button
              onClick={() => setShowAlbumPicker(true)}
              className="flex items-center space-x-1.5 text-photon-light hover:text-white transition-colors"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>Bind Monograph</span>
            </button>

            <button
              onClick={handleDownloadBatch}
              className="flex items-center space-x-1.5 text-photon-light hover:text-white transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export</span>
            </button>

            <button
              onClick={() => {
                moveToTrash(selectedIds);
                clearSelection();
              }}
              className="flex items-center space-x-1.5 text-accent-crimson hover:text-red-400 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Archive</span>
            </button>

            <button
              onClick={clearSelection}
              className="p-1 rounded-full text-photon-muted hover:text-white transition-colors ml-2"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Album Picker Modal */}
      {showAlbumPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-photon-dark border border-photon-border p-6 shadow-cinema">
            <h3 className="font-serif text-xl font-normal text-white mb-1">
              Bind to Monograph
            </h3>
            <p className="text-xs font-sans text-photon-light mb-4 font-light">
              Select target publication for {selectedIds.length} negatives.
            </p>

            <div className="max-h-60 overflow-y-auto space-y-1 mb-5">
              {albums.length === 0 ? (
                <p className="text-xs font-mono text-photon-muted py-4 text-center">
                  No monographs created yet.
                </p>
              ) : (
                albums.map((album) => (
                  <button
                    key={album.id}
                    onClick={() => handleAddToAlbum(album.id)}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-photon-card transition-colors flex items-center justify-between text-xs font-sans"
                  >
                    <span className="text-white font-medium">{album.name}</span>
                    <span className="font-mono text-photon-muted text-[10px]">
                      {album.item_count} items
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowAlbumPicker(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-photon-muted hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Darkroom Inspection Drawer */}
      {activeLightboxMedia && (
        <MediaLightbox
          media={activeLightboxMedia}
          allMedia={media}
          onClose={() => setActiveLightboxMedia(null)}
          onNavigate={(item) => setActiveLightboxMedia(item)}
          onToggleFavorite={toggleFavorite}
          onMoveToTrash={(id) => {
            moveToTrash([id]);
            setActiveLightboxMedia(null);
          }}
        />
      )}
    </div>
  );
}
