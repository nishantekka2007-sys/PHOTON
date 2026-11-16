-- ==============================================================================
-- PHOTON: Premium, Privacy-First Personal Photo & Video Platform
-- Complete Database Migration with Strict Row-Level Security (RLS)
-- Free Tier Compatible (PostgreSQL 15+ on Supabase)
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES TABLE
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text not null,
    full_name text,
    avatar_url text,
    storage_used_bytes bigint default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USER PREFERENCES TABLE
create table if not exists public.user_preferences (
    user_id uuid primary key references public.profiles(id) on delete cascade,
    theme text default 'dark' check (theme in ('dark', 'light', 'system')),
    remember_recent_searches boolean default true,
    compact_view boolean default false,
    auto_detect_duplicates boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. ALBUMS TABLE
create table if not exists public.albums (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    name text not null,
    description text,
    cover_media_id uuid,
    is_private boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. MEDIA FILES TABLE
create table if not exists public.media_files (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    album_id uuid references public.albums(id) on delete set null,
    filename text not null,
    original_name text not null,
    file_size bigint not null,
    mime_type text not null,
    storage_path text,
    width integer,
    height integer,
    duration numeric,
    taken_at timestamp with time zone,
    camera_model text,
    latitude double precision,
    longitude double precision,
    sha256_hash text,
    phash text,
    is_favorite boolean default false,
    is_deleted boolean default false,
    deleted_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Foreign key for album cover after media_files exists
alter table public.albums 
    add constraint fk_cover_media foreign key (cover_media_id) 
    references public.media_files(id) on delete set null;

-- 5. USER ACTIVITY TABLE (For "Personal Memory" & "Continue Where You Left Off")
create table if not exists public.user_activity (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    activity_type text not null, -- 'upload', 'organized', 'album_created', 'viewed_media', 'deduplicated'
    title text not null,
    details jsonb default '{}'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ORGANIZATION SESSIONS TABLE
create table if not exists public.organization_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    session_name text not null,
    status text default 'completed' check (status in ('in_progress', 'completed', 'paused')),
    files_processed integer default 0,
    duplicates_found integer default 0,
    space_saved_bytes bigint default 0,
    last_active_at timestamp with time zone default timezone('utc'::text, now()) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- INDEXES FOR PERFORMANCE
create index if not exists idx_media_user_id on public.media_files(user_id);
create index if not exists idx_media_album_id on public.media_files(album_id);
create index if not exists idx_media_is_deleted on public.media_files(user_id, is_deleted);
create index if not exists idx_media_sha256 on public.media_files(user_id, sha256_hash);
create index if not exists idx_media_taken_at on public.media_files(user_id, taken_at desc);
create index if not exists idx_albums_user_id on public.albums(user_id);
create index if not exists idx_activity_user_id on public.user_activity(user_id, created_at desc);
create index if not exists idx_org_sessions_user_id on public.organization_sessions(user_id, last_active_at desc);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: No user can ever read, update, insert, or delete another user's rows.
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.user_preferences enable row level security;
alter table public.albums enable row level security;
alter table public.media_files enable row level security;
alter table public.user_activity enable row level security;
alter table public.organization_sessions enable row level security;

-- PROFILES POLICIES
create policy "Users can view own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
    for update using (auth.uid() = id);

-- USER PREFERENCES POLICIES
create policy "Users can view own preferences" on public.user_preferences
    for select using (auth.uid() = user_id);

create policy "Users can insert own preferences" on public.user_preferences
    for insert with check (auth.uid() = user_id);

create policy "Users can update own preferences" on public.user_preferences
    for update using (auth.uid() = user_id);

-- ALBUMS POLICIES
create policy "Users can view own albums" on public.albums
    for select using (auth.uid() = user_id);

create policy "Users can create own albums" on public.albums
    for insert with check (auth.uid() = user_id);

create policy "Users can update own albums" on public.albums
    for update using (auth.uid() = user_id);

create policy "Users can delete own albums" on public.albums
    for delete using (auth.uid() = user_id);

-- MEDIA FILES POLICIES
create policy "Users can view own media" on public.media_files
    for select using (auth.uid() = user_id);

create policy "Users can insert own media" on public.media_files
    for insert with check (auth.uid() = user_id);

create policy "Users can update own media" on public.media_files
    for update using (auth.uid() = user_id);

create policy "Users can delete own media" on public.media_files
    for delete using (auth.uid() = user_id);

-- USER ACTIVITY POLICIES
create policy "Users can view own activity" on public.user_activity
    for select using (auth.uid() = user_id);

create policy "Users can insert own activity" on public.user_activity
    for insert with check (auth.uid() = user_id);

create policy "Users can delete own activity" on public.user_activity
    for delete using (auth.uid() = user_id);

-- ORGANIZATION SESSIONS POLICIES
create policy "Users can view own sessions" on public.organization_sessions
    for select using (auth.uid() = user_id);

create policy "Users can insert own sessions" on public.organization_sessions
    for insert with check (auth.uid() = user_id);

create policy "Users can update own sessions" on public.organization_sessions
    for update using (auth.uid() = user_id);

create policy "Users can delete own sessions" on public.organization_sessions
    for delete using (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE & PREFERENCES INITIALIZATION TRIGGER
-- When a user registers via Supabase Auth, a profile & default preferences are created automatically.
-- ==============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', null)
  );

  insert into public.user_preferences (user_id, theme, remember_recent_searches, compact_view, auto_detect_duplicates)
  values (new.id, 'dark', true, false, true);

  insert into public.user_activity (user_id, activity_type, title, details)
  values (new.id, 'account_created', 'Created PHOTON account', '{"privacy": "strict"}'::jsonb);

  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution on auth.users insert
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ==============================================================================
-- SUPABASE STORAGE BUCKET CONFIGURATION
-- Private bucket for user media files: 'user-media'
-- ==============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-media',
  'user-media',
  false,
  52428800, -- 50MB per file limit (Supabase Free limit friendly)
  array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/gif', 'video/mp4', 'video/quicktime', 'video/webm']
)
on conflict (id) do nothing;

-- Storage RLS: Users can only upload and view files within their own folder: user-media/{user_id}/*
create policy "Users can view own media files"
on storage.objects for select
using (
  bucket_id = 'user-media' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can upload own media files"
on storage.objects for insert
with check (
  bucket_id = 'user-media' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update own media files"
on storage.objects for update
using (
  bucket_id = 'user-media' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete own media files"
on storage.objects for delete
using (
  bucket_id = 'user-media' 
  and auth.uid()::text = (storage.foldername(name))[1]
);
