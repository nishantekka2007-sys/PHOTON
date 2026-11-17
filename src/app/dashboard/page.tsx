'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/context/auth-context';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { formatBytes } from '@/lib/media/metadata';
import {
  Compass,
  Upload,
  FolderPlus,
  CopyCheck,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Camera,
  Plus,
  Sparkles,
  MapPin,
  Heart,
  SlidersHorizontal,
  Image as ImageIcon,
  Film,
  FolderKanban,
  Info
} from 'lucide-react';
import { spatialFadeUp, staggerCascade, springTactile } from '@/lib/motion';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    media,
    albums,
    activities,
    storageUsage,
    findDuplicates,
    createAlbum,
    loadSampleExhibitionData,
    clearSampleData,
    isLoading,
  } = useMedia();

  const [newAlbumName, setNewAlbumName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  const activeMedia = media.filter((m) => !m.is_deleted);
  const heroMedia = activeMedia.length > 0 ? activeMedia[0] : null;

  const duplicates = findDuplicates();
  const totalDuplicateIssues = duplicates.exact.length + duplicates.similar.length;
  const potentialSavings = [...duplicates.exact, ...duplicates.similar].reduce(
    (acc, d) => acc + d.potentialSavingsBytes,
    0
  );

  const latestActivity = activities.length > 0 ? activities[0] : null;

  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    await createAlbum(newAlbumName.trim());
    setNewAlbumName('');
    setShowCreateModal(false);
  };

  return (
    <AppLayout onOpenUpload={() => setUploadModalOpen(true)}>
      <motion.div
        variants={staggerCascade}
        initial="hidden"
        animate="show"
        className="space-y-10 pb-12"
      >
        {/* Welcome & Curator Continuity Ribbon */}
        <motion.div variants={spatialFadeUp} className="border-b border-photon-border pb-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
                <Compass className="h-3.5 w-3.5" />
                <span>Personal Studio Workspace</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-photon-ivory tracking-tight">
                Welcome back, {user?.full_name || 'Curator'}.
              </h1>
              <p className="mt-2 text-xs sm:text-sm font-sans text-warm-700 max-w-xl font-light">
                Your sovereign photography collection. Every negative, resolution profile, and EXIF tag is preserved with bit-exact fidelity.
              </p>

              {/* Continuity Pill */}
              {latestActivity ? (
                <div className="mt-4 inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full border border-photon-border bg-photon-card/80 text-[11px] font-mono text-warm-700">
                  <Clock className="h-3 w-3 text-accent-titanium" />
                  <span>
                    Resume where you left off &bull;{' '}
                    <span className="text-photon-ivory font-medium">{latestActivity.title}</span> (
                    {new Date(latestActivity.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    )
                  </span>
                </div>
              ) : (
                <div className="mt-4 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-photon-border bg-photon-card/80 text-[11px] font-mono text-warm-600">
                  <ShieldCheck className="h-3 w-3 text-accent-emerald" />
                  <span>Local IndexedDB Sandbox &bull; Private & Offline-ready</span>
                </div>
              )}
            </div>

            {/* Quick Action Controls */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <Link
                href="/smart-organize"
                className="px-5 py-2.5 rounded-full border border-photon-border bg-photon-card text-warm-700 hover:text-photon-ivory hover:border-photon-subtle transition-all flex items-center space-x-2 uppercase tracking-wider"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
                <span>Spatial Studio</span>
              </Link>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 rounded-full border border-photon-border bg-photon-card hover:bg-photon-border text-warm-700 hover:text-photon-ivory transition-colors flex items-center space-x-2 uppercase tracking-wider"
              >
                <FolderPlus className="h-3.5 w-3.5" />
                <span>New Collection</span>
              </button>
              <button
                onClick={() => {
                  const uploadBtn = document.querySelector('header button[aria-label="Add Media"], header button:has(svg.stroke-\\[2\\.5\\])') as HTMLButtonElement | null;
                  if (uploadBtn) uploadBtn.click();
                  else {
                    const fallbackInput = document.createElement('input');
                    fallbackInput.type = 'file';
                    fallbackInput.multiple = true;
                    fallbackInput.accept = 'image/*,video/*';
                    fallbackInput.click();
                  }
                }}
                className="px-5 py-2.5 rounded-full bg-photon-ivory hover:bg-white text-photon-obsidian font-semibold transition-all shadow-soft flex items-center space-x-2 active:scale-95 uppercase tracking-wider"
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Add Media</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Minimalist Exhibition Status Ribbon */}
        <motion.div
          variants={spatialFadeUp}
          className="grid grid-cols-2 sm:grid-cols-4 border border-photon-border rounded-2xl bg-photon-dark divide-x divide-photon-border text-center overflow-hidden"
        >
          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono tracking-widest text-warm-600 uppercase block">Photographs</span>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-photon-ivory mt-1 block">
              {storageUsage.photoCount}
            </span>
            <span className="text-[10px] font-mono text-warm-600 mt-0.5 block">
              {formatBytes(storageUsage.photoBytes)}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono tracking-widest text-warm-600 uppercase block">Motion Films</span>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-photon-ivory mt-1 block">
              {storageUsage.videoCount}
            </span>
            <span className="text-[10px] font-mono text-warm-600 mt-0.5 block">
              {formatBytes(storageUsage.videoBytes)}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono tracking-widest text-warm-600 uppercase block">Collections</span>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-photon-ivory mt-1 block">
              {albums.length}
            </span>
            <span className="text-[10px] font-mono text-warm-600 mt-0.5 block">Monographs</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono tracking-widest text-warm-600 uppercase block">Storage Usage</span>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-photon-ivory mt-1 block">
              {formatBytes(storageUsage.totalUsedBytes)}
            </span>
            <span className="text-[10px] font-mono text-accent-emerald mt-0.5 block">
              {totalDuplicateIssues > 0 ? `${totalDuplicateIssues} duplicates` : '100% Unique'}
            </span>
          </div>
        </motion.div>

        {/* Empty State vs Real Photographic Content */}
        {activeMedia.length === 0 ? (
          <motion.div
            variants={spatialFadeUp}
            className="flex flex-col items-center justify-center py-20 px-6 text-center border border-dashed border-photon-border rounded-3xl bg-photon-dark/60 space-y-5"
          >
            <div className="h-16 w-16 rounded-3xl border border-photon-border bg-photon-card flex items-center justify-center text-warm-600 shadow-inner">
              <Camera className="h-8 w-8 stroke-1 text-accent-gold" />
            </div>
            <div className="max-w-md">
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-photon-ivory">
                Your studio is waiting for memories
              </h2>
              <p className="text-xs sm:text-sm font-sans text-warm-700 mt-2 font-light leading-relaxed">
                Ingest your RAW camera files, JPEGs, PNGs, or motion clips to begin curating your collection. Files are processed privately in your local browser sandbox.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 text-xs font-mono">
              <button
                onClick={() => {
                  const uploadBtn = document.querySelector('header button[aria-label="Add Media"], header button:has(svg.stroke-\\[2\\.5\\])') as HTMLButtonElement | null;
                  if (uploadBtn) uploadBtn.click();
                }}
                className="px-6 py-3 rounded-full bg-photon-ivory hover:bg-white text-photon-obsidian font-semibold transition-all shadow-soft flex items-center gap-2 uppercase tracking-wider"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Upload Photographs</span>
              </button>

              <button
                onClick={() => loadSampleExhibitionData()}
                className="px-6 py-3 rounded-full border border-photon-border bg-photon-card/80 text-warm-700 hover:text-photon-ivory hover:border-photon-subtle transition-all flex items-center gap-2 uppercase tracking-wider"
              >
                <Sparkles className="h-4 w-4 text-accent-gold" />
                <span>Load Sample Exhibition Plates</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Hero Photographic Canvas / "Negative of the Moment" */}
            {heroMedia && (
              <motion.div
                variants={spatialFadeUp}
                className="relative rounded-3xl overflow-hidden border border-photon-border bg-photon-dark group shadow-cinema"
              >
                <div className="aspect-[16/9] sm:aspect-[21/9] w-full bg-black relative overflow-hidden">
                  <img
                    src={heroMedia.data_url || heroMedia.thumbnail_url}
                    alt={heroMedia.filename}
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-accent-gold border border-accent-gold/30 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-gold animate-pulse" />
                      Featured Negative Plate
                    </span>
                    {heroMedia.is_favorite && (
                      <span className="p-1.5 rounded-full bg-black/60 backdrop-blur-md text-accent-crimson border border-white/10">
                        <Heart className="h-3.5 w-3.5 fill-current" />
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-4xl text-photon-ivory font-normal leading-tight">
                        {heroMedia.original_name || heroMedia.filename}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-warm-700 mt-1">
                        {heroMedia.metadata.camera_model && (
                          <span className="flex items-center gap-1">
                            <Camera className="h-3 w-3 text-accent-titanium" />
                            {heroMedia.metadata.camera_make} {heroMedia.metadata.camera_model}
                          </span>
                        )}
                        {heroMedia.metadata.f_number && (
                          <span>ƒ/{heroMedia.metadata.f_number}</span>
                        )}
                        {heroMedia.metadata.exposure_time && (
                          <span>{heroMedia.metadata.exposure_time}</span>
                        )}
                        {heroMedia.metadata.focal_length && (
                          <span>{heroMedia.metadata.focal_length}</span>
                        )}
                        {heroMedia.metadata.iso && (
                          <span>ISO {heroMedia.metadata.iso}</span>
                        )}
                        {heroMedia.metadata.latitude && heroMedia.metadata.longitude && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-accent-emerald" />
                            {heroMedia.metadata.latitude.toFixed(4)}° N, {heroMedia.metadata.longitude.toFixed(4)}° E
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-accent-emerald uppercase border border-accent-emerald/40 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md">
                        SHA-256 Bit-Exact
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Curated Physical Monographs Strip */}
            {albums.length > 0 && (
              <motion.div variants={spatialFadeUp} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-normal text-photon-ivory">Monographs & Collections</h2>
                    <p className="text-xs font-mono text-warm-600 mt-0.5">Curated thematic series</p>
                  </div>
                  <Link
                    href="/albums"
                    className="text-xs font-mono text-warm-700 hover:text-photon-ivory uppercase tracking-wider flex items-center gap-1 transition-colors"
                  >
                    <span>View All ({albums.length})</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {albums.slice(0, 4).map((album) => (
                    <Link
                      key={album.id}
                      href={`/albums/${album.id}`}
                      className="group rounded-3xl overflow-hidden border border-photon-border bg-photon-card p-3 hover:border-photon-subtle transition-all duration-300 flex flex-col justify-between"
                    >
                      <div className="aspect-[4/3] w-full rounded-2xl bg-photon-dark overflow-hidden mb-3 relative border border-white/5">
                        {album.cover_url ? (
                          <img
                            src={album.cover_url}
                            alt={album.name}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-warm-600">
                            <Layers className="h-6 w-6 stroke-1" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-photon-ivory truncate font-normal group-hover:text-accent-gold transition-colors">
                          {album.name}
                        </h3>
                        <p className="text-[10px] font-mono text-warm-600 mt-0.5">
                          {album.item_count} {album.item_count === 1 ? 'negative' : 'negatives'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Master Exhibition Gallery */}
            <motion.div variants={spatialFadeUp} className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-photon-border">
                <div>
                  <h2 className="font-serif text-2xl font-normal text-photon-ivory">Master Gallery Archive</h2>
                  <p className="text-xs font-mono text-warm-600 mt-0.5">Inspect all negatives in your personal vault</p>
                </div>
                <Link
                  href="/photos"
                  className="text-xs font-mono text-warm-700 hover:text-photon-ivory uppercase tracking-wider flex items-center gap-1 transition-colors"
                >
                  <span>All Photos ({activeMedia.length})</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <MediaGrid
                media={activeMedia}
                emptyMessage="Vault is waiting for photographs"
                emptySubtext="Drag and drop raw camera files to start populating your master gallery."
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Monograph Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-photon-dark border border-photon-border p-6 shadow-cinema">
            <h3 className="font-serif text-xl font-normal text-photon-ivory mb-1">
              Create New Collection
            </h3>
            <p className="text-xs font-sans text-warm-700 mb-5 font-light">
              Create a dedicated photographic monograph or album.
            </p>
            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <input
                type="text"
                autoFocus
                required
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="Collection title (e.g. Kyoto Series 2026)"
                className="w-full rounded-xl bg-photon-card border border-photon-border px-3.5 py-2.5 text-xs text-photon-ivory placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors"
              />
              <div className="flex justify-end space-x-2 pt-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 rounded-lg text-warm-600 hover:text-photon-ivory transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-photon-ivory hover:bg-white text-photon-obsidian font-semibold transition-colors uppercase tracking-wider"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
