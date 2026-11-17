import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { MediaFile, Album, UserActivity, UserPreferences, OrganizationSession } from '@/types';

interface PhotonDB extends DBSchema {
  media: {
    key: string;
    value: MediaFile & { blob?: Blob };
    indexes: {
      'by-user': string;
      'by-album': string;
      'by-sha256': string;
      'by-deleted': number;
      'by-created': string;
    };
  };
  albums: {
    key: string;
    value: Album;
    indexes: {
      'by-user': string;
      'by-created': string;
    };
  };
  activity: {
    key: string;
    value: UserActivity;
    indexes: {
      'by-user': string;
      'by-created': string;
    };
  };
  preferences: {
    key: string;
    value: UserPreferences;
  };
  sessions: {
    key: string;
    value: OrganizationSession;
    indexes: {
      'by-user': string;
    };
  };
}

const DB_NAME = 'photon-local-storage';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PhotonDB>> | null = null;

export function getPhotonDB(): Promise<IDBPDatabase<PhotonDB>> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB is not available in SSR'));
  }

  if (!dbPromise) {
    dbPromise = openDB<PhotonDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Media store
        if (!db.objectStoreNames.contains('media')) {
          const mediaStore = db.createObjectStore('media', { keyPath: 'id' });
          mediaStore.createIndex('by-user', 'user_id');
          mediaStore.createIndex('by-album', 'album_id');
          mediaStore.createIndex('by-sha256', 'sha256_hash');
          mediaStore.createIndex('by-deleted', 'is_deleted');
          mediaStore.createIndex('by-created', 'created_at');
        }

        // Albums store
        if (!db.objectStoreNames.contains('albums')) {
          const albumsStore = db.createObjectStore('albums', { keyPath: 'id' });
          albumsStore.createIndex('by-user', 'user_id');
          albumsStore.createIndex('by-created', 'created_at');
        }

        // User Activity store
        if (!db.objectStoreNames.contains('activity')) {
          const activityStore = db.createObjectStore('activity', { keyPath: 'id' });
          activityStore.createIndex('by-user', 'user_id');
          activityStore.createIndex('by-created', 'created_at');
        }

        // Preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'user_id' });
        }

        // Sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionsStore.createIndex('by-user', 'user_id');
        }
      },
    });
  }

  return dbPromise;
}

// Media file operations
export async function idbSaveMedia(media: MediaFile, blob?: Blob): Promise<void> {
  const db = await getPhotonDB();
  await db.put('media', { ...media, blob });
}

export async function idbGetMedia(id: string): Promise<(MediaFile & { blob?: Blob }) | undefined> {
  const db = await getPhotonDB();
  return db.get('media', id);
}

export async function idbGetAllMedia(userId: string): Promise<MediaFile[]> {
  const db = await getPhotonDB();
  const tx = db.transaction('media', 'readonly');
  const index = tx.store.index('by-user');
  const items = await index.getAll(userId);
  await tx.done;

  // Restore ObjectURLs for items that have blobs stored
  return items.map((item) => {
    if (item.blob && !item.data_url) {
      const url = URL.createObjectURL(item.blob);
      return { ...item, data_url: url };
    }
    return item;
  });
}

export async function idbDeleteMedia(id: string): Promise<void> {
  const db = await getPhotonDB();
  await db.delete('media', id);
}

// Albums operations
export async function idbSaveAlbum(album: Album): Promise<void> {
  const db = await getPhotonDB();
  await db.put('albums', album);
}

export async function idbGetAllAlbums(userId: string): Promise<Album[]> {
  const db = await getPhotonDB();
  const tx = db.transaction('albums', 'readonly');
  const index = tx.store.index('by-user');
  return index.getAll(userId);
}

export async function idbDeleteAlbum(id: string): Promise<void> {
  const db = await getPhotonDB();
  await db.delete('albums', id);
}

// Preferences operations
export async function idbSavePreferences(prefs: UserPreferences): Promise<void> {
  const db = await getPhotonDB();
  await db.put('preferences', prefs);
}

export async function idbGetPreferences(userId: string): Promise<UserPreferences | undefined> {
  const db = await getPhotonDB();
  return db.get('preferences', userId);
}

// Activity operations
export async function idbAddActivity(activity: UserActivity): Promise<void> {
  const db = await getPhotonDB();
  await db.put('activity', activity);
}

export async function idbGetActivities(userId: string, limit = 50): Promise<UserActivity[]> {
  const db = await getPhotonDB();
  const tx = db.transaction('activity', 'readonly');
  const index = tx.store.index('by-user');
  const items = await index.getAll(userId);
  items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  return items.slice(0, limit);
}

export async function idbClearActivities(userId: string): Promise<void> {
  const db = await getPhotonDB();
  const tx = db.transaction('activity', 'readwrite');
  const index = tx.store.index('by-user');
  const keys = await index.getAllKeys(userId);
  for (const key of keys) {
    await tx.store.delete(key);
  }
  await tx.done;
}

// Organization sessions operations
export async function idbSaveSession(session: OrganizationSession): Promise<void> {
  const db = await getPhotonDB();
  await db.put('sessions', session);
}

export async function idbGetLatestSession(userId: string): Promise<OrganizationSession | undefined> {
  const db = await getPhotonDB();
  const tx = db.transaction('sessions', 'readonly');
  const index = tx.store.index('by-user');
  const sessions = await index.getAll(userId);
  if (sessions.length === 0) return undefined;
  sessions.sort((a, b) => new Date(b.last_active_at).getTime() - new Date(a.last_active_at).getTime());
  return sessions[0];
}

