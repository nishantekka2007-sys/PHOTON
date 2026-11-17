'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/layout/AppLayout';
import { useAuth } from '@/lib/context/auth-context';
import { useMedia } from '@/lib/context/media-context';
import {
  ShieldCheck,
  Download,
  Trash2,
  CheckCircle2,
  History,
  Check
} from 'lucide-react';
import { itemFadeUp, staggerEditorial } from '@/lib/motion';

export default function PrivacySettingsPage() {
  const { preferences, updatePreferences, isCloudConnected } = useAuth();
  const { activities, clearActivityHistory, media, albums } = useMedia();
  const [successNote, setSuccessNote] = useState('');

  const handleClearHistory = async () => {
    if (confirm('Clear all session memory records? (Your photographs and monographs will remain untouched)')) {
      await clearActivityHistory();
      setSuccessNote('Memory logs purged.');
      setTimeout(() => setSuccessNote(''), 3000);
    }
  };

  const handleExportData = () => {
    const backup = {
      export_date: new Date().toISOString(),
      platform: 'PHOTON Studio',
      version: '2.0.0-editorial',
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
    a.download = `photon-vault-manifest-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccessNote('Master JSON catalog archive exported.');
    setTimeout(() => setSuccessNote(''), 3000);
  };

  return (
    <AppLayout>
      <motion.div
        variants={staggerEditorial}
        initial="hidden"
        animate="show"
        className="max-w-3xl space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemFadeUp} className="pb-6 border-b border-photon-border">
          <div className="flex items-center space-x-2 text-[11px] font-mono tracking-widest text-accent-gold uppercase mb-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Sovereign Security</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-white">
            Privacy & Trust Architecture
          </h1>
          <p className="text-xs font-mono text-photon-muted mt-1">
            Auditable, zero-compromise personal boundary enforcement
          </p>
        </motion.div>

        {successNote && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-xs font-mono flex items-center gap-2"
          >
            <Check className="h-4 w-4 shrink-0" />
            <span>{successNote}</span>
          </motion.div>
        )}

        {/* Security Principles Checklist */}
        <motion.div
          variants={itemFadeUp}
          className="p-6 sm:p-8 rounded-3xl bg-photon-card border border-photon-border shadow-soft space-y-4"
        >
          <h3 className="font-serif text-xl font-normal text-white">
            Active Architectural Safeguards
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-photon-dark border border-photon-border">
              <CheckCircle2 className="h-4 w-4 text-accent-emerald shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-sm font-normal text-white">
                  Zero AI Ingestion
                </p>
                <p className="text-photon-muted text-[11px] mt-0.5 font-sans font-light">
                  Photographs are never fed into machine learning pipelines, facial indexing models, or synthetic generative networks.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-photon-dark border border-photon-border">
              <CheckCircle2 className="h-4 w-4 text-accent-emerald shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-sm font-normal text-white">
                  Browser-Native Cryptography
                </p>
                <p className="text-photon-muted text-[11px] mt-0.5 font-sans font-light">
                  SHA-256 fingerprinting and 64-bit dHash perceptual matrix computation occur inside your local browser runtime via Web Crypto.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3.5 rounded-2xl bg-photon-dark border border-photon-border">
              <CheckCircle2 className="h-4 w-4 text-accent-emerald shrink-0 mt-0.5" />
              <div>
                <p className="font-serif text-sm font-normal text-white">
                  PostgreSQL Row-Level Security (RLS)
                </p>
                <p className="text-photon-muted text-[11px] mt-0.5 font-sans font-light">
                  If Supabase sync is enabled, every query is mathematically isolated by auth.uid() at the kernel level.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Personal Memory Session History */}
        <motion.div
          variants={itemFadeUp}
          className="p-6 sm:p-8 rounded-3xl bg-photon-card border border-photon-border shadow-soft"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-xl font-normal text-white flex items-center gap-2">
                <History className="h-4 w-4 text-accent-titanium" />
                Continuity Memory History
              </h3>
              <p className="text-xs font-mono text-photon-muted mt-0.5">
                Activity logs that power the &ldquo;Continue where you left off&rdquo; experience
              </p>
            </div>

            {activities.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-accent-crimson/30 bg-accent-crimson/10 text-accent-crimson text-xs font-mono uppercase tracking-wider hover:bg-accent-crimson hover:text-white transition-colors"
              >
                <Trash2 className="h-3 w-3" />
                <span>Purge History</span>
              </button>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
            {activities.length === 0 ? (
              <p className="text-photon-muted italic py-6 text-center text-xs">
                No continuity memory records logged.
              </p>
            ) : (
              activities.slice(0, 15).map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-photon-dark border border-photon-border/80"
                >
                  <span className="text-white font-sans text-xs">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-photon-muted">
                    {new Date(act.created_at).toLocaleDateString()} {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Export Data Archive */}
        <motion.div
          variants={itemFadeUp}
          className="p-6 sm:p-8 rounded-3xl bg-photon-card border border-photon-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <h3 className="font-serif text-xl font-normal text-white flex items-center gap-2">
              <Download className="h-4 w-4 text-accent-gold" />
              Export Vault Manifest
            </h3>
            <p className="text-xs font-sans text-photon-light font-light mt-0.5">
              Download complete structured JSON manifest of all cryptographic digests, EXIF tags, and monographs.
            </p>
          </div>

          <button
            onClick={handleExportData}
            className="flex items-center space-x-2 px-6 py-3 rounded-full bg-photon-ivory hover:bg-white text-photon-obsidian font-mono text-xs uppercase tracking-wider font-semibold transition-all shadow-soft shrink-0"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export JSON</span>
          </button>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
