'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
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
  FileCheck,
  Disc,
  Lock,
  BookOpen,
  Info,
  Server,
  DownloadCloud
} from 'lucide-react';
import { FloatingHeroMontage } from '@/components/studio/FloatingHeroMontage';
import { SignatureSpatialSorter } from '@/components/studio/SignatureSpatialSorter';
import { staggerCascade, spatialFadeUp } from '@/lib/motion';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const sampleMemories = [
    {
      title: 'Brutalist Concrete Studies',
      location: 'Kyoto, Japan',
      exif: '38mm • ƒ/2.8 • 1/400s • ISO 64',
      camera: 'Hasselblad X2D 100C',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85',
      tag: 'Architecture',
      aspect: 'aspect-[3/4]',
      colSpan: 'md:col-span-1',
    },
    {
      title: 'Seceda Ridge Alpenglow',
      location: 'Val Gardena, Dolomites',
      exif: '50mm • ƒ/1.4 • 1/1000s • ISO 125',
      camera: 'Leica M11 Monochrom',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85',
      tag: 'Master Landscape',
      aspect: 'aspect-[16/10]',
      colSpan: 'md:col-span-2',
    },
    {
      title: 'Nocturnal Shinjuku Transit',
      location: 'Tokyo, Japan',
      exif: '35mm • ƒ/1.4 • 1/60s • ISO 1600',
      camera: 'Fujifilm GFX 100 II',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=85',
      tag: 'Night Series',
      aspect: 'aspect-square',
      colSpan: 'md:col-span-1',
    },
    {
      title: 'Studio Portrait Studies No. 4',
      location: 'Paris, France',
      exif: '85mm • ƒ/1.8 • 1/320s • ISO 100',
      camera: 'Sony A7R V',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
      tag: 'Fine Art Portrait',
      aspect: 'aspect-[4/5]',
      colSpan: 'md:col-span-2',
    },
  ];

  const monographs = [
    {
      title: 'Alpine Solitude: Dolomites',
      desc: 'Vertical limestone spires of Northern Italy during autumnal alpenglow.',
      count: '14 Negatives',
      camera: 'Leica M11 Monochrom',
      cover: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=85',
    },
    {
      title: 'Modernist Geometry',
      desc: 'Architectural shadows, brutalist concrete planes, and structural reflections.',
      count: '24 Negatives',
      camera: 'Hasselblad X2D 100C',
      cover: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85',
    },
    {
      title: 'Nocturnal Studies',
      desc: 'Ambient street illumination, neon diffusion, and available light portraiture.',
      count: '18 Negatives',
      camera: 'Fujifilm GFX 100 II',
      cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=85',
    },
  ];

  const capabilities = [
    {
      title: 'Client-Side Hashing',
      desc: 'SHA-256 digests and 64-bit dHash perceptual matrices compute in your browser sandbox to detect duplicate and burst frames.',
      icon: ShieldCheck,
    },
    {
      title: 'Optics & EXIF Parsing',
      desc: 'Extract and preserve real camera make, model, lens aperture, shutter duration, ISO sensitivity, and GPS coordinates without destructive recompression.',
      icon: Camera,
    },
    {
      title: 'Spatial Organization Canvas',
      desc: 'Visually sort incoming negatives, arrange media into curated monographs, and drag and drop into destination collections.',
      icon: Sparkles,
    },
    {
      title: 'Sovereign Portability',
      desc: 'Export a complete, structured JSON catalog manifest of your library, album bindings, and optical parameters with a single click.',
      icon: DownloadCloud,
    },
  ];

  const faqs = [
    {
      q: 'How does PHOTON store my photos and videos?',
      a: 'By default, PHOTON operates as a local-first application in your browser using IndexedDB. Your photographs stay on your device without being uploaded to any cloud server. If you configure a Supabase backend, your media can optionally sync to your own PostgreSQL database protected by Row Level Security (RLS).',
    },
    {
      q: 'Are the photographs on this homepage my photos?',
      a: 'No. The photographs shown on the homepage and in the interactive demonstration are illustrative sample exhibition plates from professional photographers, used to demonstrate typography, metadata displays, and motion capabilities. Your own personal library in the Studio is private to you.',
    },
    {
      q: 'Does PHOTON train artificial intelligence on user media?',
      a: 'No. PHOTON does not use your photos or videos to train machine learning models, generate synthetic media, or sell telemetry data to third parties. All image hashing and metadata extraction run locally in your browser.',
    },
    {
      q: 'What are the current hosting and storage limits?',
      a: 'In local-first mode, storage is limited only by your browser’s IndexedDB quota on your device (often tens of gigabytes). When connecting Supabase Cloud storage, free-tier projects offer 1 GB of storage with 50 MB per-file limits. We provide complete transparency about free-tier quotas and avoid misleading claims.',
    },
    {
      q: 'Can I export my entire collection at any time?',
      a: 'Yes. In Privacy Settings, you can export a full structured JSON manifest containing your complete catalog, camera metadata, album hierarchies, and SHA-256 hashes.',
    },
  ];

  return (
    <div className="min-h-screen bg-photon-obsidian text-photon-ivory selection:bg-neutral-800 selection:text-white film-grain">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-photon-border bg-photon-obsidian/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="font-serif text-2xl tracking-widest text-white uppercase font-normal">
              PHOTON
            </span>
            <span className="text-[10px] tracking-wider font-mono text-photon-muted uppercase pl-2 border-l border-photon-subtle hidden sm:inline">
              Personal Media Platform
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-wider text-photon-muted">
            <Link href="/dashboard" className="hover:text-white transition-colors uppercase">Studio</Link>
            <a href="#spatial-studio" className="hover:text-white transition-colors uppercase">Spatial Studio</a>
            <a href="#collections" className="hover:text-white transition-colors uppercase">Collections</a>
            <a href="#privacy" className="hover:text-white transition-colors uppercase">Privacy</a>
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
              <span>Launch Studio</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section: Integrated Side-by-Side Spatial Architecture */}
      <section className="relative px-6 max-w-7xl mx-auto min-h-[calc(100vh-4.5rem)] flex items-center py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left Column: Memorable Editorial Typography & Immediate Action */}
          <motion.div
            variants={staggerCascade}
            initial="hidden"
            animate="show"
            className="lg:col-span-5 flex flex-col justify-center text-left"
          >
            <motion.div variants={spatialFadeUp} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full border border-photon-border bg-photon-card/90 text-[10px] sm:text-[11px] font-mono tracking-wider text-photon-light mb-6 self-start">
              <ShieldCheck className="h-3.5 w-3.5 text-accent-emerald" />
              <span>Privacy-First &bull; Local-First Architecture &bull; Zero AI Ingestion</span>
            </motion.div>

            <motion.h1
              variants={spatialFadeUp}
              className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-white leading-[1.06] mb-6"
            >
              Every memory deserves a <span className="italic font-serif text-photon-light">beautiful home.</span>
            </motion.h1>

            <motion.p
              variants={spatialFadeUp}
              className="text-sm sm:text-base text-photon-light max-w-xl font-sans leading-relaxed tracking-normal font-light mb-8"
            >
              One beautiful space for your photographs and videos. Organize your memories, explore every detail with medium-format precision, and keep control of your personal collection.
            </motion.p>

            <motion.div
              variants={spatialFadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 text-xs font-mono"
            >
              <Link
                href="/dashboard"
                className="px-7 py-3.5 rounded-full bg-photon-ivory text-photon-obsidian font-semibold tracking-wider uppercase hover:bg-white transition-all shadow-cinema active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Explore Your Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="#spatial-studio"
                className="px-6 py-3.5 rounded-full border border-photon-border bg-photon-card/50 text-photon-light hover:text-white hover:border-photon-subtle tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
                <span>Discover Spatial Studio</span>
              </a>
            </motion.div>

            <motion.div
              variants={spatialFadeUp}
              className="mt-8 pt-6 border-t border-photon-border/60 flex items-center gap-6 text-[11px] font-mono text-photon-muted"
            >
              <span className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-accent-emerald" /> Local-First IndexedDB
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-accent-titanium" /> Optional Supabase RLS
              </span>
              <span className="flex items-center gap-1.5">
                <HardDrive className="h-3 w-3 text-accent-gold" /> Open-Source Foundation
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Multi-Depth Floating Photographic Montage Prominently in First Viewport */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center">
            <div className="w-full">
              <div className="flex items-center justify-between text-[10px] font-mono text-photon-muted px-2 mb-2">
                <span className="flex items-center gap-1">
                  <Info className="h-3 w-3 text-accent-gold" /> Illustrative Exhibition Gallery
                </span>
                <span>Medium-Format Plates</span>
              </div>
              <FloatingHeroMontage />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Photography Exhibition (Warm Ivory & Cream Editorial Surface) */}
      <section id="exhibition" className="py-24 px-6 bg-[#F5F3ED] text-stone-900 border-t border-stone-200 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-[10px] font-mono text-amber-900 font-semibold uppercase tracking-wider mb-2">
                <Info className="h-3 w-3 text-amber-800" /> Illustrative Sample Collection
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 mt-1">
                Preserved with medium-format precision.
              </h2>
            </div>
            <p className="text-xs font-sans text-stone-600 max-w-md font-light leading-relaxed">
              Every negative in the studio preserves true focal length, aperture, shutter timing, and ISO sensitivity without destructive recompression or tracking telemetry.
            </p>
          </div>

          {/* Asymmetric Editorial Gallery with Varied Aspect Ratios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleMemories.map((mem, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className={`group relative rounded-3xl overflow-hidden border border-stone-200/90 bg-white p-4 shadow-sm hover:shadow-cinema transition-all flex flex-col justify-between ${mem.colSpan}`}
              >
                <div className={`w-full ${mem.aspect} rounded-2xl overflow-hidden bg-stone-900 relative border border-stone-100`}>
                  <img
                    src={mem.image}
                    alt={mem.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 uppercase tracking-wider">
                    {mem.tag}
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 p-3.5 rounded-xl bg-black/80 backdrop-blur-md text-left">
                    <p className="font-serif text-base text-white">{mem.title}</p>
                    <p className="text-[11px] font-sans text-stone-300 mt-0.5">{mem.location}</p>
                  </div>
                </div>

                <div className="pt-4 px-1 flex items-center justify-between text-[11px] font-mono text-stone-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Camera className="h-3 w-3 text-stone-800" />
                    {mem.camera} &bull; {mem.exif}
                  </span>
                  <span className="text-[10px] uppercase text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Check className="h-3 w-3" /> Bit-Exact SHA-256
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Spatial Studio Preview (Darkroom Chamber) */}
      <section id="spatial-studio" className="py-24 px-6 border-t border-photon-border bg-[#0B0C0E]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-accent-gold uppercase tracking-wider mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Signature Spatial Experience &bull; Interactive Demonstration</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white">
                Spatial Organization Studio
              </h2>
              <p className="text-xs sm:text-sm font-sans text-photon-light mt-1 font-light max-w-2xl">
                Experience how PHOTON organizes your work: incoming photographs are scanned for duplicate binary signatures and routed smoothly into curated monograph collections.
              </p>
            </div>

            <Link
              href="/smart-organize"
              className="px-6 py-3 rounded-full bg-photon-ivory text-photon-obsidian font-mono text-xs uppercase font-semibold tracking-wider hover:bg-white transition-all shadow-soft active:scale-95 shrink-0"
            >
              Open Live Studio Canvas &rarr;
            </Link>
          </div>

          <SignatureSpatialSorter />
        </div>
      </section>

      {/* 5. Collections and Albums Showcase */}
      <section id="collections" className="py-24 px-6 border-t border-photon-border bg-photon-dark/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono tracking-widest text-accent-gold uppercase font-semibold">
                Curated Series
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-white mt-2">
                Physical Monograph Series
              </h2>
            </div>
            <p className="text-xs font-sans text-photon-light max-w-md font-light leading-relaxed">
              Transform raw photograph streams into tactile curated volumes with distinct visual bindings, cover plates, and optics preservation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {monographs.map((mono, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group rounded-3xl overflow-hidden border border-photon-border bg-photon-card p-4 hover:border-photon-subtle transition-all duration-300 flex flex-col justify-between shadow-soft"
              >
                <div className="aspect-[4/3] w-full rounded-2xl bg-black overflow-hidden mb-4 relative border border-white/5">
                  <img
                    src={mono.cover}
                    alt={mono.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-mono text-white border border-white/10 uppercase">
                    Volume 0{idx + 1}
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-xl text-white font-normal group-hover:text-accent-gold transition-colors">
                    {mono.title}
                  </h3>
                  <p className="text-xs font-sans text-photon-light mt-1 font-light leading-relaxed">
                    {mono.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-photon-border/60 flex items-center justify-between text-[11px] font-mono text-photon-muted">
                  <span className="flex items-center gap-1.5">
                    <Camera className="h-3 w-3 text-accent-titanium" />
                    {mono.camera}
                  </span>
                  <span className="text-white font-medium">{mono.count}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Privacy & Data Ownership Architecture */}
      <section id="privacy" className="py-24 px-6 bg-[#F2EFE9] text-stone-900 border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono tracking-widest text-amber-800 uppercase font-semibold">
              Data Ownership & Privacy
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 mt-3 leading-tight">
              An auditable sanctuary for personal memories.
            </h2>
            <p className="text-xs sm:text-sm font-sans text-stone-600 mt-2 font-light leading-relaxed">
              We believe your memories belong strictly to you. PHOTON is engineered so that your photographs remain in your custody.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="border-t border-stone-300 pt-6 space-y-3">
              <span className="text-xs font-mono text-stone-400 font-semibold">01</span>
              <h3 className="font-serif text-xl font-normal text-stone-900">Local-First Sandbox</h3>
              <p className="text-xs font-sans text-stone-600 leading-relaxed font-light">
                IndexedDB stores your library inside your browser sandbox. Your original photographs remain on your local storage device.
              </p>
            </div>
            <div className="border-t border-stone-300 pt-6 space-y-3">
              <span className="text-xs font-mono text-stone-400 font-semibold">02</span>
              <h3 className="font-serif text-xl font-normal text-stone-900">Zero AI Ingestion</h3>
              <p className="text-xs font-sans text-stone-600 leading-relaxed font-light">
                We never scrape or feed personal photos to AI models or facial recognition systems. Hashing and deduplication occur on your device.
              </p>
            </div>
            <div className="border-t border-stone-300 pt-6 space-y-3">
              <span className="text-xs font-mono text-stone-400 font-semibold">03</span>
              <h3 className="font-serif text-xl font-normal text-stone-900">Row Level Security</h3>
              <p className="text-xs font-sans text-stone-600 leading-relaxed font-light">
                When connecting Supabase Cloud sync, PostgreSQL Row Level Security enforces that your user ID alone can query your storage bucket.
              </p>
            </div>
            <div className="border-t border-stone-300 pt-6 space-y-3">
              <span className="text-xs font-mono text-stone-400 font-semibold">04</span>
              <h3 className="font-serif text-xl font-normal text-stone-900">Full JSON Portability</h3>
              <p className="text-xs font-sans text-stone-600 leading-relaxed font-light">
                Export complete structured JSON backup manifests at any time. No proprietary lock-ins or hostage data formats.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Product Capabilities */}
      <section className="py-24 px-6 border-t border-photon-border bg-photon-dark/50">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono tracking-widest text-accent-gold uppercase font-semibold">
              Engineered Capabilities
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white mt-2">
              Technology built for discerning photographers.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-photon-border bg-photon-card p-6 space-y-3"
                >
                  <div className="h-10 w-10 rounded-xl bg-accent-gold/10 border border-accent-gold/20 flex items-center justify-center text-accent-gold">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-lg text-white font-normal">{c.title}</h3>
                  <p className="text-xs font-sans text-photon-light font-light leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section id="faq" className="py-24 px-6 border-t border-photon-border bg-photon-obsidian">
        <div className="max-w-3xl mx-auto">
          <div className="mb-14">
            <span className="text-xs font-mono tracking-widest text-accent-gold uppercase font-semibold">
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

      {/* 9. Final Call to Action */}
      <section className="py-28 px-6 border-t border-photon-border text-center relative overflow-hidden bg-gradient-to-b from-photon-obsidian to-black">
        <div className="max-w-2xl mx-auto relative z-10">
          <span className="text-xs font-mono tracking-widest text-accent-titanium uppercase mb-3 block">
            Your Private Vault Awaits
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl text-white font-normal tracking-tight mb-6 leading-tight">
            Curate your life with intentionality.
          </h2>
          <p className="text-sm font-sans text-photon-light max-w-md mx-auto mb-8 font-light">
            Start organizing your personal media today. Built on free open-source standards, browser-native encryption, and complete user ownership.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-full bg-photon-ivory hover:bg-white text-photon-obsidian font-mono text-xs tracking-wider uppercase font-semibold transition-all shadow-cinema active:scale-[0.98]"
          >
            <span>Launch PHOTON Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      {/* 10. Minimalist Professional Footer */}
      <footer className="border-t border-photon-border py-12 px-6 text-xs font-mono text-photon-muted bg-black">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-white tracking-widest uppercase text-sm">PHOTON</span>
            <span className="text-photon-subtle">&bull;</span>
            <span>Every memory deserves a beautiful home.</span>
          </div>
          <div className="flex items-center space-x-6 text-[11px]">
            <a href="https://github.com/nishantekka2007-sys/PHOTON" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GITHUB SOURCE
            </a>
            <span>POSTGRESQL RLS</span>
            <span>INDEXEDDB SANDBOX</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
