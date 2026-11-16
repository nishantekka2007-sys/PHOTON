'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Layers, 
  Lock, 
  Upload 
} from 'lucide-react';

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params?.id as string;
  const { albums, media, renameAlbum, deleteAlbum } = useMedia();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');

  const album = albums.find((a) => a.id === albumId);

  const albumMedia = useMemo(() => {
    return media.filter((m) => !m.is_deleted && m.album_id === albumId);
  }, [media, albumId]);

  if (!album) {
    return (
      <AppLayout>
        <div className="py-20 text-center">
          <p className="text-zinc-400 mb-4 text-sm">Album not found</p>
          <Link
            href="/albums"
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Back to Albums
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleSaveRename = async () => {
    if (name.trim()) {
      await renameAlbum(album.id, name.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm(`Delete album "${album.name}"? Media files will not be deleted.`)) {
      await deleteAlbum(album.id);
      router.push('/albums');
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center space-x-3">
            <Link
              href="/albums"
              className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-100 dark:bg-zinc-800 border border-indigo-500 rounded-lg px-2 py-1 text-sm text-zinc-900 dark:text-zinc-100"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveRename}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <span>{album.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-normal">
                    {albumMedia.length} {albumMedia.length === 1 ? 'item' : 'items'}
                  </span>
                </h1>
              )}
              {album.description && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {album.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setName(album.name);
                setIsEditing(!isEditing);
              }}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
              title="Rename Album"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-500 transition-colors"
              title="Delete Album"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Media Grid in this album */}
        <MediaGrid
          media={albumMedia}
          emptyMessage="This album is empty"
          emptySubtext="Use the Upload button or select media from Photos to add them to this album."
        />
      </div>
    </AppLayout>
  );
}
