'use client';

import React, { useState, useEffect } from 'react';
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
  Maximize2
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
    <div className="fixed inset-0 z-50 flex bg-black/95 text-white backdrop-blur-md select-none animate-in fade-in duration-150">
      {/* Main Viewport */}
      <div className="relative flex flex-1 flex-col items-center justify-between p-4 h-full">
        {/* Top Control Bar */}
        <div className="flex w-full items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Close (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold truncate max-w-xs">{media.filename}</p>
              <p className="text-[11px] text-zinc-400">
                {currentIndex + 1} of {allMedia.length}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleFavorite(media.id)}
              className={`p-2 rounded-full transition-colors ${
                media.is_favorite
                  ? 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Favorite"
            >
              <Heart className={`h-5 w-5 ${media.is_favorite ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={handleDownload}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Download original"
            >
              <Download className="h-5 w-5" />
            </button>

            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-full transition-colors ${
                showInfo ? 'bg-indigo-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title="Info & EXIF"
            >
              <Info className="h-5 w-5" />
            </button>

            <button
              onClick={() => {
                onMoveToTrash(media.id);
                onClose();
              }}
              className="p-2 rounded-full bg-white/10 hover:bg-rose-600/80 text-white transition-colors"
              title="Move to trash"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Media Center Stage */}
        <div className="relative flex flex-1 w-full items-center justify-center my-2 overflow-hidden">
          {media.media_type === 'video' ? (
            <video
              src={media.data_url || media.thumbnail_url}
              controls
              autoPlay
              className="max-h-full max-w-full rounded-lg shadow-2xl object-contain"
            />
          ) : (
            <img
              src={media.data_url || media.thumbnail_url}
              alt={media.filename}
              className="max-h-full max-w-full rounded-lg shadow-2xl object-contain transition-all"
            />
          )}

          {/* Left Arrow */}
          {hasPrev && (
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 transition-all active:scale-95"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          )}

          {/* Right Arrow */}
          {hasNext && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/10 transition-all active:scale-95"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          )}
        </div>

        {/* Bottom Filename on Mobile */}
        <div className="sm:hidden text-center text-xs text-zinc-400 py-1">
          {media.filename} ({currentIndex + 1}/{allMedia.length})
        </div>
      </div>

      {/* Info / EXIF Inspector Drawer */}
      {showInfo && (
        <aside className="w-80 border-l border-zinc-800 bg-zinc-900/90 backdrop-blur-lg p-5 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
            <h4 className="text-sm font-semibold flex items-center gap-2">
              <Info className="h-4 w-4 text-indigo-400" />
              Media Information
            </h4>
            <button
              onClick={() => setShowInfo(false)}
              className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4 text-xs">
            {/* File info */}
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                File Details
              </p>
              <div className="bg-zinc-800/50 rounded-xl p-3 space-y-2 border border-zinc-800">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Name</span>
                  <span className="font-medium truncate max-w-[150px]">{media.original_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Size</span>
                  <span className="font-medium">{formatBytes(media.file_size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Format</span>
                  <span className="font-medium uppercase">{media.mime_type.split('/')[1]}</span>
                </div>
                {media.metadata.width && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Dimensions</span>
                    <span className="font-medium">
                      {media.metadata.width} × {media.metadata.height}
                    </span>
                  </div>
                )}
                {media.metadata.duration && (
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Duration</span>
                    <span className="font-medium">{formatDuration(media.metadata.duration)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Date Taken */}
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                Timeline
              </p>
              <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-800 flex items-center space-x-2.5">
                <Calendar className="h-4 w-4 text-indigo-400 shrink-0" />
                <div>
                  <p className="font-medium">
                    {media.metadata.taken_at
                      ? new Date(media.metadata.taken_at).toLocaleDateString(undefined, {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'Unknown date'}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {media.metadata.taken_at
                      ? new Date(media.metadata.taken_at).toLocaleTimeString()
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Camera / EXIF */}
            {(media.metadata.camera_make || media.metadata.camera_model) && (
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                  Camera & Optics
                </p>
                <div className="bg-zinc-800/50 rounded-xl p-3 space-y-2 border border-zinc-800">
                  <div className="flex items-center space-x-2 text-indigo-400 mb-1">
                    <Camera className="h-4 w-4" />
                    <span className="font-semibold text-white">
                      {[media.metadata.camera_make, media.metadata.camera_model].filter(Boolean).join(' ')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-700/50 text-[11px]">
                    {media.metadata.focal_length && (
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Focal</span>
                        {media.metadata.focal_length}
                      </div>
                    )}
                    {media.metadata.f_number && (
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Aperture</span>
                        ƒ/{media.metadata.f_number}
                      </div>
                    )}
                    {media.metadata.exposure_time && (
                      <div>
                        <span className="text-zinc-400 block text-[10px]">Exposure</span>
                        {media.metadata.exposure_time}
                      </div>
                    )}
                    {media.metadata.iso && (
                      <div>
                        <span className="text-zinc-400 block text-[10px]">ISO</span>
                        {media.metadata.iso}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Location */}
            {media.metadata.latitude !== undefined && media.metadata.longitude !== undefined && (
              <div>
                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                  GPS Location
                </p>
                <div className="bg-zinc-800/50 rounded-xl p-3 border border-zinc-800">
                  <div className="flex items-center space-x-2 text-emerald-400 mb-1">
                    <MapPin className="h-4 w-4" />
                    <span className="font-semibold text-white">Coordinates</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 font-mono">
                    {media.metadata.latitude.toFixed(4)}°, {media.metadata.longitude.toFixed(4)}°
                  </p>
                  <a
                    href={`https://www.openstreetmap.org/?mlat=${media.metadata.latitude}&mlon=${media.metadata.longitude}#map=15/${media.metadata.latitude}/${media.metadata.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-indigo-400 hover:underline text-[11px]"
                  >
                    View on OpenStreetMap →
                  </a>
                </div>
              </div>
            )}

            {/* Cryptographic Integrity */}
            <div>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider mb-1">
                Cryptographic Integrity
              </p>
              <div className="bg-zinc-800/50 rounded-xl p-3 space-y-2 border border-zinc-800">
                <div className="flex items-center space-x-1.5 text-indigo-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="font-medium text-white text-[11px]">SHA-256 Checksum</span>
                </div>
                <p className="text-[10px] text-zinc-400 font-mono break-all bg-black/40 p-1.5 rounded-lg border border-zinc-800">
                  {media.sha256_hash}
                </p>
                {media.phash && (
                  <>
                    <span className="text-zinc-400 block text-[10px] pt-1">
                      Perceptual Hash (dHash)
                    </span>
                    <p className="text-[10px] text-zinc-400 font-mono bg-black/40 p-1.5 rounded-lg border border-zinc-800">
                      {media.phash}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
