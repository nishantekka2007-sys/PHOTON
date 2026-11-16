'use client';

import React, { useState, useMemo } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { formatBytes } from '@/lib/media/metadata';
import { 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Check, 
  X,
  Layers
} from 'lucide-react';

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-rose-500" />
              Recently Deleted
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Items in trash can be restored or permanently removed to reclaim storage
            </p>
          </div>

          {deletedMedia.length > 0 && (
            <div className="flex items-center space-x-2">
              {selectedIds.length > 0 && (
                <button
                  onClick={handleRestoreSelected}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restore ({selectedIds.length})</span>
                </button>
              )}

              <button
                onClick={() => setShowConfirmPermanent(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>
                  {selectedIds.length > 0
                    ? `Delete Permanently (${selectedIds.length})`
                    : 'Empty Trash'}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Deleted Media Grid */}
        {deletedMedia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="h-16 w-16 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
              <Trash2 className="h-8 w-8 stroke-1" />
            </div>
            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              Trash is empty
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1">
              Any photo or video you delete will be kept here safely until you decide to empty the trash.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
            {deletedMedia.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelect(item.id)}
                  className={`group relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/50'
                      : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <img
                    src={item.thumbnail_url || item.data_url}
                    alt={item.filename}
                    className="h-full w-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all"
                  />

                  {/* Checkbox overlay */}
                  <div className="absolute top-2 left-2">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center border transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-black/40 border-white/60 text-transparent group-hover:border-white'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* Restore Quick Button */}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        restoreFromTrash([item.id]);
                      }}
                      className="p-1.5 rounded-full bg-black/60 hover:bg-emerald-600 text-white backdrop-blur-sm transition-colors"
                      title="Restore"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirmation Modal for Permanent Deletion */}
      {showConfirmPermanent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Permanent Deletion Warning
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
              This action cannot be undone. Selected files will be permanently erased from your storage.
            </p>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => setShowConfirmPermanent(false)}
                className="px-3.5 py-2 rounded-xl text-xs text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                onClick={
                  selectedIds.length > 0
                    ? handlePermanentDeleteSelected
                    : handleEmptyTrash
                }
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-sm"
              >
                Permanently Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
