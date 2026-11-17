'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaFile } from '@/types';
import { formatBytes, formatDuration } from '@/lib/media/metadata';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Heart,
  Trash2,
  Download,
  Info,
  Camera,
  MapPin,
  Calendar,
  Layers,
  Hash,
  ShieldCheck,
  Disc
} from 'lucide-react';

interface MediaLightboxProps {
  media: MediaFile | null;
  allMedia: MediaFile[];
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onMoveToTrash: (id: string) => void;
  onNavigate: (media: MediaFile) => void;
}

export function MediaLightbox({
  media,
  allMedia,
  onClose,
  onToggleFavorite,
  onMoveToTrash,
  onNavigate,
}: MediaLightboxProps) {
  const [showInfo, setShowInfo] = useState(false);

  // Keyboard navigation
  useEffect(() => {
    if (!media) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'i' || e.key === 'I') setShowInfo((prev) => !prev);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [media, allMedia]);

  if (!media) return null;

  const currentIndex = allMedia.findIndex((m) => m.id === media.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allMedia.length - 1;

  const handlePrev = () => {
    if (hasPrev) onNavigate(allMedia[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onNavigate(allMedia[currentIndex + 1]);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.data_url || media.thumbnail_url || '';
    link.download = media.original_name || media.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex bg-black text-white select-none backdrop-blur-3xl animate-in fade-in duration-200">
        {/* Main Darkroom Stage */}
        <div className="relative flex flex-1 flex-col items-center justify-between p-4 sm:p-6 h-full overflow-hidden">
          {/* Top Control Bar */}
          <div className="flex w-full items-center justify-between z-10 font-mono text-xs">
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="hidden sm:block">
                <p className="font-serif text-sm tracking-wide text-white truncate max-w-sm">
                  {media.filename}
                </p>
                <p className="text-[10px] text-zinc-400">
                  Plate {currentIndex + 1} of {allMedia.length} &bull; {formatBytes(media.file_size)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onToggleFavorite(media.id)}
                className={`p-2.5 rounded-full transition-colors ${
                  media.is_favorite
                    ? 'bg-accent-crimson/20 text-accent-crimson hover:bg-accent-crimson/30'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Favorite"
              >
                <Heart className={`h-4 w-4 ${media.is_favorite ? 'fill-accent-crimson' : ''}`} />
              </button>

              <button
                onClick={handleDownload}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Download original negative"
              >
                <Download className="h-4 w-4" />
              </button>

              <button
                onClick={() => setShowInfo(!showInfo)}
                className={`p-2.5 rounded-full transition-colors ${
                  showInfo ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
                title="Optics & EXIF (i)"
              >
                <Info className="h-4 w-4" />
              </button>

              <button
                onClick={() => {
                  onMoveToTrash(media.id);
                  onClose();
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-accent-crimson/80 text-white transition-colors"
                title="Move to trash"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Central Photographic Display */}
          <div className="relative flex flex-1 w-full items-center justify-center my-4 overflow-hidden">
            {media.media_type === 'video' ? (
              <video
                src={media.data_url || media.thumbnail_url}
                controls
                autoPlay
                className="max-h-full max-w-full rounded-xl shadow-2xl object-contain border border-white/5"
              />
            ) : (
              <img
                src={media.data_url || media.thumbnail_url}
                alt={media.filename}
                className="max-h-full max-w-full rounded-xl shadow-2xl object-contain border border-white/5"
              />
            )}

            {/* Left Navigator */}
            {hasPrev && (
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md transition-all active:scale-95"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Right Navigator */}
            {hasNext && (
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/10 backdrop-blur-md transition-all active:scale-95"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Mobile Bottom Counter */}
          <div className="sm:hidden text-center text-xs font-mono text-zinc-400 py-1">
            {media.filename} ({currentIndex + 1}/{allMedia.length})
          </div>
        </div>

        {/* Leica-Style Optics & EXIF Inspector Drawer */}
        <AnimatePresence>
          {showInfo && (
            <motion.aside
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-80 border-l border-zinc-900 bg-photon-dark/95 backdrop-blur-2xl p-6 flex flex-col overflow-y-auto text-xs font-mono select-text"
            >
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <h4 className="font-serif text-lg font-normal text-white flex items-center gap-2">
                  <Camera className="h-4 w-4 text-accent-gold" />
                  Optics & Parameters
                </h4>
                <button
                  onClick={() => setShowInfo(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5 space-y-5">
                {/* Camera / Optics Readout */}
                {(media.metadata.camera_make || media.metadata.camera_model) && (
                  <div>
                    <span className="text-[10px] tracking-widest text-zinc-500 uppercase block mb-2">
                      Apparatus
                    </span>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2">
                      <p className="font-serif text-base text-white">
                        {[media.metadata.camera_make, media.metadata.camera_model].filter(Boolean).join(' ')}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-300">
                        {media.metadata.focal_length && (
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase">Focal</span>
                            {media.metadata.focal_length}
                          </div>
                        )}
                        {media.metadata.f_number && (
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase">Aperture</span>
                            ƒ/{media.metadata.f_number}
                          </div>
                        )}
                        {media.metadata.exposure_time && (
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase">Shutter</span>
                            {media.metadata.exposure_time}
                          </div>
                        )}
                        {media.metadata.iso && (
                          <div>
                            <span className="text-zinc-500 block text-[9px] uppercase">ISO</span>
                            {media.metadata.iso}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Dimensions and File Specs */}
                <div>
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase block mb-2">
                    Negative Specification
                  </span>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Dimensions</span>
                      <span className="text-white">
                        {media.metadata.width ? `${media.metadata.width} × ${media.metadata.height} px` : 'Unknown'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">File Size</span>
                      <span className="text-white">{formatBytes(media.file_size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Format</span>
                      <span className="text-white uppercase">{media.mime_type.split('/')[1]}</span>
                    </div>
                    {media.metadata.duration && (
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Length</span>
                        <span className="text-white">{formatDuration(media.metadata.duration)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Capture Date */}
                <div>
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase block mb-2">
                    Timestamp
                  </span>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3.5 flex items-center space-x-3 text-[11px]">
                    <Calendar className="h-4 w-4 text-zinc-400 shrink-0" />
                    <div>
                      <p className="text-white">
                        {media.metadata.taken_at
                          ? new Date(media.metadata.taken_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Undated'}
                      </p>
                      <p className="text-zinc-500 text-[10px]">
                        {media.metadata.taken_at ? new Date(media.metadata.taken_at).toLocaleTimeString() : ''}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Geolocation */}
                {media.metadata.latitude !== undefined && media.metadata.longitude !== undefined && (
                  <div>
                    <span className="text-[10px] tracking-widest text-zinc-500 uppercase block mb-2">
                      Coordinates
                    </span>
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3.5 text-[11px]">
                      <div className="flex items-center space-x-2 text-accent-emerald mb-1">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="text-white font-medium">GPS Location</span>
                      </div>
                      <p className="text-zinc-400">
                        {media.metadata.latitude.toFixed(4)}°, {media.metadata.longitude.toFixed(4)}°
                      </p>
                      <a
                        href={`https://www.openstreetmap.org/?mlat=${media.metadata.latitude}&mlon=${media.metadata.longitude}#map=15/${media.metadata.latitude}/${media.metadata.longitude}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block text-accent-titanium hover:underline text-[10px] uppercase tracking-wider"
                      >
                        View on OpenStreetMap &rarr;
                      </a>
                    </div>
                  </div>
                )}

                {/* Cryptographic SHA-256 Digest */}
                <div>
                  <span className="text-[10px] tracking-widest text-zinc-500 uppercase block mb-2">
                    Cryptographic Integrity
                  </span>
                  <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3.5 space-y-2">
                    <div className="flex items-center space-x-1.5 text-accent-titanium">
                      <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
                      <span className="text-white text-[11px]">SHA-256 Digest</span>
                    </div>
                    <p className="text-[9px] text-zinc-400 break-all bg-black p-2 rounded-xl border border-zinc-800/80">
                      {media.sha256_hash}
                    </p>
                    {media.phash && (
                      <>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block pt-1">
                          dHash (64-bit Perceptual)
                        </span>
                        <p className="text-[9px] text-zinc-400 bg-black p-2 rounded-xl border border-zinc-800/80">
                          {media.phash}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}
