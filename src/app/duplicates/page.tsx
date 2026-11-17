'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { formatBytes } from '@/lib/media/metadata';
import { 
  CopyCheck, 
  Trash2, 
  CheckCircle2, 
  Layers
} from 'lucide-react';
import { DuplicateGroup } from '@/types';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

export default function DuplicatesPage() {
  const { findDuplicates, moveToTrash } = useMedia();
  const [selectedTab, setSelectedTab] = useState<'exact' | 'similar'>('exact');
  const [successNote, setSuccessNote] = useState('');

  const { exact, similar } = findDuplicates();
  const currentGroups = selectedTab === 'exact' ? exact : similar;

  const totalExactSavings = exact.reduce((acc, g) => acc + g.potentialSavingsBytes, 0);

  const handleResolveGroupKeepNewest = async (group: DuplicateGroup) => {
    const sorted = [...group.files].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    const toTrash = sorted.slice(1).map((f) => f.id);
    await moveToTrash(toTrash);
    setSuccessNote(`Reclaimed ${formatBytes(group.potentialSavingsBytes)} by preserving the master negative.`);
    setTimeout(() => setSuccessNote(''), 3000);
  };

  const handleResolveAllExact = async () => {
    if (exact.length === 0) return;
    if (confirm(`Automatically remove older redundant negatives across all ${exact.length} exact duplicate groups?`)) {
      const allToTrash: string[] = [];
      exact.forEach((g) => {
        const sorted = [...g.files].sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        allToTrash.push(...sorted.slice(1).map((f) => f.id));
      });
      await moveToTrash(allToTrash);
      setSuccessNote(`All exact duplicates resolved. Reclaimed ${formatBytes(totalExactSavings)}.`);
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
        <motion.div
          variants={itemFadeUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-photon-border"
        >
          <div>
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
              <CopyCheck className="h-3.5 w-3.5" />
              <span>Deduplication & Optics Diff</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Duplicate & Burst Inspection
            </h1>
            <p className="text-xs font-mono text-photon-muted mt-1">
              Client-side cryptographic SHA-256 binary check and 64-bit dHash perceptual matrix
            </p>
          </div>

          {selectedTab === 'exact' && exact.length > 0 && (
            <button
              onClick={handleResolveAllExact}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-cinema uppercase font-semibold bg-photon-ivory hover:bg-white text-photon-obsidian shadow-soft transition-all active:scale-[0.98]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Auto-Resolve All ({formatBytes(totalExactSavings)})</span>
            </button>
          )}
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

        {/* Tab Switcher */}
        <motion.div variants={itemFadeUp} className="flex space-x-3 text-xs font-mono">
          <button
            onClick={() => setSelectedTab('exact')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full border transition-colors ${
              selectedTab === 'exact'
                ? 'border-white bg-photon-card text-white font-medium shadow-soft'
                : 'border-photon-border bg-photon-dark text-photon-muted hover:text-white'
            }`}
          >
            <span>Exact Cryptographic Duplicates</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px]">
              {exact.length}
            </span>
          </button>

          <button
            onClick={() => setSelectedTab('similar')}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-full border transition-colors ${
              selectedTab === 'similar'
                ? 'border-white bg-photon-card text-white font-medium shadow-soft'
                : 'border-photon-border bg-photon-dark text-photon-muted hover:text-white'
            }`}
          >
            <span>Perceptual Burst Sequences</span>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px]">
              {similar.length}
            </span>
          </button>
        </motion.div>

        {/* Duplicate Groups */}
        {currentGroups.length === 0 ? (
          <motion.div
            variants={itemFadeUp}
            className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-photon-border rounded-3xl bg-photon-dark/50"
          >
            <div className="h-16 w-16 rounded-3xl border border-photon-border bg-photon-card flex items-center justify-center text-accent-emerald mb-4 shadow-inner">
              <CheckCircle2 className="h-8 w-8 stroke-1" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-white">
              No {selectedTab === 'exact' ? 'exact duplicates' : 'similar sequences'} detected
            </h3>
            <p className="text-xs font-sans text-photon-light max-w-sm mt-1.5 font-light">
              Your photographic collection is 100% unique and optimized.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {currentGroups.map((group, gIdx) => (
              <motion.div
                key={group.hash + gIdx}
                variants={itemFadeUp}
                className="rounded-3xl border border-photon-border bg-photon-card p-6 shadow-soft"
              >
                {/* Group Summary */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-photon-border mb-5 font-mono text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-white font-medium">Cluster #{gIdx + 1}</span>
                    <span className="px-2.5 py-0.5 rounded-full border border-accent-gold/40 bg-accent-gold/10 text-accent-gold text-[10px] uppercase tracking-wider">
                      {group.similarityPercentage}% Match
                    </span>
                    <span className="text-photon-muted text-[11px]">
                      &bull; {group.files.length} negatives &bull; Reclaim {formatBytes(group.potentialSavingsBytes)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleResolveGroupKeepNewest(group)}
                    className="px-4 py-1.5 rounded-full border border-photon-border bg-photon-dark hover:bg-photon-border text-white text-[11px] uppercase tracking-wider transition-colors"
                  >
                    Keep Master (Archive {group.files.length - 1})
                  </button>
                </div>

                {/* Comparative Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {group.files.map((file, fIdx) => (
                    <div
                      key={file.id}
                      className="rounded-2xl overflow-hidden border border-photon-border bg-photon-dark p-3 flex flex-col justify-between"
                    >
                      <div className="aspect-square w-full rounded-xl overflow-hidden mb-3 relative bg-black border border-white/5">
                        <img
                          src={file.thumbnail_url || file.data_url}
                          alt={file.filename}
                          className="h-full w-full object-cover"
                        />
                        {fIdx === 0 && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white text-black text-[9px] font-mono font-bold uppercase tracking-wider">
                            Master Negative
                          </div>
                        )}
                      </div>

                      <div className="space-y-1 font-mono text-[11px]">
                        <p className="font-sans text-white truncate font-medium">
                          {file.filename}
                        </p>
                        <p className="text-photon-muted text-[10px]">
                          {formatBytes(file.file_size)}
                          {file.metadata.width && ` &bull; ${file.metadata.width}×${file.metadata.height}`}
                        </p>
                        <p className="text-[10px] text-photon-muted">
                          {new Date(file.metadata.taken_at || file.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-photon-border flex justify-end">
                        <button
                          onClick={() => moveToTrash([file.id])}
                          className="p-1.5 rounded-lg text-photon-muted hover:text-accent-crimson hover:bg-photon-card transition-colors"
                          title="Archive this copy"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
}
