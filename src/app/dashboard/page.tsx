'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/context/auth-context';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { formatBytes } from '@/lib/media/metadata';
import {
  Sparkles,
  Upload,
  FolderPlus,
  CopyCheck,
  HardDrive,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  Film
} from 'lucide-react';

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
  const duplicates = findDuplicates();
  const totalDuplicateIssues = duplicates.exact.length + duplicates.similar.length;
  const potentialSavings = [...duplicates.exact, ...duplicates.similar].reduce(
    (acc, d) => acc + d.potentialSavingsBytes,
    0
  );

  // Latest activity for "Continue where you left off"
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
      <div className="space-y-6">
        {/* Welcome Back & Personal Memory Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900 via-zinc-900 to-indigo-950/40 border border-zinc-800 p-6 sm:p-8">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Personal Memory System</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.full_name || 'Member'}!
              </h1>
              <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl">
                Continue exactly where you left off. Your memories are encrypted and isolated under strict Row Level Security.
              </p>

              {/* Continue Where You Left Off Prompt */}
              {latestActivity ? (
                <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/80 text-xs text-zinc-300">
                  <Clock className="h-3.5 w-3.5 text-indigo-400" />
                  <span>
                    <strong>Last session:</strong> {latestActivity.title} (
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
                <div className="mt-4 inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/80 text-xs text-zinc-300">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>New session initialized. Upload photos or videos to begin.</span>
                </div>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors"
              >
                <FolderPlus className="h-4 w-4 text-indigo-400" />
                <span>New Album</span>
              </button>
              <Link
                href="/smart-organize"
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                <span>Smart Organize</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Real Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Photos</span>
              <ImageIcon className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {storageUsage.photoCount}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              {formatBytes(storageUsage.photoBytes)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Videos</span>
              <Film className="h-4 w-4 text-violet-500" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {storageUsage.videoCount}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              {formatBytes(storageUsage.videoBytes)}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Albums</span>
              <Layers className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {albums.length}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              Organized collections
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <div className="flex items-center justify-between text-zinc-400 mb-2">
              <span className="text-xs font-medium">Duplicates</span>
              <CopyCheck className="h-4 w-4 text-rose-500" />
            </div>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              {totalDuplicateIssues}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              {potentialSavings > 0 ? `${formatBytes(potentialSavings)} recoverable` : 'Library clean'}
            </p>
          </div>
        </div>

        {/* Action Prompt if duplicates detected */}
        {totalDuplicateIssues > 0 && (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
            <div className="flex items-center space-x-3">
              <CopyCheck className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-bold">
                  {totalDuplicateIssues} duplicate or similar image groups detected
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  You can free up ~{formatBytes(potentialSavings)} of storage by deduplicating.
                </p>
              </div>
            </div>
            <Link
              href="/duplicates"
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-sm transition-colors shrink-0"
            >
              Review Now →
            </Link>
          </div>
        )}

        {/* Albums Preview Section */}
        {albums.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Your Albums</h2>
              <Link
                href="/albums"
                className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <span>View all ({albums.length})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {albums.slice(0, 4).map((album) => (
                <Link
                  key={album.id}
                  href={`/albums/${album.id}`}
                  className="group rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 hover:border-zinc-400 dark:hover:border-zinc-700 transition-all shadow-sm"
                >
                  <div className="aspect-video w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 overflow-hidden mb-2 relative">
                    {album.cover_url ? (
                      <img
                        src={album.cover_url}
                        alt={album.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-zinc-400">
                        <Layers className="h-6 w-6 stroke-1" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {album.name}
                  </h3>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                    {album.item_count} {album.item_count === 1 ? 'item' : 'items'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recently Added Media */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">Recently Added</h2>
            <Link
              href="/photos"
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Explore all media</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <MediaGrid
            media={recentMedia}
            emptyMessage="No media uploaded yet"
            emptySubtext="Drag and drop photos or videos using the Upload button to start preserving your memories."
          />
        </div>
      </div>

      {/* Create Album Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Create New Album
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Organize your memories into private custom collections.
            </p>
            <form onSubmit={handleCreateAlbum} className="space-y-3">
              <input
                type="text"
                autoFocus
                required
                value={newAlbumName}
                onChange={(e) => setNewAlbumName(e.target.value)}
                placeholder="Album name (e.g., Summer Trip, Family)"
                className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
