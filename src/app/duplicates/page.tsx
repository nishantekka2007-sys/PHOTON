'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { formatBytes } from '@/lib/media/metadata';
import { 
  CopyCheck, 
  Trash2, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { DuplicateGroup, MediaFile } from '@/types';

export default function DuplicatesPage() {
  const { findDuplicates, moveToTrash } = useMedia();
  const [selectedTab, setSelectedTab] = useState<'exact' | 'similar'>('exact');
  const [successNote, setSuccessNote] = useState('');

  const { exact, similar } = findDuplicates();
  const currentGroups = selectedTab === 'exact' ? exact : similar;

  const totalExactSavings = exact.reduce((acc, g) => acc + g.potentialSavingsBytes, 0);
  const totalSimilarSavings = similar.reduce((acc, g) => acc + g.potentialSavingsBytes, 0);

  const handleResolveGroupKeepNewest = async (group: DuplicateGroup) => {
    // Sort descending by date, keep first, trash the rest
    const sorted = [...group.files].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const toTrash = sorted.slice(1).map((f) => f.id);
    await moveToTrash(toTrash);
    setSuccessNote(`Saved ${formatBytes(group.potentialSavingsBytes)} by keeping the latest image.`);
    setTimeout(() => setSuccessNote(''), 3000);
  };

  const handleResolveAllExact = async () => {
    if (exact.length === 0) return;
    if (confirm(`Automatically remove older duplicates across all ${exact.length} exact duplicate groups?`)) {
      const allToTrash: string[] = [];
      exact.forEach((g) => {
        const sorted = [...g.files].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        allToTrash.push(...sorted.slice(1).map((f) => f.id));
      });
      await moveToTrash(allToTrash);
      setSuccessNote(`Cleaned all exact duplicates! Saved ${formatBytes(totalExactSavings)}.`);
      setTimeout(() => setSuccessNote(''), 4000);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center space-x-2 text-indigo-500 text-xs font-semibold uppercase tracking-wider mb-1">
              <CopyCheck className="h-3.5 w-3.5" />
              <span>Deduplication & Perceptual Scanner</span>
            </div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              Duplicate & Similar Photos
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Client-side cryptographic SHA-256 and 64-bit dHash perceptual analysis.
            </p>
          </div>

          {selectedTab === 'exact' && exact.length > 0 && (
            <button
              onClick={handleResolveAllExact}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Auto-Resolve All Exact ({formatBytes(totalExactSavings)})</span>
            </button>
          )}
        </div>

        {successNote && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          <button
            onClick={() => setSelectedTab('exact')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              selectedTab === 'exact'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>Exact Duplicates (SHA-256)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {exact.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedTab('similar')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium transition-colors ${
              selectedTab === 'similar'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <span>Similar Photos (Perceptual Hash)</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {similar.length}
            </span>
          </button>
        </div>

        {/* Duplicate Groups List */}
        {currentGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="h-16 w-16 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
              <CheckCircle2 className="h-8 w-8 text-emerald-500 stroke-1" />
            </div>
            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              No {selectedTab === 'exact' ? 'exact duplicates' : 'similar photos'} detected
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-5">
              Your media library is perfectly optimized and free of redundant files.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {currentGroups.map((group, gIdx) => (
              <div
                key={group.hash + gIdx}
                className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow-sm"
              >
                {/* Group Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                      Group #{gIdx + 1}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-semibold border border-indigo-200 dark:border-indigo-900">
                      {group.similarityPercentage}% Match
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      • {group.files.length} items • Recoverable: {formatBytes(group.potentialSavingsBytes)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleResolveGroupKeepNewest(group)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
                  >
                    <span>Keep Latest (Trash {group.files.length - 1})</span>
                  </button>
                </div>

                {/* Side by side comparison */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {group.files.map((file, fIdx) => (
                    <div
                      key={file.id}
                      className="rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-2.5 flex flex-col justify-between"
                    >
                      <div className="aspect-square w-full rounded-xl overflow-hidden mb-2 relative bg-zinc-200 dark:bg-zinc-900">
                        <img
                          src={file.thumbnail_url || file.data_url}
                          alt={file.filename}
                          className="h-full w-full object-cover"
                        />
                        {fIdx === 0 && (
                          <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                            Original / Newest
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 text-[11px]">
                        <p className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">
                          {file.filename}
                        </p>
                        <p className="text-zinc-500 dark:text-zinc-400">
                          {formatBytes(file.file_size)}
                          {file.metadata.width && ` • ${file.metadata.width}×${file.metadata.height}`}
                        </p>
                        <p className="text-[10px] text-zinc-400">
                          {new Date(file.metadata.taken_at || file.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 flex justify-end">
                        <button
                          onClick={() => moveToTrash([file.id])}
                          className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                          title="Trash this specific copy"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
