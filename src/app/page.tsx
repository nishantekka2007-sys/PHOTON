'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  Camera,
  Layers,
  Sparkles,
  CopyCheck,
  HardDrive,
  ArrowRight,
  Plus,
  Minus,
  Check,
  Calendar,
  Sliders,
  Maximize2,
  FileCheck
} from 'lucide-react';
import { staggerEditorial, itemFadeUp, easeEditorial } from '@/lib/motion';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const sampleMemories = [
    {
      title: 'Dolomites Ridge at Sunrise',
      location: 'Val di Funes, Italy',
      exif: '35mm • ƒ/2.8 • 1/500s • ISO 100',
      gradient: 'from-stone-900 via-neutral-900 to-black',
      tag: 'Landscape',
      year: '2025',
    },
    {
      title: 'Architectural Shadow Studies',
      location: 'Kyoto, Japan',
      exif: '50mm • ƒ/1.4 • 1/1000s • ISO 64',
      gradient: 'from-zinc-900 via-stone-900 to-black',
      tag: 'Monochrome',
      year: '2025',
    },
    {
      title: 'Golden Hour on Pacific Coast',
      location: 'Big Sur, California',
      exif: '85mm • ƒ/2.0 • 1/250s • ISO 200',
      gradient: 'from-amber-950/40 via-neutral-900 to-black',
      tag: 'Portrait',
      year: '2026',
    },
  ];

  const pillars = [
    {
      index: '01',
      title: 'Client-Side Cryptography',
      desc: 'Bit-for-bit SHA-256 digests and 64-bit perceptual dHash calculations run in your local browser sandbox. Your unhashed media never touches third-party AI processors.',
    },
    {
      index: '02',
      title: 'Editorial Album Monographs',
      desc: 'Organize your work into exhibitions, family archives, and projects. Every collection preserves full EXIF camera parameters and geolocation precision.',
    },
    {
      index: '03',
      title: 'Intelligent Space Reclamation',
      desc: 'Perceptual hashing distinguishes exact duplicates from burst sequences, presenting side-by-side comparisons so you reclaim storage with absolute certainty.',
    },
    {
      index: '04',
      title: 'Zero-Cost Sovereign Vault',
      desc: 'Built on PostgreSQL Row Level Security (RLS) and IndexedDB local storage. 100% free forever with no credit cards, subscriptions, or predatory upgrades.',
    },
  ];

  const faqs = [
    {
      q: 'Why build PHOTON with a zero-rupee / zero-dollar budget?',
      a: 'We believe personal memories should not be held hostage by perpetual monthly subscriptions. By architecting PHOTON on generous open-source technologies, local browser sandboxing (IndexedDB), and free-tier PostgreSQL, we deliver commercial-grade photo management without financial barriers.',
    },
    {
      q: 'Will PHOTON ever train machine learning models on my photographs?',
      a: 'Never. Big-tech cloud providers quietly scrape personal photos to train generative image generators and facial recognition algorithms. PHOTON strictly prohibits AI ingestion. Media analysis (deduplication and metadata parsing) occurs entirely on your device.',
    },
    {
      q: 'How does PHOTON compare to Apple Photos or Google Photos?',
      a: 'Unlike closed ecosystems that lock you into proprietary hardware or harvest your browsing habits for advertising, PHOTON is sovereign and open. You can run it 100% offline via local IndexedDB or sync to your own private Supabase database where every single row is isolated by kernel-level security policies.',
    },
    {
      q: 'Can I export all my data at any time?',
      a: 'Yes. With a single click in Privacy Settings, you can download a complete, structured JSON manifest of all media catalogs, EXIF capture dates, camera parameters, and album hierarchies.',
    },
  ];

  return (
    <div className="min-h-screen bg-photon-obsidian text-photon-ivory selection:bg-neutral-700 selection:text-white film-grain">
      {/* Editorial Header */}
      <header className="sticky top-0 z-40 w-full border-b border-photon-border/80 bg-photon-obsidian/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="font-serif text-2xl tracking-widest text-white uppercase font-normal">
              PHOTON
            </span>
            <span className="text-[10px] tracking-cinema font-mono text-accent-titanium uppercase pl-2 border-l border-photon-subtle">
              Memories &bull; Vault
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-wider text-photon-muted">
            <a href="#exhibition" className="hover:text-white transition-colors uppercase">Exhibition</a>
            <a href="#manifesto" className="hover:text-white transition-colors uppercase">Manifesto</a>
            <a href="#architecture" className="hover:text-white transition-colors uppercase">Architecture</a>
            <a href="#faq" className="hover:text-white transition-colors uppercase">Inquiries</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="text-xs font-mono tracking-wider text-photon-light hover:text-white transition-colors uppercase"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase bg-photon-ivory hover:bg-white text-photon-obsidian font-semibold transition-all shadow-soft active:scale-[0.98]"
            >
              <span>Enter Vault</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section: Editorial & Cinematic */}
      <section className="relative pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <motion.div
          variants={staggerEditorial}
          initial="hidden"
          animate="show"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemFadeUp} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-photon-border bg-photon-card/80 text-[11px] font-mono tracking-wider text-photon-light mb-8">
            <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
            <span>Sovereign Storage &bull; Zero AI Training &bull; Complete Privacy</span>
          </motion.div>

          <motion.h1
            variants={itemFadeUp}
            className="font-serif text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-white leading-[1.08] mb-8"
          >
            Every memory deserves a <span className="italic font-serif text-photon-light">beautiful home.</span>
          </motion.h1>

          <motion.p
            variants={itemFadeUp}
            className="text-base sm:text-lg text-photon-light max-w-2xl mx-auto font-sans leading-relaxed tracking-normal font-light mb-10"
          >
            Your photos and videos, organized intelligently and kept strictly under your control. Engineered with browser-native cryptographic hashing, perceptual deduplication, and zero corporate tracking.
          </motion.p>

          <motion.div
            variants={itemFadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs font-mono"
          >
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-photon-ivory text-photon-obsidian font-semibold tracking-cinema uppercase hover:bg-white transition-all shadow-cinema active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Open Personal Gallery</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/auth/login"
              className="w-full sm:w-auto px-8 py-4 rounded-full border border-photon-border bg-photon-card/50 text-photon-light hover:text-white hover:border-photon-subtle tracking-cinema uppercase transition-colors flex items-center justify-center gap-2"
            >
              <Lock className="h-3.5 w-3.5 text-accent-titanium" />
              <span>Explore Offline Sandbox</span>
            </Link>
          </motion.div>
        </motion.div>

        {/* Cinematic Exhibition Preview Stage */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 border border-photon-border/90 rounded-3xl bg-photon-dark/95 p-4 sm:p-7 shadow-cinema relative overflow-hidden"
        >
          {/* Subtle Aperture watermark */}
          <div className="flex items-center justify-between pb-5 border-b border-photon-border text-xs font-mono text-photon-muted">
            <div className="flex items-center space-x-3">
              <span className="h-2.5 w-2.5 rounded-full bg-accent-gold" />
              <span className="tracking-cinema uppercase text-photon-light font-semibold">PHOTON &bull; Exhibition Deck</span>
            </div>
            <div className="flex items-center space-x-6 text-[11px]">
              <span>ENCRYPTED POSTGRESQL RLS</span>
              <span className="hidden sm:inline">&bull;</span>
              <span className="hidden sm:inline">SHA-256 VERIFIED</span>
            </div>
          </div>

          {/* Exhibition Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {sampleMemories.map((mem, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-photon-border/80 bg-photon-card p-3 flex flex-col justify-between transition-all hover:border-photon-subtle"
              >
                <div className={`aspect-[4/3] w-full rounded-xl bg-gradient-to-br ${mem.gradient} relative overflow-hidden flex items-end p-4 border border-white/5`}>
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono text-photon-light border border-white/10 uppercase">
                    {mem.tag}
                  </div>
                  <div className="absolute top-3 right-3 text-[10px] font-mono text-photon-muted">
                    {mem.year}
                  </div>
                  <div className="relative z-10">
                    <p className="font-serif text-lg text-white font-normal leading-snug">
                      {mem.title}
                    </p>
                    <p className="text-[11px] font-sans text-photon-muted mt-0.5">
                      {mem.location}
                    </p>
                  </div>
                </div>

                <div className="pt-3 px-1 flex items-center justify-between text-[11px] font-mono text-photon-muted">
                  <span className="flex items-center gap-1.5">
                    <Camera className="h-3 w-3 text-accent-titanium" />
                    {mem.exif}
                  </span>
                  <span className="text-[10px] uppercase text-accent-emerald flex items-center gap-1">
                    <Check className="h-3 w-3" /> Bit-Exact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Manifesto Section */}
      <section id="manifesto" className="py-24 px-6 border-t border-photon-border bg-photon-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono tracking-widest text-accent-gold uppercase">
              Our Design Philosophy
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mt-3 leading-tight">
              An antidote to the corporatization of memories.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((p) => (
              <div key={p.index} className="border-t border-photon-border pt-6 space-y-3">
                <span className="text-xs font-mono text-photon-muted">{p.index}</span>
                <h3 className="font-serif text-xl font-normal text-white">{p.title}</h3>
                <p className="text-xs font-sans text-photon-light leading-relaxed font-light">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture Comparison */}
      <section id="architecture" className="py-24 px-6 border-t border-photon-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-xs font-mono tracking-widest text-accent-titanium uppercase">
              Sovereignty Comparison
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal mt-2">
              How PHOTON differs by design
            </h2>
          </div>

          <div className="border border-photon-border rounded-3xl overflow-hidden bg-photon-card/60">
            <div className="grid grid-cols-2 p-5 border-b border-photon-border text-xs font-mono tracking-wider uppercase text-photon-muted bg-photon-dark">
              <span>Standard Cloud Services</span>
              <span className="text-white font-semibold">PHOTON Architecture</span>
            </div>

            <div className="divide-y divide-photon-border/60 text-xs font-sans">
              <div className="grid grid-cols-2 p-5">
                <span className="text-photon-muted pr-4">Photos mined to train commercial AI models without compensation</span>
                <span className="text-white font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent-emerald shrink-0" /> Zero AI training. Cryptographic local isolation.
                </span>
              </div>
              <div className="grid grid-cols-2 p-5">
                <span className="text-photon-muted pr-4">Forced monthly subscription renewals with locked-in export formats</span>
                <span className="text-white font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent-emerald shrink-0" /> 100% free open-source stack. One-click open JSON export.
                </span>
              </div>
              <div className="grid grid-cols-2 p-5">
                <span className="text-photon-muted pr-4">Cluttered advertising dashboards filled with promotional banners</span>
                <span className="text-white font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent-emerald shrink-0" /> Art-directed exhibition space dedicated purely to images.
                </span>
              </div>
              <div className="grid grid-cols-2 p-5">
                <span className="text-photon-muted pr-4">Opaque server algorithms and hidden duplicate file accumulation</span>
                <span className="text-white font-medium flex items-center gap-2">
                  <Check className="h-4 w-4 text-accent-emerald shrink-0" /> Transparent 64-bit dHash perceptual scanner with visual diffing.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiries / FAQ */}
      <section id="faq" className="py-24 px-6 border-t border-photon-border bg-photon-dark/30">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14">
            <span className="text-xs font-mono tracking-widest text-accent-gold uppercase">
              Clarity & Transparency
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal mt-2">
              Frequently Asked Inquiries
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-photon-border rounded-2xl bg-photon-card/40 overflow-hidden transition-colors hover:border-photon-subtle"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-sm font-sans font-medium text-white"
                >
                  <span>{faq.q}</span>
                  <span className="p-1 text-photon-muted">
                    {openFaq === idx ? (
                      <Minus className="h-4 w-4 text-white" />
                    ) : (
                      <Plus className="h-4 w-4 text-photon-muted" />
                    )}
                  </span>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="px-5 pb-5 text-xs text-photon-light leading-relaxed border-t border-photon-border/50 pt-3 font-light"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-28 px-6 border-t border-photon-border text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <span className="text-xs font-mono tracking-widest text-accent-titanium uppercase mb-3 block">
            Your Private Archive Awaits
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl text-white font-normal tracking-tight mb-6 leading-tight">
            Curate your life with intentionality.
          </h2>
          <p className="text-sm font-sans text-photon-light max-w-md mx-auto mb-8 font-light">
            Start organizing your personal media today. No credit cards, no corporate trackers, no compromises.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-photon-ivory hover:bg-white text-photon-obsidian font-mono text-xs tracking-cinema uppercase font-semibold transition-all shadow-cinema active:scale-[0.98]"
          >
            <span>Launch PHOTON Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* Minimalist Editorial Footer */}
      <footer className="border-t border-photon-border py-12 px-6 text-xs font-mono text-photon-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-white tracking-widest uppercase text-sm">PHOTON</span>
            <span className="text-photon-subtle">&bull;</span>
            <span>Every memory deserves a beautiful home.</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <span>POSTGRESQL RLS ENFORCED</span>
            <span>INDEXEDDB SANDBOX</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
