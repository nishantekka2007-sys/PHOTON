'use client';

import React, { useState, useMemo } from 'react';
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
  ArrowRight,
  FolderPlus,
  Trash2,
  ShieldCheck
} from 'lucide-react';

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
    setSuccessNote(`Successfully organized ${screenshots.length} screenshot(s) into the "Screenshots" album.`);
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
      <div className="space-y-6">
        {/* Header */}
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center space-x-2 text-indigo-500 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smart Organization Engine</span>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Intelligent Media Categorization
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Local browser heuristic analysis. Find clutter, organize albums, and isolate heavy files without cloud tracking.
          </p>
        </div>

        {successNote && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Categories Tab Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setActiveTab('screenshots')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              activeTab === 'screenshots'
                ? 'bg-white dark:bg-zinc-900 border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Crop className="h-5 w-5 text-indigo-500" />
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold">
                {screenshots.length}
              </span>
            </div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Screenshots
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Device captures and temporary notes
            </p>
          </button>

          <button
            onClick={() => setActiveTab('large_videos')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              activeTab === 'large_videos'
                ? 'bg-white dark:bg-zinc-900 border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Film className="h-5 w-5 text-violet-500" />
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-50 dark:bg-violet-950 text-violet-600 dark:text-violet-400 font-semibold">
                {largeVideos.length}
              </span>
            </div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Large Videos (&gt; 15 MB)
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              High resolution clips occupying heavy space
            </p>
          </button>

          <button
            onClick={() => setActiveTab('unorganized')}
            className={`p-4 rounded-2xl text-left border transition-all ${
              activeTab === 'unorganized'
                ? 'bg-white dark:bg-zinc-900 border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                : 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <FolderMinus className="h-5 w-5 text-amber-500" />
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 font-semibold">
                {unorganized.length}
              </span>
            </div>
            <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              Unassigned Media
            </h3>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Photos & videos not placed in any album
            </p>
          </button>
        </div>

        {/* Tab Specific Content */}
        {activeTab === 'screenshots' && (
          <div className="space-y-4">
            {screenshots.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {screenshots.length} screenshot(s) found taking {formatBytes(screenshots.reduce((a, b) => a + b.file_size, 0))}
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleMoveScreenshotsToAlbum}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
                  >
                    <FolderPlus className="h-3.5 w-3.5" />
                    <span>Move to &ldquo;Screenshots&rdquo; Album</span>
                  </button>
                  <button
                    onClick={handleTrashAllScreenshots}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 font-medium"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Clean All</span>
                  </button>
                </div>
              </div>
            )}
            <MediaGrid
              media={screenshots}
              emptyMessage="No screenshots detected"
              emptySubtext="Your library is free of screen captures and temporary screenshots."
            />
          </div>
        )}

        {activeTab === 'large_videos' && (
          <div className="space-y-4">
            <MediaGrid
              media={largeVideos}
              emptyMessage="No large videos found"
              emptySubtext="All your videos are optimized under 15 megabytes."
            />
          </div>
        )}

        {activeTab === 'unorganized' && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Select any of these unassigned files to batch-move them into albums.
            </p>
            <MediaGrid
              media={unorganized}
              emptyMessage="All media organized"
              emptySubtext="Every photo and video has been assigned to a collection!"
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
