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
  BookOpen
} from 'lucide-react';
import { FloatingHeroMontage } from '@/components/studio/FloatingHeroMontage';
import { SignatureSpatialSorter } from '@/components/studio/SignatureSpatialSorter';
import { staggerCascade, spatialFadeUp, easeEditorial } from '@/lib/motion';

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

  const pillars = [
    {
      index: '01',
      title: 'Client-Side Cryptography',
      desc: 'Bit-for-bit SHA-256 digests and 64-bit perceptual dHash matrices execute entirely within your local browser sandbox. Your unhashed photographs never leave your device without explicit approval.',
    },
    {
      index: '02',
      title: 'Physical Monograph Curations',
      desc: 'Organize your work into curated exhibitions and chronicles. Every collection preserves full camera optics parameters, focal length, aperture, and verified coordinates.',
    },
    {
      index: '03',
      title: 'Perceptual Deduplication Matrix',
      desc: 'Difference hashing distinguishes exact duplicate negatives from intentional high-speed burst sequences, presenting clear side-by-side comparisons to reclaim valuable disk capacity.',
    },
    {
      index: '04',
      title: 'Zero-Cost Sovereign Vault',
      desc: 'Built on PostgreSQL Row Level Security (RLS) and IndexedDB local runtime. 100% free forever with no credit cards, subscription lock-ins, or predatory paywalls.',
    },
  ];

  const faqs = [
    {
      q: 'Why architect PHOTON with a zero-budget philosophy?',
      a: 'We believe personal memories should not be held hostage by perpetual monthly subscriptions. By architecting PHOTON on generous open-source technologies, local browser sandboxing (IndexedDB), and free-tier PostgreSQL, we deliver commercial-grade photo management without financial barriers.',
    },
    {
      q: 'Will PHOTON ever train machine learning models on my photographs?',
      a: 'Never. Commercial cloud providers quietly scrape personal photos to train generative image generators and facial recognition algorithms. PHOTON strictly prohibits AI ingestion. Media analysis (deduplication and metadata parsing) occurs entirely on your device.',
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
    <div className="min-h-screen bg-photon-obsidian text-photon-ivory selection:bg-neutral-800 selection:text-white film-grain">
      {/* Editorial Header */}
      <header className="sticky top-0 z-50 w-full border-b border-photon-border/80 bg-photon-obsidian/95 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <span className="font-serif text-2xl tracking-widest text-white uppercase font-normal">
              PHOTON
            </span>
            <span className="text-[10px] tracking-cinema font-mono text-accent-titanium uppercase pl-2 border-l border-photon-subtle">
              Sovereign &bull; Vault
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-xs font-mono tracking-wider text-photon-muted">
            <a href="#exhibition" className="hover:text-white transition-colors uppercase">Curated Exhibition</a>
            <a href="#spatial-sort" className="hover:text-white transition-colors uppercase">Spatial Studio</a>
            <a href="#monographs" className="hover:text-white transition-colors uppercase">Monographs</a>
            <a href="#manifesto" className="hover:text-white transition-colors uppercase">Philosophy</a>
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

      {/* 1. Cinematic Hero: Integrated Side-by-Side Spatial Architecture */}
      <section className="relative px-6 max-w-7xl mx-auto min-h-[calc(100vh-5rem)] flex items-center py-8 lg:py-14">
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
              <span>Client-Side Cryptography &bull; Zero AI Ingestion &bull; 100% Sovereign</span>
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
              Your photographs and motion negatives, organized with medium-format precision and kept under your sovereign control. Built with client-side SHA-256 fingerprinting, 64-bit perceptual dHash matrices, and zero corporate surveillance.
            </motion.p>

            <motion.div
              variants={spatialFadeUp}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 text-xs font-mono"
            >
              <Link
                href="/dashboard"
                className="px-7 py-3.5 rounded-full bg-photon-ivory text-photon-obsidian font-semibold tracking-wider uppercase hover:bg-white transition-all shadow-cinema active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <span>Launch PHOTON Studio</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <a
                href="#spatial-sort"
                className="px-6 py-3.5 rounded-full border border-photon-border bg-photon-card/50 text-photon-light hover:text-white hover:border-photon-subtle tracking-wider uppercase transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles className="h-3.5 w-3.5 text-accent-gold" />
                <span>Watch Photo Movement</span>
              </a>
            </motion.div>

            <motion.div
              variants={spatialFadeUp}
              className="mt-8 pt-6 border-t border-photon-border/60 flex items-center gap-6 text-[11px] font-mono text-photon-muted"
            >
              <span className="flex items-center gap-1.5">
                <Check className="h-3 w-3 text-accent-emerald" /> 0B Cloud Leakage
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="h-3 w-3 text-accent-titanium" /> IndexedDB Local Vault
              </span>
              <span className="flex items-center gap-1.5">
                <HardDrive className="h-3 w-3 text-accent-gold" /> ₹0 Forever
              </span>
            </motion.div>
          </motion.div>

          {/* Right Column: Multi-Depth Floating Photographic Montage Prominently in First Viewport */}
          <div className="lg:col-span-7 relative w-full flex items-center justify-center">
            <FloatingHeroMontage />
          </div>
        </div>
      </section>

      {/* 2. Interactive Curated Negative Plates Exhibition (Warm Ivory & Cream Editorial Surface) */}
      <section id="exhibition" className="py-24 px-6 bg-[#f7f5ee] text-stone-900 border-t border-stone-200 transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono tracking-widest text-amber-800 uppercase font-semibold">
                Medium-Format Exhibition Plates
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 mt-2">
                Preserved with museum-grade precision.
              </h2>
            </div>
            <p className="text-xs font-sans text-stone-600 max-w-md font-light leading-relaxed">
              Every negative preserves full focal length, shutter timing, aperture, and sensor parameters without cloud compression or telemetry tracking.
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
                    <Check className="h-3 w-3" /> Bit-Exact
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Signature Photo Movement: Live Interactive Spatial Sorter (Cinematic Darkroom Chamber) */}
      <section id="spatial-sort" className="py-24 px-6 border-t border-photon-border bg-[#0b0c0e]">
        <div className="max-w-7xl mx-auto">
          <SignatureSpatialSorter />
        </div>
      </section>

      {/* 4. Curated Monograph Collections Experience (Editorial Book Binders) */}
      <section id="monographs" className="py-24 px-6 border-t border-photon-border bg-photon-dark/80">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-xs font-mono tracking-widest text-accent-gold uppercase font-semibold">
                Curated Publications
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

      {/* 5. Sovereign Covenant Manifesto (Warm Sand / Ivory Editorial Architecture) */}
      <section id="manifesto" className="py-24 px-6 bg-[#f2efe9] text-stone-900 border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-mono tracking-widest text-amber-800 uppercase font-semibold">
              Our Sovereign Covenant
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-900 mt-3 leading-tight">
              An antidote to the corporatization of memories.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pillars.map((p) => (
              <div key={p.index} className="border-t border-stone-300 pt-6 space-y-3">
                <span className="text-xs font-mono text-stone-400 font-semibold">{p.index}</span>
                <h3 className="font-serif text-xl font-normal text-stone-900">{p.title}</h3>
                <p className="text-xs font-sans text-stone-600 leading-relaxed font-light">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Frequently Asked Inquiries (Cinematic Obsidian) */}
      <section id="faq" className="py-24 px-6 border-t border-photon-border bg-photon-obsidian">
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

      {/* 7. Final Call to Action */}
      <section className="py-28 px-6 border-t border-photon-border text-center relative overflow-hidden bg-gradient-to-b from-photon-obsidian to-black">
        <div className="max-w-2xl mx-auto relative z-10">
          <span className="text-xs font-mono tracking-widest text-accent-titanium uppercase mb-3 block">
            Your Private Vault Awaits
          </span>
          <h2 className="font-serif text-4xl sm:text-6xl text-white font-normal tracking-tight mb-6 leading-tight">
            Curate your life with intentionality.
          </h2>
          <p className="text-sm font-sans text-photon-light max-w-md mx-auto mb-8 font-light">
            Start organizing your photographic journey today. No credit cards, no surveillance tracking, zero compromise.
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

      {/* Minimalist Editorial Footer */}
      <footer className="border-t border-photon-border py-12 px-6 text-xs font-mono text-photon-muted bg-black">
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
