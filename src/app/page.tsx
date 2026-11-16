'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  ShieldCheck,
  Lock,
  Layers,
  Sparkles,
  CopyCheck,
  HardDrive,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Camera,
  Play,
  Heart,
  Calendar,
  Smartphone
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'Is PHOTON really 100% free with no credit card required?',
      a: 'Yes. PHOTON is engineered exclusively around open-source tools and generous free-tier cloud infrastructure (Supabase PostgreSQL Free Tier & Vercel Hobby). We do not require a credit card, paid API subscriptions, or hidden upgrades.',
    },
    {
      q: 'How does PHOTON protect my private photos and videos?',
      a: 'Privacy is our core foundation. Media hashing (SHA-256) and perceptual similarity scanning happen entirely inside your web browser sandbox using client-side Web Crypto and Canvas APIs. If you connect Supabase, every record is locked under strict PostgreSQL Row-Level Security (RLS) policies where only your authenticated account can ever read or write your files.',
    },
    {
      q: 'Do you use my photos to train AI models?',
      a: 'Never. We never train AI models on your photos, never run automated facial tracking, never sell data to advertisers, and never employ third-party tracking cookies.',
    },
    {
      q: 'Can I use PHOTON purely offline or locally without cloud upload?',
      a: 'Yes! PHOTON features a complete Local-First mode powered by IndexedDB. You can organize, deduplicate, and curate your personal library directly within your browser without uploading a single byte to the internet.',
    },
    {
      q: 'How does the Duplicate Finder work?',
      a: 'PHOTON calculates both exact SHA-256 cryptographic fingerprints and 64-bit Perceptual Hashes (dHash). Exact duplicates are matched with bit-for-bit precision, while similar photos (such as burst shots or compressed variants) are matched using Hamming distance similarity scoring.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Zap className="h-5 w-5 fill-white text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              PHOTON
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PRIVACY FIRST
              </span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Manifesto</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/auth/login"
              className="px-3.5 py-1.5 text-xs font-medium text-zinc-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 transition-all active:scale-95"
            >
              <span>Launch PHOTON</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-4 sm:px-6 overflow-hidden">
        {/* Subtle radial glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-indigo-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 mb-6">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Zero Tracking • Browser Sandbox AI • 100% Free Forever</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Your memories.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-amber-200">
              Beautifully organized.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            One private, secure home for all your photos and videos. Built with strict client-side encryption, local perceptual deduplication, and zero corporate data harvesting.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
            >
              <Zap className="h-4 w-4" />
              <span>Get Started Free</span>
            </Link>
            <a
              href="#privacy"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full text-sm font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            >
              <Lock className="h-4 w-4 text-zinc-400" />
              <span>Read Privacy Guarantee</span>
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> ₹0 Budget Stack
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> No Credit Card
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Open Source Tech
            </span>
          </div>
        </div>

        {/* Product Preview Card */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-zinc-900/90 border border-zinc-800 shadow-2xl p-3 sm:p-5 relative">
          <div className="flex items-center justify-between pb-3 px-2 border-b border-zinc-800/80 mb-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-rose-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs text-zinc-500 font-mono">photon://library/dashboard</span>
            </div>
            <div className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Isolated User Session</span>
            </div>
          </div>

          {/* Realistic Dashboard Mockup Inside Preview */}
          <div className="bg-zinc-950 rounded-2xl p-5 border border-zinc-800/60">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-zinc-800">
              <div>
                <span className="text-xs text-zinc-400">Personal Memory System</span>
                <h3 className="text-lg font-bold text-white">Welcome back, Traveler</h3>
                <p className="text-xs text-zinc-400">Continue exactly where you left off • 142 items curated</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
                  ⚡ 0 Duplicates Detected
                </span>
                <span className="px-3 py-1.5 rounded-lg bg-indigo-950/60 border border-indigo-800 text-xs text-indigo-300 font-medium">
                  🔒 RLS Encrypted
                </span>
              </div>
            </div>

            {/* Showcase Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="aspect-video rounded-xl bg-gradient-to-br from-indigo-900/40 via-zinc-900 to-zinc-950 border border-zinc-800 p-3 flex flex-col justify-between">
                <Camera className="h-4 w-4 text-indigo-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Mountain Retreat</p>
                  <p className="text-[10px] text-zinc-500">EXIF: Sony A7 IV • 24mm ƒ/2.8</p>
                </div>
              </div>

              <div className="aspect-video rounded-xl bg-gradient-to-br from-violet-900/40 via-zinc-900 to-zinc-950 border border-zinc-800 p-3 flex flex-col justify-between">
                <Play className="h-4 w-4 text-violet-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Coastline 4K</p>
                  <p className="text-[10px] text-zinc-500">01:24 • 60 FPS • 120 MB</p>
                </div>
              </div>

              <div className="aspect-video rounded-xl bg-gradient-to-br from-amber-900/30 via-zinc-900 to-zinc-950 border border-zinc-800 p-3 flex flex-col justify-between">
                <Heart className="h-4 w-4 text-rose-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Golden Hour</p>
                  <p className="text-[10px] text-zinc-500">Favorite • SHA-256 Verified</p>
                </div>
              </div>

              <div className="aspect-video rounded-xl bg-gradient-to-br from-emerald-900/30 via-zinc-900 to-zinc-950 border border-zinc-800 p-3 flex flex-col justify-between">
                <Sparkles className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="text-xs font-semibold text-white">Smart Deduplicated</p>
                  <p className="text-[10px] text-zinc-500">Saved 420 MB space</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 border-t border-zinc-800/80 bg-zinc-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
              Engineered For Complete Ownership
            </h2>
            <h3 className="mt-2 text-3xl font-extrabold text-white">
              Every feature you need. Zero privacy trade-offs.
            </h3>
            <p className="mt-3 text-sm text-zinc-400">
              Commercial-grade photo management built strictly with open-source technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                <CopyCheck className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Perceptual Duplicate Finder</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Uses 64-bit difference hashing (dHash) and SHA-256 to detect exact duplicates and near-identical burst shots right in your browser, saving valuable storage.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-400 mb-4">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Personal Memory System</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                PHOTON remembers your recent albums, active organization sessions, and sorting preferences so you can resume exactly where you left off every time you return.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                <Camera className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">EXIF & Optics Inspector</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Examine full camera metadata: ISO, focal length, aperture, shutter speed, and GPS coordinates mapped with open-source OpenStreetMap.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
                <Calendar className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Timeline & Smart Categorization</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Browse memories seamlessly sorted by year, month, and day. Auto-isolate device screenshots and large video captures with a single click.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-4">
                <HardDrive className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Local-First or Cloud Storage</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Keep your media 100% on your device via browser IndexedDB, or optionally sync to Supabase private storage buckets with strict Row Level Security.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
                <Smartphone className="h-5 w-5" />
              </div>
              <h4 className="text-base font-bold text-white">Fluid Responsive Design</h4>
              <p className="mt-2 text-xs text-zinc-400 leading-relaxed">
                Engineered for desktop monitors, iPads, and mobile phones with dark and light theme options and touch-friendly navigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Manifesto */}
      <section id="privacy" className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 p-8 sm:p-12">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Our Privacy Guarantee</h3>
              <p className="text-xs text-zinc-400">Written into the architecture, not just the policy</p>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>No AI Training on User Media:</strong> We will never use your family pictures, personal moments, or creative work to train machine learning models.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>Strict Row-Level Security:</strong> Supabase PostgreSQL isolates each account at the database kernel level. Other accounts cannot access your records.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>No Tracking & No Ads:</strong> Zero commercial advertising SDKs, zero cross-site trackers, zero telemetry reselling.
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <p>
                <strong>Client-Side Hashing:</strong> SHA-256 and Perceptual Hashing run inside your browser. No third-party AI APIs ever touch your unhashed media.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Architecture Section */}
      <section id="architecture" className="py-20 px-4 sm:px-6 border-t border-zinc-800/80 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h3 className="text-2xl font-bold text-white">100% Free & Open-Source Stack</h3>
            <p className="mt-2 text-xs text-zinc-400">
              Zero paid subscriptions. Transparent, auditable, and resilient.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-indigo-400">Frontend</span>
              <h4 className="font-semibold text-white mt-1">Next.js & TypeScript</h4>
              <p className="text-zinc-400 mt-1">Modern React 18 App Router, Tailwind CSS & Framer Motion.</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-violet-400">Database</span>
              <h4 className="font-semibold text-white mt-1">Supabase PostgreSQL</h4>
              <p className="text-zinc-400 mt-1">Free Tier PostgreSQL with strict Row Level Security (RLS) policies.</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-emerald-400">Local Sandbox</span>
              <h4 className="font-semibold text-white mt-1">IndexedDB & Web Crypto</h4>
              <p className="text-zinc-400 mt-1">Local-first browser persistence and SHA-256 cryptographic digests.</p>
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800">
              <span className="text-[10px] font-bold uppercase text-amber-400">Hosting</span>
              <h4 className="font-semibold text-white mt-1">GitHub & Vercel Hobby</h4>
              <p className="text-zinc-400 mt-1">Continuous deployment, SSL certificates, and zero hosting costs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-white">Frequently Asked Questions</h3>
            <p className="mt-2 text-xs text-zinc-400">
              Straightforward answers about our free access, privacy, and architecture.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-zinc-900/80 border border-zinc-800/80 overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs sm:text-sm font-semibold text-zinc-200 hover:text-white transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 text-zinc-400 transition-transform ${
                      openFaq === idx ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/40 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 border-t border-zinc-800 text-center relative">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Ready to reclaim your private photo library?
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-zinc-400">
            Start organizing your memories today in your secure private space.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 px-7 py-3.5 rounded-full text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/30 transition-all active:scale-95"
            >
              <span>Launch PHOTON Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-8 px-4 sm:px-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-4 w-4 text-indigo-400" />
            <span className="font-semibold text-zinc-300">PHOTON</span>
            <span>— Your memories. Beautifully organized.</span>
          </div>
          <p>© {new Date().getFullYear()} PHOTON. Built for privacy, simplicity, and lifelong memory preservation.</p>
        </div>
      </footer>
    </div>
  );
}
