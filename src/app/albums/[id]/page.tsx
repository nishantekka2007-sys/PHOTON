'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedia } from '@/lib/context/media-context';
import { MediaGrid } from '@/components/media/MediaGrid';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Lock, 
  BookOpen
} from 'lucide-react';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

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
        <div className="py-24 text-center">
          <p className="font-serif text-2xl text-white mb-4">Monograph not found in vault</p>
          <Link
            href="/albums"
            className="px-6 py-2.5 rounded-full bg-photon-ivory text-photon-obsidian text-xs font-mono tracking-wider uppercase font-semibold"
          >
            Return to Monographs
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
    if (confirm(`Remove monograph "${album.name}"? Media files inside will remain in your master library.`)) {
      await deleteAlbum(album.id);
      router.push('/albums');
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
        {/* Navigation & Header */}
        <motion.div
          variants={itemFadeUp}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-photon-border"
        >
          <div className="flex items-start space-x-4">
            <Link
              href="/albums"
              className="p-2.5 rounded-full border border-photon-border bg-photon-card hover:bg-photon-border text-photon-light hover:text-white transition-colors mt-1"
              title="Return to Monographs"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Curated Series</span>
              </div>

              {isEditing ? (
                <div className="flex items-center space-x-2 mt-1">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-photon-card border border-white/50 rounded-xl px-3 py-1.5 text-base text-white font-serif"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveRename}
                    className="px-3.5 py-1.5 bg-photon-ivory text-photon-obsidian rounded-xl text-xs font-mono font-semibold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h1 className="font-serif text-3xl sm:text-5xl font-normal text-white tracking-tight flex items-center gap-3">
                  <span>{album.name}</span>
                  <span className="text-xs font-mono px-2.5 py-1 rounded-full border border-photon-border bg-photon-card text-photon-muted">
                    {albumMedia.length} {albumMedia.length === 1 ? 'negative' : 'negatives'}
                  </span>
                </h1>
              )}
              {album.description && (
                <p className="text-xs font-sans text-photon-light mt-1.5 max-w-xl font-light">
                  {album.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <button
              onClick={() => {
                setName(album.name);
                setIsEditing(!isEditing);
              }}
              className="p-2.5 rounded-full border border-photon-border bg-photon-card hover:bg-photon-border text-photon-light hover:text-white transition-colors"
              title="Rename Monograph"
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2.5 rounded-full border border-photon-border bg-photon-card hover:bg-accent-crimson/20 text-photon-light hover:text-accent-crimson transition-colors"
              title="Archive Monograph"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Media Grid */}
        <motion.div variants={itemFadeUp}>
          <MediaGrid
            media={albumMedia}
            emptyMessage="This monograph is empty"
            emptySubtext="Assign photographs from your library to assemble this collection."
          />
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
