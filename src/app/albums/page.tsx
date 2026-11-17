'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { 
  FolderPlus, 
  Layers, 
  Edit3, 
  Trash2, 
  X,
  Lock,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import { itemFadeUp, staggerEditorial, modalBackdrop, modalContent } from '@/lib/motion';

export default function AlbumsPage() {
  const { albums, createAlbum, renameAlbum, deleteAlbum } = useMedia();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlbumName.trim()) return;
    await createAlbum(newAlbumName.trim(), newAlbumDesc.trim());
    setNewAlbumName('');
    setNewAlbumDesc('');
    setShowCreateModal(false);
  };

  const handleStartRename = (id: string, currentName: string) => {
    setEditingAlbumId(id);
    setEditName(currentName);
  };

  const handleSaveRename = async (id: string) => {
    if (editName.trim()) {
      await renameAlbum(id, editName.trim());
    }
    setEditingAlbumId(null);
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
              <BookOpen className="h-3.5 w-3.5" />
              <span>Physical Curations</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
              Monographs & Series
            </h1>
            <p className="text-xs font-mono text-photon-muted mt-1">
              {albums.length} {albums.length === 1 ? 'collection' : 'collections'} &bull; Private and dedicated exhibitions
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-cinema uppercase font-semibold bg-photon-ivory hover:bg-white text-photon-obsidian shadow-soft transition-all active:scale-[0.98]"
          >
            <FolderPlus className="h-3.5 w-3.5" />
            <span>New Monograph</span>
          </button>
        </motion.div>

        {/* Monographs Grid */}
        {albums.length === 0 ? (
          <motion.div
            variants={itemFadeUp}
            className="flex flex-col items-center justify-center py-24 px-4 text-center border border-dashed border-photon-border rounded-3xl bg-photon-dark/50"
          >
            <div className="h-16 w-16 rounded-3xl border border-photon-border bg-photon-card flex items-center justify-center text-photon-muted mb-4 shadow-inner">
              <FolderPlus className="h-7 w-7 stroke-1" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-white">
              No monographs published
            </h3>
            <p className="text-xs font-sans text-photon-light max-w-sm mt-1.5 mb-6 font-light">
              Create an album to organize trips, architectural series, studio sessions, or family chronicles.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-photon-ivory hover:bg-white text-photon-obsidian text-xs font-mono tracking-wider uppercase font-semibold shadow-soft transition-all active:scale-[0.98]"
            >
              <FolderPlus className="h-3.5 w-3.5" />
              <span>Create First Monograph</span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            variants={itemFadeUp}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {albums.map((album) => (
              <div
                key={album.id}
                className="group rounded-3xl overflow-hidden border border-photon-border bg-photon-card shadow-soft hover:border-photon-subtle transition-all duration-300 flex flex-col justify-between p-3.5"
              >
                {/* Physical Book Cover Aesthetic */}
                <Link
                  href={`/albums/${album.id}`}
                  className="aspect-[4/3] w-full bg-photon-dark rounded-2xl overflow-hidden relative block border border-white/5"
                >
                  {album.cover_url ? (
                    <img
                      src={album.cover_url}
                      alt={album.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-photon-muted">
                      <Layers className="h-8 w-8 stroke-1" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1 border border-white/10 uppercase">
                    <Lock className="h-2.5 w-2.5 text-accent-emerald" />
                    <span>Private</span>
                  </div>
                </Link>

                {/* Monograph Meta & Controls */}
                <div className="pt-4 px-1 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-3">
                    {editingAlbumId === album.id ? (
                      <div className="flex items-center space-x-1.5 font-sans">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(album.id)}
                          className="w-full bg-photon-dark border border-white/40 rounded-lg px-2 py-1 text-xs text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(album.id)}
                          className="px-2.5 py-1 bg-white text-black rounded-lg text-[10px] font-mono font-semibold"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <Link href={`/albums/${album.id}`}>
                        <h3 className="font-serif text-lg font-normal text-white truncate group-hover:text-accent-gold transition-colors">
                          {album.name}
                        </h3>
                        <p className="text-[11px] font-mono text-photon-muted mt-0.5">
                          {album.item_count} {album.item_count === 1 ? 'negative' : 'negatives'}
                        </p>
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleStartRename(album.id, album.name)}
                      className="p-1.5 text-photon-muted hover:text-white rounded-lg hover:bg-photon-border transition-colors"
                      title="Rename Monograph"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove monograph "${album.name}"? Media files inside will remain in your master library.`)) {
                          deleteAlbum(album.id);
                        }
                      }}
                      className="p-1.5 text-photon-muted hover:text-accent-crimson rounded-lg hover:bg-photon-border transition-colors"
                      title="Archive Monograph"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Monograph Creation Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
            <motion.div
              variants={modalBackdrop}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0"
            />
            <motion.div
              variants={modalContent}
              initial="hidden"
              animate="show"
              exit="exit"
              className="relative w-full max-w-sm rounded-3xl bg-photon-dark border border-photon-border p-6 shadow-cinema z-10"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl font-normal text-white">
                  New Monograph
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-photon-muted hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-photon-light uppercase mb-1.5">
                    Monograph Title
                  </label>
                  <input
                    type="text"
                    autoFocus
                    required
                    value={newAlbumName}
                    onChange={(e) => setNewAlbumName(e.target.value)}
                    placeholder="e.g. Nordic Architecture, Summer 2026"
                    className="w-full rounded-xl bg-photon-card border border-photon-border px-3.5 py-2.5 text-xs text-white placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono tracking-wider text-photon-light uppercase mb-1.5">
                    Curator Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={newAlbumDesc}
                    onChange={(e) => setNewAlbumDesc(e.target.value)}
                    placeholder="Short thematic statement"
                    className="w-full rounded-xl bg-photon-card border border-photon-border px-3.5 py-2.5 text-xs text-white placeholder-photon-muted focus:border-white/50 focus:outline-none transition-colors"
                  />
                </div>

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
                    Publish
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}
