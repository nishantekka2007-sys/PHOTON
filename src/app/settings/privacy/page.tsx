'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/context/auth-context';
import { useMedia } from '@/lib/context/media-context';
import {
  ShieldCheck,
  Lock,
  Download,
  Trash2,
  CheckCircle2,
  EyeOff,
  Database,
  History,
  Check
} from 'lucide-react';

export default function PrivacySettingsPage() {
  const { preferences, updatePreferences, isCloudConnected } = useAuth();
  const { activities, clearActivityHistory, media, albums } = useMedia();
  const [successNote, setSuccessNote] = useState('');

  const handleClearHistory = async () => {
    if (confirm('Clear all remembered activity logs? (Your photos and albums will remain untouched)')) {
      await clearActivityHistory();
      setSuccessNote('Activity history cleared.');
      setTimeout(() => setSuccessNote(''), 3000);
    }
  };

  const handleExportData = () => {
    const backup = {
      export_date: new Date().toISOString(),
      platform: 'PHOTON',
      version: '1.0.0',
      total_media_count: media.length,
      albums_count: albums.length,
      albums,
      media_catalog: media.map((m) => ({
        id: m.id,
        filename: m.filename,
        original_name: m.original_name,
        file_size: m.file_size,
        mime_type: m.mime_type,
        metadata: m.metadata,
        sha256_hash: m.sha256_hash,
        phash: m.phash,
        created_at: m.created_at,
        is_favorite: m.is_favorite,
      })),
    };

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `photon-metadata-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccessNote('Export downloaded successfully.');
    setTimeout(() => setSuccessNote(''), 3000);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl space-y-8">
        {/* Header */}
        <div className="pb-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-500" />
            Privacy & Security Architecture
          </h1>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Transparent control over your personal data, memory logs, and storage boundary
          </p>
        </div>

        {successNote && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <Check className="h-4 w-4 shrink-0 text-emerald-500" />
            <span>{successNote}</span>
          </div>
        )}

        {/* Security Checklist Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
            Active Security Guarantees
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Zero AI Model Training
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Your media files are strictly never fed into external machine learning training sets or proprietary AI algorithms.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Browser-Side Cryptographic Hashing
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                  SHA-256 fingerprinting and 64-bit dHash perceptual hashing happen locally inside your browser sandbox via Web Crypto.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Row Level Security (RLS) Isolation
                </p>
                <p className="text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Every PostgreSQL query and storage object request is verified against auth.uid() at the database kernel level.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Personal Memory Activity Log */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <History className="h-4 w-4 text-indigo-500" />
                Personal Memory History
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Logs your recent actions to help you resume where you left off.
              </p>
            </div>

            {activities.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {activities.length === 0 ? (
              <p className="text-xs text-zinc-400 italic py-4 text-center">
                No activity history recorded.
              </p>
            ) : (
              activities.slice(0, 15).map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-200/60 dark:border-zinc-800 text-xs"
                >
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {new Date(act.created_at).toLocaleDateString()} {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Export Data */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Download className="h-4 w-4 text-indigo-500" />
              Export Personal Metadata
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Download complete structured JSON archive of all file hashes, EXIF dates, and album schemas.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border border-zinc-700 transition-colors shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Archive</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
