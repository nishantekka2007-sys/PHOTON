# PHOTON

> **Every memory deserves a beautiful home.**  
> A premium, privacy-first personal photography and motion platform.

---

## 🌟 Visual Identity & Creative Philosophy

**PHOTON** is an art-directed personal photography and motion vault engineered for photographers, curators, and families who demand complete ownership of their digital negatives.

- **Art-Directed Aesthetics:** Obsidian darkroom surfaces (`#060608`), subtle film grain, editorial serif typography, and warm titanium/gold accents.
- **₹0 Development & Hosting Budget:** Built strictly with free and open-source tools (Next.js 14, Supabase Free Tier, Vercel Hobby).
- **Zero AI Training:** Your media files are never harvested to train machine learning models or generative AI engines.
- **Client-Side Cryptography:** Computes SHA-256 digests and 64-bit Perceptual Hashes (dHash) inside your local browser runtime via Web Crypto.
- **Local-First Sovereign Sandbox:** Operates seamlessly offline using browser IndexedDB, or optionally syncs with private Supabase PostgreSQL buckets protected by Row-Level Security (RLS).

---

## 🛠️ Architecture & Stack

| Component | Technology | Cost |
| :--- | :--- | :--- |
| **Frontend Framework** | [Next.js 14 (App Router)](https://nextjs.org/) | Free / Open-Source |
| **Motion Physics** | [Framer Motion](https://www.framer.com/motion/) | Free / Open-Source |
| **Design Tokens & UI** | [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/) | Free / Open-Source |
| **Client-Side Storage** | [IndexedDB (`idb`)](https://github.com/jakearchibald/idb) | Free / Browser Sandbox |
| **Metadata & EXIF** | [exifr](https://github.com/MikeKovarik/exifr) | Free / Browser Native |
| **Database & Auth** | [Supabase Free Tier](https://supabase.com/) (PostgreSQL with RLS) | Free (No CC required) |
| **Media Storage** | [Supabase Storage Free Tier](https://supabase.com/) | Free (No CC required) |

---

## 🚀 Quick Exploration

### 1. Start Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.  
PHOTON runs out of the box in **Instant Local Sandbox Mode** — ingest photos, explore duplicate detection, create monographs, and inspect EXIF metadata without external setup.

---

## 🎨 Key Experiences

- **Exhibition Dashboard:** A personal memory space with continuous session memory, status ribbons, recent monograph collections, and progressive media reveals.
- **Monographs (Albums):** Physical monograph-inspired book covers with custom curations, rename, and cover management.
- **Optics Lightbox:** True darkroom viewer with keyboard navigation (`Esc`, `ArrowLeft`, `ArrowRight`, `i`) and a Leica-style EXIF drawer (ISO, shutter, aperture, focal length, GPS location mapping).
- **Perceptual Deduplication:** Side-by-side visual comparison for exact SHA-256 duplicates and burst sequences using 64-bit dHash and Hamming distance.
- **Media Ingestion Desk:** Smooth drag-and-drop zone with individual file hashing progress, error retries, and album targeting.
- **Sovereign Export:** Download a complete structured JSON manifest of all cryptographic digests, EXIF tags, and monographs at any time.

---

## 📜 License

Licensed under the [MIT License](LICENSE).
