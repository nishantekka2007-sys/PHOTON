'use client';

import React from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { formatBytes } from '@/lib/media/metadata';
import { 
  HardDrive, 
  Image as ImageIcon, 
  Film, 
  Trash2, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function StoragePage() {
  const { storageUsage } = useMedia();

  const percentageUsed = Math.min(
    100,
    Math.round((storageUsage.totalUsedBytes / storageUsage.maxQuotaBytes) * 100)
  );

  const photoPercentage = storageUsage.totalUsedBytes > 0
    ? Math.round((storageUsage.photoBytes / storageUsage.totalUsedBytes) * 100)
    : 0;

  const videoPercentage = storageUsage.totalUsedBytes > 0
    ? Math.round((storageUsage.videoBytes / storageUsage.totalUsedBytes) * 100)
    : 0;

  const trashPercentage = storageUsage.totalUsedBytes > 0
    ? Math.round((storageUsage.trashBytes / storageUsage.totalUsedBytes) * 100)
    : 0;

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-indigo-500" />
            Storage Quota & Breakdown
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Transparent reporting of your actual media usage and provider limits
          </p>
        </div>

        {/* Quota Overview Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Total Storage Consumed</p>
              <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {formatBytes(storageUsage.totalUsedBytes)}{' '}
                <span className="text-sm font-normal text-zinc-400">
                  / {formatBytes(storageUsage.maxQuotaBytes)}
                </span>
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 self-start sm:self-auto">
              {percentageUsed}% Quota Used
            </span>
          </div>

          {/* Segmented Multi-Color Progress Bar */}
          <div className="h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(storageUsage.photoBytes / storageUsage.maxQuotaBytes) * 100}%` }}
              className="bg-indigo-500 transition-all duration-500"
              title={`Photos: ${formatBytes(storageUsage.photoBytes)}`}
            />
            <div
              style={{ width: `${(storageUsage.videoBytes / storageUsage.maxQuotaBytes) * 100}%` }}
              className="bg-violet-500 transition-all duration-500"
              title={`Videos: ${formatBytes(storageUsage.videoBytes)}`}
            />
            <div
              style={{ width: `${(storageUsage.trashBytes / storageUsage.maxQuotaBytes) * 100}%` }}
              className="bg-rose-500 transition-all duration-500"
              title={`Trash: ${formatBytes(storageUsage.trashBytes)}`}
            />
          </div>

          {/* Legend and Itemized Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/50">
              <div className="flex items-center space-x-2 text-indigo-500 mb-1">
                <ImageIcon className="h-4 w-4" />
                <span className="text-xs font-bold">Photos ({photoPercentage}%)</span>
              </div>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatBytes(storageUsage.photoBytes)}
              </p>
              <p className="text-[11px] text-zinc-400">{storageUsage.photoCount} files</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/50">
              <div className="flex items-center space-x-2 text-violet-500 mb-1">
                <Film className="h-4 w-4" />
                <span className="text-xs font-bold">Videos ({videoPercentage}%)</span>
              </div>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatBytes(storageUsage.videoBytes)}
              </p>
              <p className="text-[11px] text-zinc-400">{storageUsage.videoCount} files</p>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/50">
              <div className="flex items-center space-x-2 text-rose-500 mb-1">
                <Trash2 className="h-4 w-4" />
                <span className="text-xs font-bold">Trash ({trashPercentage}%)</span>
              </div>
              <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {formatBytes(storageUsage.trashBytes)}
              </p>
              <p className="text-[11px] text-zinc-400">{storageUsage.trashCount} files</p>
            </div>
          </div>

          {storageUsage.trashBytes > 0 && (
            <div className="pt-2 flex justify-between items-center text-xs">
              <span className="text-zinc-500 dark:text-zinc-400">
                Emptying your trash will immediately reclaim {formatBytes(storageUsage.trashBytes)}.
              </span>
              <Link
                href="/deleted"
                className="text-rose-600 dark:text-rose-400 hover:underline font-semibold"
              >
                Go to Trash →
              </Link>
            </div>
          )}
        </div>

        {/* Free Tier Reality & Limits Card */}
        <div className="p-6 rounded-3xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 text-xs space-y-3">
          <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100 font-bold">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>Honest Free Tier Architecture</span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            PHOTON will never promise deceptive &ldquo;unlimited free cloud storage&rdquo;. We adhere strictly to verified free quotas:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-zinc-600 dark:text-zinc-300">
            <li>
              <strong>Supabase Free Plan:</strong> 1 GB storage bucket included for free with 50MB single file size limit.
            </li>
            <li>
              <strong>Local IndexedDB Mode:</strong> Can store dozens of gigabytes locally on your device depending on your hard drive capacity.
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
