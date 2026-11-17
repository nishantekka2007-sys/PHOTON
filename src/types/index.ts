export type MediaType = 'image' | 'video';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  storage_used_bytes: number;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  user_id: string;
  theme: 'dark' | 'light' | 'system';
  remember_recent_searches: boolean;
  compact_view: boolean;
  auto_detect_duplicates: boolean;
  cloud_sync_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface MediaMetadata {
  width?: number;
  height?: number;
  duration?: number; // seconds for video
  taken_at?: string; // ISO string
  camera_make?: string;
  camera_model?: string;
  latitude?: number;
  longitude?: number;
  iso?: number;
  focal_length?: string;
  f_number?: number;
  exposure_time?: string;
}

export interface MediaFile {
  id: string;
  user_id: string;
  album_id: string | null;
  filename: string;
  original_name: string;
  file_size: number;
  mime_type: string;
  media_type: MediaType;
  storage_path?: string | null; // Supabase storage path or local blob reference
  data_url?: string; // Data URL or object URL for display
  thumbnail_url?: string;
  metadata: MediaMetadata;
  sha256_hash: string;
  phash?: string; // Perceptual hash for similar image detection
  is_favorite: boolean;
  is_deleted: boolean;
  deleted_at?: string | null;
  is_local_only: boolean;
  created_at: string;
  updated_at: string;
}

export interface Album {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_media_id: string | null;
  cover_url?: string | null;
  item_count: number;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'upload' | 'organized' | 'album_created' | 'viewed_media' | 'deduplicated' | 'deleted' | 'account_created';
  title: string;
  details?: Record<string, any>;
  created_at: string;
}

export interface OrganizationSession {
  id: string;
  user_id: string;
  session_name: string;
  status: 'in_progress' | 'completed' | 'paused';
  files_processed: number;
  duplicates_found: number;
  space_saved_bytes: number;
  last_active_at: string;
  created_at: string;
}

export interface DuplicateGroup {
  hash: string;
  type: 'exact' | 'similar';
  similarityPercentage: number;
  files: MediaFile[];
  potentialSavingsBytes: number;
}

export interface StorageUsage {
  totalUsedBytes: number;
  maxQuotaBytes: number; // e.g. 1GB = 1073741824 bytes on Supabase free tier
  photoBytes: number;
  videoBytes: number;
  trashBytes: number;
  photoCount: number;
  videoCount: number;
  trashCount: number;
}

