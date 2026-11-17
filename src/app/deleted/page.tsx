'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { formatBytes } from '@/lib/media/metadata';
import { 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Check, 
  Layers
} from 'lucide-react';
import { itemFadeUp, staggerEditorial, modalBackdrop, modalContent } from '@/lib/motion';

export default function DeletedPage() {
  const { media, restoreFromTrash, permanentlyDelete } = useMedia();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showConfirmPermanent, setShowConfirmPermanent] = useState(false);

  const deletedMedia = useMemo(() => {
    return media.filter((m) => m.is_deleted);
  }, [media]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRestoreSelected = async () => {
    await restoreFromTrash(selectedIds);
    setSelectedIds([]);
  };

  const handlePermanentDeleteSelected = async () => {
    await permanentlyDelete(selectedIds);
    setSelectedIds([]);
    setShowConfirmPermanent(false);
  };

  const handleEmptyTrash = async () => {
    await permanentlyDelete(deletedMedia.map((m) => m.id));
    setSelectedIds([]);
    setShowConfirmPermanent(false);
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
            <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-crimson uppercase mb-1">
              <Trash2 className="h-3.5 w-3.5" />
              <span>Archive Bin</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Decommissioned Negatives
            </h1>
            <p className="text-xs font-mono text-photon-muted mt-1">
              Items remain safely retained here until explicitly purged
            </p>
          </div>

          {deletedMedia.length > 0 && (
            <div className="flex items-center space-x-3 text-xs font-mono">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleRestoreSelected}
                  className="flex items-center space-x-1.5 px-4 py-2 rounded-full border border-photon-border bg-photon-card hover:bg-photon-border text-white transition-colors uppercase tracking-wider"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restore ({selectedIds.length})</span>
                </button>
              )}

              <button
                onClick={() => setShowConfirmPermanent(true)}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-accent-crimson hover:bg-red-600 text-white font-semibold transition-colors uppercase tracking-wider shadow-soft"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>
                  {selectedIds.length > 0
                    ? `Purge Selected (${selectedIds.length})`
                    : 'Purge Entire Bin'}
                </span>
              </button>
            </div>
          )}
        </motion.div>

        {/* Deleted Media Grid */}
        {deletedMedia.length === 0 ? (
          <motion.div
            variants={itemFadeUp}
            className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-photon-border rounded-3xl bg-photon-dark/50"
          >
            <div className="h-16 w-16 rounded-3xl border border-photon-border bg-photon-card flex items-center justify-center text-photon-muted mb-4 shadow-inner">
              <Trash2 className="h-7 w-7 stroke-1" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-white">
              Archive bin is empty
            </h3>
            <p className="text-xs font-sans text-photon-light max-w-sm mt-1.5 font-light">
              Decommissioned negatives will reside here safely for future restoration.
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={itemFadeUp}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
          >
            {deletedMedia.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden bg-photon-card border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-white ring-2 ring-white/50'
                      : 'border-photon-border/80 hover:border-photon-subtle'
                  }`}
                >
                  <img
                    src={item.thumbnail_url || item.data_url}
                    alt={item.filename}
                    className="h-full w-full object-cover grayscale-[50%] group-hover:grayscale-0 transition-all duration-300"
                  />

                  {/* Selection Checkbox */}
                  <div className="absolute top-2.5 left-2.5">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-white border-white text-photon-obsidian'
                          : 'bg-black/50 border-white/50 text-transparent group-hover:border-white'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* Quick Restore Button */}
                  <div className="absolute bottom-2.5 right-2.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreFromTrash([item.id]);
                      }}
                      className="p-2 rounded-full bg-black/75 hover:bg-white hover:text-black text-white backdrop-blur-md transition-colors"
                      title="Restore negative"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </motion.div>

      {/* Confirmation Modal for Permanent Purge */}
      <AnimatePresence>
        {showConfirmPermanent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl">
            <motion.div
              variants={modalBackdrop}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setShowConfirmPermanent(false)}
              className="fixed inset-0"
            />
            <motion.div
              variants={modalContent}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative w-full max-w-sm rounded-3xl bg-photon-dark border border-photon-border p-7 shadow-cinema z-10"
            >
              <div className="h-12 w-12 rounded-2xl bg-accent-crimson/10 border border-accent-crimson/30 flex items-center justify-center text-accent-crimson mb-4">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-2xl font-normal text-white">
                Permanent Purge Warning
              </h3>
              <p className="text-xs font-sans text-photon-light mt-2 leading-relaxed font-light">
                This operation is irreversible. The selected media negatives and cryptographic digests will be permanently deleted.
              </p>

              <div className="mt-6 flex justify-end space-x-2 text-xs font-mono">
                <button
                  onClick={() => setShowConfirmPermanent(false)}
                  className="px-4 py-2 rounded-xl text-photon-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={
                    selectedIds.length > 0
                      ? handlePermanentDeleteSelected
                      : handleEmptyTrash
                  }
                  className="px-5 py-2 rounded-xl bg-accent-crimson hover:bg-red-600 text-white font-semibold uppercase tracking-wider"
                >
                  Confirm Purge
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
