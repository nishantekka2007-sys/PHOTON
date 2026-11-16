'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { 
  FolderPlus, 
  Layers, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  X,
  Lock,
  ArrowRight
} from 'lucide-react';

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              Albums & Collections
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {albums.length} {albums.length === 1 ? 'album' : 'albums'} • Private and custom curated
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all active:scale-95"
          >
            <FolderPlus className="h-4 w-4" />
            <span>Create Album</span>
          </button>
        </div>

        {/* Albums Grid */}
        {albums.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <div className="h-16 w-16 rounded-3xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 mb-4 shadow-inner">
              <FolderPlus className="h-8 w-8 stroke-1" />
            </div>
            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              No albums created yet
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mt-1 mb-5">
              Create an album to organize trips, events, projects, or favorites into private groups.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              <FolderPlus className="h-4 w-4" />
              <span>Create Your First Album</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {albums.map((album) => (
              <div
                key={album.id}
                className="group rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:border-zinc-400 dark:hover:border-zinc-700 transition-all flex flex-col"
              >
                {/* Album Cover */}
                <Link
                  href={`/albums/${album.id}`}
                  className="aspect-video w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden relative block"
                >
                  {album.cover_url ? (
                    <img
                      src={album.cover_url}
                      alt={album.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-zinc-400">
                      <Layers className="h-8 w-8 stroke-1" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] text-white flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" />
                    <span>Private</span>
                  </div>
                </Link>

                {/* Album Info & Actions */}
                <div className="p-3.5 flex items-center justify-between">
                  <div className="min-w-0 flex-1 mr-2">
                    {editingAlbumId === album.id ? (
                      <div className="flex items-center space-x-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(album.id)}
                          className="w-full bg-zinc-100 dark:bg-zinc-800 border border-indigo-500 rounded px-1.5 py-0.5 text-xs text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRename(album.id)}
                          className="px-2 py-0.5 bg-indigo-600 rounded text-[10px] text-white"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <Link href={`/albums/${album.id}`}>
                        <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate hover:text-indigo-500 transition-colors">
                          {album.name}
                        </h3>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                          {album.item_count} {album.item_count === 1 ? 'item' : 'items'}
                        </p>
                      </Link>
                    )}
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleStartRename(album.id, album.name)}
                      className="p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Rename Album"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${album.name}"? Media files inside will remain intact.`)) {
                          deleteAlbum(album.id);
                        }
                      }}
                      className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Delete Album"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Album Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Create New Album
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-400 hover:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Album Name
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newAlbumName}
                  onChange={(e) => setNewAlbumName(e.target.value)}
                  placeholder="e.g., Summer 2026, Architecture"
                  className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  placeholder="Short note about this collection"
                  className="w-full rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

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
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
