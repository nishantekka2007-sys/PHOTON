'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { formatBytes } from '@/lib/media/metadata';
import { 
  Sparkles, 
  Crop, 
  Film, 
  FolderMinus, 
  CheckCircle2, 
  FolderPlus,
  Trash2
} from 'lucide-react';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

export default function SmartOrganizePage() {
  const { media, albums, createAlbum, addMediaToAlbum, moveToTrash } = useMedia();
  const [activeTab, setActiveTab] = useState<'screenshots' | 'large_videos' | 'unorganized'>('screenshots');
  const [successNote, setSuccessNote] = useState('');

  const activeMedia = useMemo(() => media.filter((m) => !m.is_deleted), [media]);

  // 1. Detect Screenshots
  const screenshots = useMemo(() => {
    return activeMedia.filter((m) => {
      const name = m.filename.toLowerCase();
      const isNamedScreenshot =
        name.includes('screenshot') ||
        name.includes('screen shot') ||
        name.includes('screencap') ||
        name.includes('captura');
      return isNamedScreenshot && m.media_type === 'image';
    });
  }, [activeMedia]);

  // 2. Large Videos (> 15 MB)
  const largeVideos = useMemo(() => {
    return activeMedia
      .filter((m) => m.media_type === 'video' && m.file_size > 15 * 1024 * 1024)
      .sort((a, b) => b.file_size - a.file_size);
  }, [activeMedia]);

  // 3. Unorganized media (no album assigned)
  const unorganized = useMemo(() => {
    return activeMedia.filter((m) => !m.album_id);
  }, [activeMedia]);

  const handleMoveScreenshotsToAlbum = async () => {
    if (screenshots.length === 0) return;
    let target = albums.find((a) => a.name.toLowerCase() === 'screenshots');
    if (!target) {
      target = await createAlbum('Screenshots', 'Auto-organized device screen captures');
    }
    await addMediaToAlbum(
      screenshots.map((s) => s.id),
      target.id
    );
    setSuccessNote(`Organized ${screenshots.length} screenshot(s) into the "Screenshots" monograph.`);
    setTimeout(() => setSuccessNote(''), 4000);
  };

  const handleTrashAllScreenshots = async () => {
    if (confirm(`Move all ${screenshots.length} detected screenshots to Trash?`)) {
      await moveToTrash(screenshots.map((s) => s.id));
      setSuccessNote(`Moved ${screenshots.length} screenshot(s) to trash.`);
      setTimeout(() => setSuccessNote(''), 4000);
    }
  };

  return (
    <AppLayout>
      <motion.div
        variants={staggerEditorial}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemFadeUp} className="pb-6 border-b border-photon-border">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Studio Engine</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
            Intelligent Curation
          </h1>
          <p className="text-xs font-mono text-photon-muted mt-1">
            Browser heuristic analysis: identify temporary captures, heavy motion reels, and uncataloged negatives
          </p>
        </motion.div>

        {successNote && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-xs font-mono flex items-center gap-2"
          >
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successNote}</span>
          </motion.div>
        )}

        {/* Categories Tab Selector */}
        <motion.div variants={itemFadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`p-5 rounded-3xl text-left border transition-all ${
              activeTab === 'screenshots'
                ? 'bg-photon-card border-white text-white shadow-soft'
                : 'bg-photon-dark/60 border-photon-border text-photon-light hover:border-photon-subtle'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Crop className="h-5 w-5 text-accent-titanium" />
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-photon-border bg-photon-dark">
                {screenshots.length} items
              </span>
            </div>
            <h3 className="font-serif text-lg font-normal text-white">
              Device Captures
            </h3>
            <p className="text-xs font-sans text-photon-muted mt-1 font-light">
              Screenshots and ephemeral screen recordings
            </p>
          </button>

          <button
            onClick={() => setActiveTab('large_videos')}
            className={`p-5 rounded-3xl text-left border transition-all ${
              activeTab === 'large_videos'
                ? 'bg-photon-card border-white text-white shadow-soft'
                : 'bg-photon-dark/60 border-photon-border text-photon-light hover:border-photon-subtle'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Film className="h-5 w-5 text-accent-amber" />
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-photon-border bg-photon-dark">
                {largeVideos.length} items
              </span>
            </div>
            <h3 className="font-serif text-lg font-normal text-white">
              Heavy Motion Reels
            </h3>
            <p className="text-xs font-sans text-photon-muted mt-1 font-light">
              Clips exceeding 15 MB in resolution
            </p>
          </button>

          <button
            onClick={() => setActiveTab('unorganized')}
            className={`p-5 rounded-3xl text-left border transition-all ${
              activeTab === 'unorganized'
                ? 'bg-photon-card border-white text-white shadow-soft'
                : 'bg-photon-dark/60 border-photon-border text-photon-light hover:border-photon-subtle'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <FolderMinus className="h-5 w-5 text-accent-gold" />
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full border border-photon-border bg-photon-dark">
                {unorganized.length} items
              </span>
            </div>
            <h3 className="font-serif text-lg font-normal text-white">
              Unassigned Negatives
            </h3>
            <p className="text-xs font-sans text-photon-muted mt-1 font-light">
              Master negatives not yet bound to a monograph
            </p>
          </button>
        </motion.div>

        {/* Tab Specific Content */}
        {activeTab === 'screenshots' && (
          <div className="space-y-5">
            {screenshots.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-photon-card border border-photon-border text-xs font-mono">
                <span className="text-photon-light">
                  {screenshots.length} screenshot(s) occupying {formatBytes(screenshots.reduce((a, b) => a + b.file_size, 0))}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleMoveScreenshotsToAlbum}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-photon-ivory text-photon-obsidian font-semibold uppercase tracking-wider"
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                    <span>Assign to &ldquo;Screenshots&rdquo;</span>
                  </button>
                  <button
                    onClick={handleTrashAllScreenshots}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-accent-crimson/40 bg-accent-crimson/10 text-accent-crimson uppercase tracking-wider"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Archive All</span>
                  </button>
                </div>
              </div>
            )}
            <MediaGrid
              media={screenshots}
              emptyMessage="No device screenshots identified"
              emptySubtext="Your library is pristine and free of ephemeral captures."
            />
          </div>
        )}

        {activeTab === 'large_videos' && (
          <div className="space-y-4">
            <MediaGrid
              media={largeVideos}
              emptyMessage="No heavy motion negatives identified"
              emptySubtext="All video files are optimized below the 15 megabyte boundary."
            />
          </div>
        )}

        {activeTab === 'unorganized' && (
          <div className="space-y-4">
            <p className="text-xs font-mono text-photon-muted">
              Select negatives below to assign them into physical monographs.
            </p>
            <MediaGrid
              media={unorganized}
              emptyMessage="All negatives curated"
              emptySubtext="Every single photograph and video has been bound to a monograph collection!"
            />
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
