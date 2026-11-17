'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
  CheckCircle2
} from 'lucide-react';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    media,
    albums,
    activities,
    storageUsage,
    findDuplicates,
    createAlbum,
  } = useMedia();

  const [newAlbumName, setNewAlbumName] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const activeMedia = media.filter((m) => !m.is_deleted);
  const recentMedia = activeMedia.slice(0, 10);
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
    <AppLayout>
      <motion.div
        variants={staggerEditorial}
        initial="hidden"
        animate="show"
        className="space-y-10"
      >
        {/* Editorial Welcome & Sanctuary Header */}
        <motion.div variants={itemFadeUp} className="border-b border-photon-border pb-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-2">
                <Compass className="h-3.5 w-3.5" />
                <span>Personal Memory Vault</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight">
                Welcome back, {user?.full_name || 'Curator'}.
              </h1>
              <p className="mt-2 text-xs sm:text-sm font-sans text-photon-light max-w-xl font-light">
                Your sovereign photography collection. Every negative, resolution profile, and EXIF tag is preserved with bit-exact fidelity.
              </p>

              {/* Memory Continuity Badge */}
              {latestActivity ? (
                <div className="mt-4 inline-flex items-center space-x-2.5 px-3.5 py-1.5 rounded-full border border-photon-border bg-photon-card/80 text-[11px] font-mono text-photon-light">
                  <Clock className="h-3 w-3 text-accent-titanium" />
                  <span>
                    Continue where you left off &bull;{' '}
                    <span className="text-white font-medium">{latestActivity.title}</span> (
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
                <div className="mt-4 inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-photon-border bg-photon-card/80 text-[11px] font-mono text-photon-muted">
                  <ShieldCheck className="h-3 w-3 text-accent-emerald" />
                  <span>Session initialized in local sandbox. Add media to begin.</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-3 text-xs font-mono">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2.5 rounded-full border border-photon-border bg-photon-card/60 hover:bg-photon-card text-photon-light hover:text-white transition-colors flex items-center space-x-2"
              >
                <FolderPlus className="h-3.5 w-3.5" />
                <span>New Monograph</span>
              </button>
              <Link
                href="/smart-organize"
                className="px-5 py-2.5 rounded-full bg-photon-ivory hover:bg-white text-photon-obsidian font-semibold transition-all shadow-soft flex items-center space-x-2 active:scale-95 uppercase tracking-wider"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Curation Studio</span>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Minimalist Exhibition Status Ribbon */}
        <motion.div
          variants={itemFadeUp}
          className="grid grid-cols-2 sm:grid-cols-4 border border-photon-border rounded-2xl bg-photon-dark divide-x divide-photon-border text-center overflow-hidden"
        >
          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono tracking-widest text-photon-muted uppercase block">Photographs</span>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-white mt-1 block">
              {storageUsage.photoCount}
            </span>
            <span className="text-[10px] font-mono text-photon-muted mt-0.5 block">
              {formatBytes(storageUsage.photoBytes)}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono tracking-widest text-photon-muted uppercase block">Motion Films</span>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-white mt-1 block">
              {storageUsage.videoCount}
            </span>
            <span className="text-[10px] font-mono text-photon-muted mt-0.5 block">
              {formatBytes(storageUsage.videoBytes)}
            </span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono tracking-widest text-photon-muted uppercase block">Monographs</span>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-white mt-1 block">
              {albums.length}
            </span>
            <span className="text-[10px] font-mono text-photon-muted mt-0.5 block">Collections</span>
          </div>

          <div className="p-4 sm:p-5">
            <span className="text-[10px] font-mono tracking-widest text-photon-muted uppercase block">Vault Status</span>
            <span className="font-serif text-2xl sm:text-3xl font-normal text-white mt-1 block">
              {formatBytes(storageUsage.totalUsedBytes)}
            </span>
            <span className="text-[10px] font-mono text-accent-emerald mt-0.5 block">
              {totalDuplicateIssues > 0 ? `${totalDuplicateIssues} duplicates` : '100% Deduplicated'}
            </span>
          </div>
        </motion.div>

        {/* Duplicate Notice Banner if duplicates exist */}
        {totalDuplicateIssues > 0 && (
          <motion.div
            variants={itemFadeUp}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-accent-amber/40 bg-accent-amber/5 text-xs font-mono"
          >
            <div className="flex items-center space-x-3">
              <CopyCheck className="h-5 w-5 text-accent-amber shrink-0" />
              <div>
                <p className="text-white font-semibold">
                  {totalDuplicateIssues} duplicate or burst image groups identified
                </p>
                <p className="text-photon-light mt-0.5 font-sans font-light">
                  Reclaim approximately {formatBytes(potentialSavings)} using perceptual difference hashing.
                </p>
              </div>
            </div>
            <Link
              href="/duplicates"
              className="px-4 py-2 rounded-full bg-accent-amber hover:bg-amber-400 text-photon-obsidian font-semibold uppercase tracking-wider shrink-0 transition-colors"
            >
              Review Diff &rarr;
            </Link>
          </motion.div>
        )}

        {/* Curated Albums / Physical Monograph Preview */}
        {albums.length > 0 && (
          <motion.div variants={itemFadeUp} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-2xl font-normal text-white">Monographs & Series</h2>
                <p className="text-xs font-mono text-photon-muted mt-0.5">Physical-inspired photo collections</p>
              </div>
              <Link
                href="/albums"
                className="text-xs font-mono text-photon-light hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <span>View All ({albums.length})</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {albums.slice(0, 4).map((album) => (
                <Link
                  key={album.id}
                  href={`/albums/${album.id}`}
                  className="group rounded-2xl overflow-hidden border border-photon-border bg-photon-card p-3 hover:border-photon-subtle transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[4/3] w-full rounded-xl bg-photon-dark overflow-hidden mb-3 relative border border-white/5">
                    {album.cover_url ? (
                      <img
                        src={album.cover_url}
                        alt={album.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-photon-muted">
                        <Layers className="h-6 w-6 stroke-1" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-serif text-base text-white truncate font-normal group-hover:text-accent-gold transition-colors">
                      {album.name}
                    </h3>
                    <p className="text-[10px] font-mono text-photon-muted mt-0.5">
                      {album.item_count} {album.item_count === 1 ? 'photograph' : 'photographs'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Acquisitions Exhibition Grid */}
        <motion.div variants={itemFadeUp} className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl font-normal text-white">Recent Acquisitions</h2>
              <p className="text-xs font-mono text-photon-muted mt-0.5">Freshly ingested into the vault</p>
            </div>
            <Link
              href="/photos"
              className="text-xs font-mono text-photon-light hover:text-white uppercase tracking-wider flex items-center gap-1 transition-colors"
            >
              <span>Explore Master Library</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <MediaGrid
            media={recentMedia}
            emptyMessage="Vault is waiting for your photographs"
            emptySubtext="Drag and drop RAW, JPEG, PNG, or video negatives to start organizing your memories."
          />
        </motion.div>
      </motion.div>

      {/* Monograph Creation Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-photon-dark border border-photon-border p-6 shadow-cinema">
            <h3 className="font-serif text-xl font-normal text-white mb-1">
              Create New Monograph
            </h3>
            <p className="text-xs font-sans text-photon-light mb-5 font-light">
              Create a dedicated photographic collection.
            </p>
            <form onSubmit={handleCreateAlbum} className="space-y-4">
              <input
                type="text"
                autoFocus
                required
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="Monograph title (e.g. Kyoto 2026)"
                className="w-full rounded-xl bg-photon-card border border-photon-border px-3.5 py-2.5 text-xs text-white placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors"
              />
              <div className="flex justify-end space-x-2 pt-2 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 rounded-lg text-photon-muted hover:text-white transition-colors"
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
