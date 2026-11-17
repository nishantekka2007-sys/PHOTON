'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  CopyCheck, 
  Layers, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  ShieldCheck, 
  Camera,
  FolderPlus,
  ArrowRight,
  Disc,
  Info
} from 'lucide-react';
import { springTactile, springBouncy } from '@/lib/motion';

interface DemoPhoto {
  id: string;
  title: string;
  thumb: string;
  exif: string;
  category: 'arch' | 'landscape' | 'duplicate' | 'portrait';
  targetAlbum: string;
  targetAlbumId: string;
}

const DEMO_NEGATIVES: DemoPhoto[] = [
  {
    id: 'demo_neg_1',
    title: 'Kyoto Pavilion (Original)',
    thumb: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    exif: '38mm • ƒ/2.8',
    category: 'arch',
    targetAlbum: 'Modernist Geometry',
    targetAlbumId: 'album_arch',
  },
  {
    id: 'demo_neg_2',
    title: 'Kyoto Pavilion (100% Duplicate)',
    thumb: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80',
    exif: 'SHA-256 Match',
    category: 'duplicate',
    targetAlbum: 'Quarantine Tray',
    targetAlbumId: 'album_dup',
  },
  {
    id: 'demo_neg_3',
    title: 'Seceda Ridge Sunset',
    thumb: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
    exif: '50mm • ƒ/1.4',
    category: 'landscape',
    targetAlbum: 'Alpine Solitude',
    targetAlbumId: 'album_land',
  },
  {
    id: 'demo_neg_4',
    title: 'Studio Silhouette',
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    exif: '85mm • ƒ/1.8',
    category: 'portrait',
    targetAlbum: 'Nocturnal Studies',
    targetAlbumId: 'album_port',
  },
];

export function SignatureSpatialSorter() {
  const [stage, setStage] = useState<'idle' | 'scanning' | 'sorted'>('idle');
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(-1);

  const startDemonstration = () => {
    setStage('scanning');
    setActivePhotoIdx(0);

    setTimeout(() => setActivePhotoIdx(1), 600);
    setTimeout(() => setActivePhotoIdx(2), 1200);
    setTimeout(() => setActivePhotoIdx(3), 1800);

    setTimeout(() => {
      setStage('sorted');
      setActivePhotoIdx(-1);
    }, 2400);
  };

  const resetDemonstration = () => {
    setStage('idle');
    setActivePhotoIdx(-1);
  };

  return (
    <div className="relative rounded-3xl border border-stone-200 dark:border-photon-border bg-warm-50 dark:bg-photon-dark p-6 sm:p-10 shadow-soft overflow-hidden select-none transition-colors">
      {/* Editorial Demonstration Notice Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-photon-border">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono tracking-widest text-accent-gold uppercase mb-1">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Visual Demonstration</span>
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl font-normal text-stone-900 dark:text-photon-ivory">
            The Spatial Organization Chamber
          </h3>
          <p className="text-xs font-sans text-stone-600 dark:text-warm-700 mt-1 font-light max-w-xl">
            Watch photographic negatives undergo client-side cryptographic analysis, spatial sorting into monographs, and automatic duplicate isolation with spring physics.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          {stage === 'idle' && (
            <button
              onClick={startDemonstration}
              className="flex items-center space-x-2 px-6 py-3 rounded-full bg-stone-900 dark:bg-photon-ivory text-photon-ivory dark:text-photon-obsidian font-semibold transition-all shadow-soft active:scale-[0.98] uppercase tracking-wider hover:opacity-90"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Demonstrate Sort</span>
            </button>
          )}

          {stage === 'scanning' && (
            <div className="flex items-center space-x-2.5 px-5 py-2.5 rounded-full border border-accent-gold/40 bg-accent-gold/10 text-accent-gold uppercase tracking-wider text-[11px]">
              <Disc className="h-3.5 w-3.5 animate-spin" />
              <span>Scanning Optics & SHA-256...</span>
            </div>
          )}

          {stage === 'sorted' && (
            <button
              onClick={resetDemonstration}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full border border-stone-300 dark:border-photon-border bg-white dark:bg-photon-card text-stone-800 dark:text-photon-ivory uppercase tracking-wider transition-all active:scale-[0.98] hover:bg-stone-50 dark:hover:bg-photon-border"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Replay Spatial Motion</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8 min-h-[380px] items-center">
        {/* Left: Raw Intake Tray */}
        <div className="lg:col-span-5 border border-dashed border-stone-300 dark:border-photon-border rounded-3xl p-5 bg-white/70 dark:bg-photon-card/50 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500 dark:text-warm-600 mb-4 pb-2 border-b border-stone-200 dark:border-photon-border/60">
            <span className="uppercase tracking-wider">Raw Ingestion Tray</span>
            <span>{stage === 'sorted' ? '0 Unassigned' : `${DEMO_NEGATIVES.length} Negatives`}</span>
          </div>

          <div className="grid grid-cols-2 gap-3 relative min-h-[220px]">
            <AnimatePresence>
              {stage !== 'sorted' ? (
                DEMO_NEGATIVES.map((neg, idx) => (
                  <motion.div
                    key={neg.id}
                    layoutId={neg.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      borderColor: activePhotoIdx === idx ? '#d4af37' : undefined,
                      boxShadow: activePhotoIdx === idx ? '0 10px 25px rgba(212, 175, 55, 0.25)' : 'none'
                    }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={springTactile}
                    className="relative rounded-2xl overflow-hidden border border-stone-200 dark:border-photon-border bg-stone-100 dark:bg-photon-dark p-2.5 text-left transition-colors"
                  >
                    <div className="aspect-[4/3] w-full rounded-xl overflow-hidden bg-black mb-2 relative">
                      <img src={neg.thumb} alt={neg.title} className="h-full w-full object-cover" />
                      {activePhotoIdx === idx && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-accent-gold/30 backdrop-blur-[1px] flex items-center justify-center"
                        >
                          <span className="text-[9px] font-mono font-bold text-photon-ivory bg-black/85 px-2 py-0.5 rounded-full border border-white/20 uppercase">
                            Hashing
                          </span>
                        </motion.div>
                      )}
                    </div>
                    <p className="text-xs font-serif text-stone-900 dark:text-photon-ivory truncate font-normal">{neg.title}</p>
                    <p className="text-[10px] font-mono text-stone-500 dark:text-warm-600">{neg.exif}</p>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-2 py-16 text-center text-xs font-mono text-stone-500 dark:text-warm-600 flex flex-col items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-accent-emerald mb-2 opacity-90" />
                  <span className="font-serif text-sm text-stone-800 dark:text-photon-ivory">All exposures organized</span>
                  <span className="text-[11px] mt-0.5">Dispatched to monographs & quarantine tray.</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-2 text-[10px] font-mono text-stone-400 dark:text-warm-600 flex items-center justify-between">
            <span>BIT-EXACT SHA-256</span>
            <span>CLIENT-SIDE SANDBOX</span>
          </div>
        </div>

        {/* Center: Aperture Vector Arrow */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center text-stone-400 dark:text-warm-600">
          <motion.div
            animate={{ 
              x: stage === 'scanning' ? [0, 8, 0] : 0,
              scale: stage === 'scanning' ? [1, 1.1, 1] : 1
            }}
            transition={{ duration: 0.7, repeat: Infinity }}
            className="h-12 w-12 rounded-full border border-stone-300 dark:border-photon-border bg-white dark:bg-photon-card flex items-center justify-center text-stone-700 dark:text-warm-700 shadow-soft"
          >
            <ArrowRight className="h-5 w-5" />
          </motion.div>
          <span className="text-[10px] font-mono uppercase tracking-widest mt-2">
            {stage === 'scanning' ? 'Analyzing...' : 'Spatial Vector'}
          </span>
        </div>

        {/* Right: Target Monograph Binders & Quarantine */}
        <div className="lg:col-span-5 space-y-3.5 h-full flex flex-col justify-between">
          <div className="text-xs font-mono text-stone-500 dark:text-warm-600 uppercase tracking-wider mb-1 flex justify-between">
            <span>Destination Vault Collections</span>
            <span>Local IndexedDB</span>
          </div>

          {/* Monograph 1: Architecture */}
          <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-photon-border bg-white dark:bg-photon-card flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-accent-gold/15 border border-accent-gold/30 flex items-center justify-center text-accent-gold text-xs font-serif font-bold">
                MG
              </div>
              <div>
                <p className="font-serif text-sm text-stone-900 dark:text-photon-ivory">Modernist Geometry</p>
                <p className="text-[10px] font-mono text-stone-500 dark:text-warm-600">
                  {stage === 'sorted' ? '25 Negatives (+1 incoming)' : '24 Negatives'}
                </p>
              </div>
            </div>
            {stage === 'sorted' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={springBouncy}
                className="text-[10px] font-mono text-accent-emerald px-2 py-0.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/30 font-medium"
              >
                +1 Bound
              </motion.span>
            )}
          </div>

          {/* Monograph 2: Landscape */}
          <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-photon-border bg-white dark:bg-photon-card flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 text-xs font-serif font-bold">
                AS
              </div>
              <div>
                <p className="font-serif text-sm text-stone-900 dark:text-photon-ivory">Alpine Solitude</p>
                <p className="text-[10px] font-mono text-stone-500 dark:text-warm-600">
                  {stage === 'sorted' ? '15 Negatives (+1 incoming)' : '14 Negatives'}
                </p>
              </div>
            </div>
            {stage === 'sorted' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={springBouncy}
                className="text-[10px] font-mono text-accent-emerald px-2 py-0.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/30 font-medium"
              >
                +1 Bound
              </motion.span>
            )}
          </div>

          {/* Monograph 3: Portrait / Night */}
          <div className="p-3.5 rounded-2xl border border-stone-200 dark:border-photon-border bg-white dark:bg-photon-card flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 text-xs font-serif font-bold">
                NS
              </div>
              <div>
                <p className="font-serif text-sm text-stone-900 dark:text-photon-ivory">Nocturnal Studies</p>
                <p className="text-[10px] font-mono text-stone-500 dark:text-warm-600">
                  {stage === 'sorted' ? '19 Negatives (+1 incoming)' : '18 Negatives'}
                </p>
              </div>
            </div>
            {stage === 'sorted' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={springBouncy}
                className="text-[10px] font-mono text-accent-emerald px-2 py-0.5 rounded-full bg-accent-emerald/10 border border-accent-emerald/30 font-medium"
              >
                +1 Bound
              </motion.span>
            )}
          </div>

          {/* Duplicate Quarantine Tray */}
          <div className="p-3.5 rounded-2xl border border-red-200 dark:border-red-950/60 bg-red-50/60 dark:bg-red-950/20 flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-accent-crimson text-xs">
                <CopyCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-serif text-sm text-stone-900 dark:text-photon-ivory">Duplicate Quarantine Tray</p>
                <p className="text-[10px] font-mono text-accent-crimson">
                  {stage === 'sorted' ? '1 Duplicate Flagged &bull; 14.2 MB Reclaimable' : '0 Pending Duplicates'}
                </p>
              </div>
            </div>
            {stage === 'sorted' && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={springBouncy}
                className="text-[10px] font-mono text-accent-crimson px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-800 font-semibold uppercase"
              >
                Flagged
              </motion.span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

