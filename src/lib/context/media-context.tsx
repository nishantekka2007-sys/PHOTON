'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useAuth } from './auth-context';
import { MediaFile, Album, UserActivity, StorageUsage, DuplicateGroup, MediaType } from '@/types';
import { 
  idbGetAllMedia, 
  idbSaveMedia, 
  idbDeleteMedia, 
  idbGetAllAlbums, 
  idbSaveAlbum, 
  idbDeleteAlbum,
  idbGetActivities,
  idbAddActivity,
  idbClearActivities,
  idbSaveSession,
  idbGetLatestSession
} from '@/lib/db/indexed-db';
import { computeSHA256, computePerceptualHash, calculateHammingDistance } from '@/lib/media/hasher';
import { extractMediaMetadata } from '@/lib/media/metadata';
import { getSupabaseClient } from '@/lib/supabase/client';

export interface UploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'queued' | 'hashing' | 'uploading' | 'completed' | 'error';
  error?: string;
  mediaFile?: MediaFile;
}

interface MediaContextType {
  media: MediaFile[];
  albums: Album[];
  activities: UserActivity[];
  uploadQueue: UploadItem[];
  storageUsage: StorageUsage;
  searchQuery: string;
  selectedIds: string[];
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  uploadFiles: (files: FileList | File[], albumId?: string) => Promise<void>;
  createAlbum: (name: string, description?: string) => Promise<Album>;
  renameAlbum: (id: string, name: string) => Promise<void>;
  deleteAlbum: (id: string) => Promise<void>;
  addMediaToAlbum: (mediaIds: string[], albumId: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  moveToTrash: (ids: string[]) => Promise<void>;
  restoreFromTrash: (ids: string[]) => Promise<void>;
  permanentlyDelete: (ids: string[]) => Promise<void>;
  findDuplicates: () => { exact: DuplicateGroup[]; similar: DuplicateGroup[] };
  clearActivityHistory: () => Promise<void>;
  refreshMedia: () => Promise<void>;
}

const MediaContext = createContext<MediaContextType | undefined>(undefined);

// Supabase Free Tier Storage Quota: 1 GB (1,073,741,824 bytes)
const FREE_TIER_QUOTA_BYTES = 1024 * 1024 * 1024; 

export function MediaProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [uploadQueue, setUploadQueue] = useState<UploadItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data for the active user
  const loadUserData = async () => {
    if (!user) {
      setMedia([]);
      setAlbums([]);
      setActivities([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [localMedia, localAlbums, localActivities] = await Promise.all([
        idbGetAllMedia(user.id),
        idbGetAllAlbums(user.id),
        idbGetActivities(user.id),
      ]);

      setMedia(localMedia);
      setAlbums(localAlbums);
      setActivities(localActivities);
    } catch (err) {
      console.error('Error loading media data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [user?.id]);

  // Record user activity
  const recordActivity = async (type: UserActivity['activity_type'], title: string, details?: Record<string, any>) => {
    if (!user) return;
    const act: UserActivity = {
      id: 'act_' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      activity_type: type,
      title,
      details,
      created_at: new Date().toISOString(),
    };
    await idbAddActivity(act);
    setActivities((prev) => [act, ...prev]);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from('user_activity').insert({
          user_id: user.id,
          activity_type: type,
          title,
          details,
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  // Upload files handler
  const uploadFiles = async (fileList: FileList | File[], albumId?: string) => {
    if (!user) return;
    const files = Array.from(fileList);
    if (files.length === 0) return;

    // Create queue items
    const newQueueItems: UploadItem[] = files.map((file) => ({
      id: 'queue_' + Math.random().toString(36).substring(2, 9),
      file,
      progress: 0,
      status: 'queued',
    }));

    setUploadQueue((prev) => [...prev, ...newQueueItems]);

    // Process each file
    for (const item of newQueueItems) {
      try {
        // Step 1: Hashing & Metadata
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'hashing', progress: 20 } : q))
        );

        const mediaType: MediaType = item.file.type.startsWith('video/') ? 'video' : 'image';
        const sha256 = await computeSHA256(item.file);
        
        let pHash: string | undefined;
        if (mediaType === 'image') {
          pHash = await computePerceptualHash(item.file);
        }

        const { metadata, thumbnailUrl } = await extractMediaMetadata(item.file, mediaType);

        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', progress: 60 } : q))
        );

        const mediaId = 'med_' + Math.random().toString(36).substring(2, 9);
        const dataUrl = URL.createObjectURL(item.file);

        const newMedia: MediaFile = {
          id: mediaId,
          user_id: user.id,
          album_id: albumId || null,
          filename: item.file.name,
          original_name: item.file.name,
          file_size: item.file.size,
          mime_type: item.file.type,
          media_type: mediaType,
          data_url: dataUrl,
          thumbnail_url: thumbnailUrl || dataUrl,
          metadata,
          sha256_hash: sha256,
          phash: pHash,
          is_favorite: false,
          is_deleted: false,
          is_local_only: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Save into IndexedDB
        await idbSaveMedia(newMedia, item.file);

        // Optional Supabase Cloud Upload if configured
        const supabase = getSupabaseClient();
        if (supabase) {
          try {
            const ext = item.file.name.split('.').pop();
            const storagePath = `${user.id}/${mediaId}.${ext}`;
            const { error: uploadError } = await supabase.storage
              .from('user-media')
              .upload(storagePath, item.file);

            if (!uploadError) {
              newMedia.storage_path = storagePath;
              newMedia.is_local_only = false;
              await idbSaveMedia(newMedia, item.file);
              
              await supabase.from('media_files').insert({
                id: newMedia.id,
                user_id: user.id,
                album_id: newMedia.album_id,
                filename: newMedia.filename,
                original_name: newMedia.original_name,
                file_size: newMedia.file_size,
                mime_type: newMedia.mime_type,
                storage_path: storagePath,
                width: metadata.width,
                height: metadata.height,
                duration: metadata.duration,
                taken_at: metadata.taken_at,
                camera_model: metadata.camera_model,
                latitude: metadata.latitude,
                longitude: metadata.longitude,
                sha256_hash: sha256,
                phash: pHash,
              });
            }
          } catch (e) {
            console.warn('Cloud sync skipped, stored locally in IndexedDB', e);
          }
        }

        setMedia((prev) => [newMedia, ...prev]);

        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: 'completed', progress: 100, mediaFile: newMedia } : q
          )
        );

        await recordActivity('upload', `Uploaded ${item.file.name}`, {
          file_size: item.file.size,
          media_type: mediaType,
        });
      } catch (err: any) {
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.id === item.id ? { ...q, status: 'error', error: err?.message || 'Upload failed' } : q
          )
        );
      }
    }

    // Clear completed queue after 3 seconds
    setTimeout(() => {
      setUploadQueue((prev) => prev.filter((q) => q.status !== 'completed'));
    }, 3000);
  };

  // Create album
  const createAlbum = async (name: string, description?: string): Promise<Album> => {
    if (!user) throw new Error('User not logged in');
    const newAlbum: Album = {
      id: 'alb_' + Math.random().toString(36).substring(2, 9),
      user_id: user.id,
      name,
      description: description || null,
      cover_media_id: null,
      item_count: 0,
      is_private: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await idbSaveAlbum(newAlbum);

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('albums').insert(newAlbum);
    }

    setAlbums((prev) => [newAlbum, ...prev]);
    await recordActivity('album_created', `Created album "${name}"`);
    return newAlbum;
  };

  // Rename album
  const renameAlbum = async (id: string, name: string) => {
    const album = albums.find((a) => a.id === id);
    if (!album) return;
    const updated = { ...album, name, updated_at: new Date().toISOString() };
    await idbSaveAlbum(updated);
    setAlbums((prev) => prev.map((a) => (a.id === id ? updated : a)));

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('albums').update({ name }).eq('id', id);
    }
  };

  // Delete album
  const deleteAlbum = async (id: string) => {
    const album = albums.find((a) => a.id === id);
    await idbDeleteAlbum(id);
    setAlbums((prev) => prev.filter((a) => a.id !== id));

    // Reset album_id in media
    setMedia((prev) =>
      prev.map((m) => (m.album_id === id ? { ...m, album_id: null } : m))
    );

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('albums').delete().eq('id', id);
    }

    if (album) {
      await recordActivity('organized', `Deleted album "${album.name}"`);
    }
  };

  // Add media to album
  const addMediaToAlbum = async (mediaIds: string[], albumId: string) => {
    const updatedMedia = media.map((m) => {
      if (mediaIds.includes(m.id)) {
        const item = { ...m, album_id: albumId, updated_at: new Date().toISOString() };
        idbSaveMedia(item);
        return item;
      }
      return m;
    });

    setMedia(updatedMedia);

    // Update album cover and item count
    const count = updatedMedia.filter((m) => m.album_id === albumId && !m.is_deleted).length;
    const coverMedia = updatedMedia.find((m) => m.album_id === albumId && !m.is_deleted);
    const album = albums.find((a) => a.id === albumId);
    if (album) {
      const updatedAlbum: Album = {
        ...album,
        item_count: count,
        cover_media_id: coverMedia?.id || null,
        cover_url: coverMedia?.thumbnail_url || null,
        updated_at: new Date().toISOString(),
      };
      await idbSaveAlbum(updatedAlbum);
      setAlbums((prev) => prev.map((a) => (a.id === albumId ? updatedAlbum : a)));
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('media_files').update({ album_id: albumId }).in('id', mediaIds);
    }

    await recordActivity('organized', `Organized ${mediaIds.length} item(s) into album`);
  };

  // Toggle favorite
  const toggleFavorite = async (id: string) => {
    const item = media.find((m) => m.id === id);
    if (!item) return;
    const updated = { ...item, is_favorite: !item.is_favorite, updated_at: new Date().toISOString() };
    await idbSaveMedia(updated);
    setMedia((prev) => prev.map((m) => (m.id === id ? updated : m)));

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('media_files').update({ is_favorite: updated.is_favorite }).eq('id', id);
    }
  };

  // Move to trash
  const moveToTrash = async (ids: string[]) => {
    const now = new Date().toISOString();
    const updatedMedia = media.map((m) => {
      if (ids.includes(m.id)) {
        const updated = { ...m, is_deleted: true, deleted_at: now, updated_at: now };
        idbSaveMedia(updated);
        return updated;
      }
      return m;
    });

    setMedia(updatedMedia);
    setSelectedIds([]);

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('media_files').update({ is_deleted: true, deleted_at: now }).in('id', ids);
    }

    await recordActivity('deleted', `Moved ${ids.length} item(s) to trash`);
  };

  // Restore from trash
  const restoreFromTrash = async (ids: string[]) => {
    const now = new Date().toISOString();
    const updatedMedia = media.map((m) => {
      if (ids.includes(m.id)) {
        const updated = { ...m, is_deleted: false, deleted_at: null, updated_at: now };
        idbSaveMedia(updated);
        return updated;
      }
      return m;
    });

    setMedia(updatedMedia);
    setSelectedIds([]);

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('media_files').update({ is_deleted: false, deleted_at: null }).in('id', ids);
    }

    await recordActivity('organized', `Restored ${ids.length} item(s) from trash`);
  };

  // Permanently delete
  const permanentlyDelete = async (ids: string[]) => {
    for (const id of ids) {
      await idbDeleteMedia(id);
    }

    setMedia((prev) => prev.filter((m) => !ids.includes(m.id)));
    setSelectedIds([]);

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.from('media_files').delete().in('id', ids);
    }

    await recordActivity('deleted', `Permanently deleted ${ids.length} item(s)`);
  };

  // Duplicate and Similar Detection
  const findDuplicates = (): { exact: DuplicateGroup[]; similar: DuplicateGroup[] } => {
    const activeMedia = media.filter((m) => !m.is_deleted);

    // 1. Exact duplicates by SHA-256
    const hashGroups: Record<string, MediaFile[]> = {};
    activeMedia.forEach((m) => {
      if (!hashGroups[m.sha256_hash]) {
        hashGroups[m.sha256_hash] = [];
      }
      hashGroups[m.sha256_hash].push(m);
    });

    const exact: DuplicateGroup[] = Object.entries(hashGroups)
      .filter(([_, files]) => files.length > 1)
      .map(([hash, files]) => {
        const potentialSavingsBytes = files.slice(1).reduce((acc, f) => acc + f.file_size, 0);
        return {
          hash,
          type: 'exact',
          similarityPercentage: 100,
          files,
          potentialSavingsBytes,
        };
      });

    // 2. Similar images by Perceptual Hash (Hamming distance <= 5)
    const imagesWithPhash = activeMedia.filter((m) => m.media_type === 'image' && m.phash && m.phash !== '0000000000000000');
    const processedPairs = new Set<string>();
    const similarGroups: DuplicateGroup[] = [];

    for (let i = 0; i < imagesWithPhash.length; i++) {
      const base = imagesWithPhash[i];
      const cluster: MediaFile[] = [base];

      for (let j = i + 1; j < imagesWithPhash.length; j++) {
        const comp = imagesWithPhash[j];
        if (base.sha256_hash === comp.sha256_hash) continue; // Already exact duplicate

        const pairKey = [base.id, comp.id].sort().join(':');
        if (processedPairs.has(pairKey)) continue;

        const distance = calculateHammingDistance(base.phash!, comp.phash!);
        // Distance <= 5 means > 92% perceptual visual similarity
        if (distance <= 5) {
          cluster.push(comp);
          processedPairs.add(pairKey);
        }
      }

      if (cluster.length > 1) {
        const minSimilarity = Math.min(
          ...cluster.slice(1).map((c) => 100 - Math.round((calculateHammingDistance(base.phash!, c.phash!) / 64) * 100))
        );
        const potentialSavingsBytes = cluster.slice(1).reduce((acc, f) => acc + f.file_size, 0);
        similarGroups.push({
          hash: base.phash!,
          type: 'similar',
          similarityPercentage: minSimilarity,
          files: cluster,
          potentialSavingsBytes,
        });
      }
    }

    return { exact, similar: similarGroups };
  };

  // Selection helpers
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const selectAll = (ids: string[]) => {
    setSelectedIds(ids);
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const clearActivityHistory = async () => {
    if (!user) return;
    await idbClearActivities(user.id);
    setActivities([]);
  };

  // Storage calculation
  const storageUsage: StorageUsage = useMemo(() => {
    let photoBytes = 0;
    let videoBytes = 0;
    let trashBytes = 0;
    let photoCount = 0;
    let videoCount = 0;
    let trashCount = 0;

    media.forEach((m) => {
      if (m.is_deleted) {
        trashBytes += m.file_size;
        trashCount++;
      } else if (m.media_type === 'image') {
        photoBytes += m.file_size;
        photoCount++;
      } else {
        videoBytes += m.file_size;
        videoCount++;
      }
    });

    const totalUsedBytes = photoBytes + videoBytes + trashBytes;

    return {
      totalUsedBytes,
      maxQuotaBytes: FREE_TIER_QUOTA_BYTES,
      photoBytes,
      videoBytes,
      trashBytes,
      photoCount,
      videoCount,
      trashCount,
    };
  }, [media]);

  return (
    <MediaContext.Provider
      value={{
        media,
        albums,
        activities,
        uploadQueue,
        storageUsage,
        searchQuery,
        selectedIds,
        isLoading,
        setSearchQuery,
        toggleSelect,
        selectAll,
        clearSelection,
        uploadFiles,
        createAlbum,
        renameAlbum,
        deleteAlbum,
        addMediaToAlbum,
        toggleFavorite,
        moveToTrash,
        restoreFromTrash,
        permanentlyDelete,
        findDuplicates,
        clearActivityHistory,
        refreshMedia: loadUserData,
      }}
    >
      {children}
    </MediaContext.Provider>
  );
}

export function useMedia() {
  const context = useContext(MediaContext);
  if (!context) {
    throw new Error('useMedia must be used within a MediaProvider');
  }
  return context;
}

