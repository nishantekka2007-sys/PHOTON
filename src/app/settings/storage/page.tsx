'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { formatBytes } from '@/lib/media/metadata';
import { 
  HardDrive, 
  Image as ImageIcon, 
  Film, 
  Trash2, 
  ShieldCheck 
} from 'lucide-react';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

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
      <motion.div
        variants={staggerEditorial}
        initial="hidden"
        animate="show"
        className="max-w-3xl space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemFadeUp} className="pb-6 border-b border-photon-border">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
            <HardDrive className="h-3.5 w-3.5" />
            <span>Capacity Architecture</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
            Vault Quota & Allocation
          </h1>
          <p className="text-xs font-mono text-photon-muted mt-1">
            Verified storage consumption metrics and honest provider parameters
          </p>
        </motion.div>

        {/* Quota Overview Card */}
        <motion.div
          variants={itemFadeUp}
          className="p-6 sm:p-8 rounded-3xl bg-photon-card border border-photon-border shadow-soft space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <p className="text-xs font-mono text-photon-muted uppercase tracking-wider">
                Total Storage Consumed
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl font-normal text-white mt-1">
                {formatBytes(storageUsage.totalUsedBytes)}{' '}
                <span className="text-sm font-mono text-photon-muted">
                  / {formatBytes(storageUsage.maxQuotaBytes)}
                </span>
              </h2>
            </div>
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono border border-photon-border bg-photon-dark text-photon-light">
              {percentageUsed}% Capacity Consumed
            </span>
          </div>

          {/* Segmented Multi-Color Progress Bar */}
          <div className="h-2 w-full bg-photon-dark rounded-full overflow-hidden flex border border-photon-border">
            <div
              style={{ width: `${(storageUsage.photoBytes / storageUsage.maxQuotaBytes) * 100}%` }}
              className="bg-white transition-all duration-500"
              title={`Photos: ${formatBytes(storageUsage.photoBytes)}`}
            />
            <div
              style={{ width: `${(storageUsage.videoBytes / storageUsage.maxQuotaBytes) * 100}%` }}
              className="bg-accent-amber transition-all duration-500"
              title={`Videos: ${formatBytes(storageUsage.videoBytes)}`}
            />
            <div
              style={{ width: `${(storageUsage.trashBytes / storageUsage.maxQuotaBytes) * 100}%` }}
              className="bg-accent-crimson transition-all duration-500"
              title={`Trash: ${formatBytes(storageUsage.trashBytes)}`}
            />
          </div>

          {/* Itemized Allocation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-photon-dark border border-photon-border">
              <div className="flex items-center space-x-2 text-white mb-1.5 font-mono text-xs">
                <ImageIcon className="h-4 w-4" />
                <span>Photographs ({photoPercentage}%)</span>
              </div>
              <p className="font-serif text-2xl font-normal text-white">
                {formatBytes(storageUsage.photoBytes)}
              </p>
              <p className="text-[10px] font-mono text-photon-muted mt-0.5">{storageUsage.photoCount} negatives</p>
            </div>

            <div className="p-4 rounded-2xl bg-photon-dark border border-photon-border">
              <div className="flex items-center space-x-2 text-accent-amber mb-1.5 font-mono text-xs">
                <Film className="h-4 w-4" />
                <span>Motion Films ({videoPercentage}%)</span>
              </div>
              <p className="font-serif text-2xl font-normal text-white">
                {formatBytes(storageUsage.videoBytes)}
              </p>
              <p className="text-[10px] font-mono text-photon-muted mt-0.5">{storageUsage.videoCount} reels</p>
            </div>

            <div className="p-4 rounded-2xl bg-photon-dark border border-photon-border">
              <div className="flex items-center space-x-2 text-accent-crimson mb-1.5 font-mono text-xs">
                <Trash2 className="h-4 w-4" />
                <span>Archive Bin ({trashPercentage}%)</span>
              </div>
              <p className="font-serif text-2xl font-normal text-white">
                {formatBytes(storageUsage.trashBytes)}
              </p>
              <p className="text-[10px] font-mono text-photon-muted mt-0.5">{storageUsage.trashCount} archived</p>
            </div>
          </div>

          {storageUsage.trashBytes > 0 && (
            <div className="pt-2 flex justify-between items-center text-xs font-mono">
              <span className="text-photon-muted">
                Purging your archive bin will immediately liberate {formatBytes(storageUsage.trashBytes)}.
              </span>
              <Link
                href="/deleted"
                className="text-accent-crimson hover:underline uppercase tracking-wider font-semibold"
              >
                Inspect Bin &rarr;
              </Link>
            </div>
          )}
        </motion.div>

        {/* Free Tier Reality Card */}
        <motion.div
          variants={itemFadeUp}
          className="p-6 sm:p-8 rounded-3xl bg-photon-dark border border-photon-border text-xs space-y-4"
        >
          <div className="flex items-center space-x-2 text-white font-serif text-lg font-normal">
            <ShieldCheck className="h-5 w-5 text-accent-emerald" />
            <span>Honest Zero-Rupee Cloud & Sandbox Realities</span>
          </div>
          <p className="text-photon-light font-sans font-light leading-relaxed">
            PHOTON will never lure you with deceptive &ldquo;unlimited cloud storage&rdquo; promises. We adhere strictly to verified, open-access parameters:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-mono text-[11px] text-photon-muted">
            <li>
              <strong className="text-white">Supabase Free Tier:</strong> 1 GB storage bucket included at zero cost with 50MB single negative limit.
            </li>
            <li>
              <strong className="text-white">Browser IndexedDB Sandbox:</strong> Can store tens of gigabytes locally on your laptop or phone storage without internet connectivity.
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
