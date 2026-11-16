# PHOTON

> **Your memories. Beautifully organized.**  
> A premium, privacy-first personal photo and video management platform.

---

## 🌟 Overview

**PHOTON** is an open-source, privacy-first media management platform engineered for people who value privacy, speed, and complete ownership of their memories.

- **₹0 Development & Hosting Budget:** Built strictly with free and open-source tools (Next.js, Supabase Free Tier, Vercel Hobby).
- **100% Client-Side Deduplication:** Computes SHA-256 binary checksums and 64-bit Perceptual Hashes (dHash) inside your browser.
- **Zero AI Training:** Your media files are never used to train machine learning algorithms.
- **Local-First Ready:** Operates seamlessly offline using browser IndexedDB, or with Supabase PostgreSQL and private storage buckets.
- **Strict Row Level Security (RLS):** Every database row and storage object is isolated by user ID at the PostgreSQL kernel level.

---

## 🛠️ Technology Stack

| Layer | Technology | Cost |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 14 (App Router)](https://nextjs.org/) | Free / Open-Source |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Free / Open-Source |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/) | Free / Open-Source |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Free / Open-Source |
| **Database & Auth** | [Supabase Free Tier](https://supabase.com/) (PostgreSQL with RLS) | Free (No CC required) |
| **Media Storage** | [Supabase Storage Free Tier](https://supabase.com/) & Browser IndexedDB | Free (No CC required) |
| **Hosting** | [Vercel Hobby](https://vercel.com/) | Free (No CC required) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### 2. Clone and Install
```bash
git clone https://github.com/your-username/photon.git
cd photon
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.  
PHOTON will start in **Local-First Sandbox Mode** immediately! You can upload photos, test deduplication, create albums, and customize settings without any external configuration.

---

## ☁️ Optional: Connecting Supabase Free Cloud Sync

To enable multi-device sync across your laptop and phone:

1. Create a free account at [supabase.com](https://supabase.com) (No credit card needed).
2. Create a new project (e.g. `photon-cloud`).
3. Open the **SQL Editor** in your Supabase dashboard and execute the script located in:
   ```
   supabase/migrations/001_initial_schema.sql
   ```
   *(This creates all tables, triggers, Row Level Security policies, and the private `user-media` storage bucket)*.
4. Copy your **Project URL** and **Anon Public Key** from **Project Settings > API**.
5. Create a `.env.local` file in your project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   ```
6. Restart `npm run dev`. Your PHOTON instance is now synced to your private Supabase backend!

---

## 📱 Features

- **Personal Memory System:** Remembers your last active session, sort preferences, and curated albums.
- **Perceptual Duplicate Finder:** Detects burst photos and identical copies using 64-bit dHash and Hamming distance.
- **Smart Organization Engine:** One-click detection for screenshots, large videos (>15MB), and unassigned media.
- **EXIF & Optics Inspector:** Inspect camera make/model, aperture, ISO, shutter speed, and view capture location on OpenStreetMap.
- **Memory Timeline:** Chronological archive organized by capture year and month.
- **Full-Featured Trash:** 30-day style retention with instant restore and permanent delete safeguards.
- **Export Your Data:** Download complete structured JSON backups of your media catalog and tags at any time.

---

## 🔒 Security & Privacy Policy

- Zero analytics tracking or tracking cookies.
- No commercial advertisement integrations.
- Zero server-side AI processing of raw images.
- All media files uploaded to Supabase are placed in private buckets accessible only via authenticated signed URLs.

---

## 📜 License

Licensed under the [MIT License](LICENSE).
