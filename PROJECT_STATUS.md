# PHOTON — Project Status & Visual Redesign Roadmap

> **Tagline:** Every memory deserves a beautiful home.  
> **Creative Direction:** Photographic, Cinematic, Minimal, Sovereign, Human-Designed  
> **Philosophy:** Privacy First &bull; Zero Budget (&dollar;0 / &rupee;0) &bull; Zero AI Ingestion &bull; Monograph Collections

---

## 1. Completed Redesign Phases

### Phase A: Visual Audit & Artistic Concept &check;
- Eradicated generic SaaS design tropes (neon purple gradients, repetitive identical cards, gratuitous rounded rectangles, glowing spheres).
- Established a photographic design language inspired by Leica, VSCO, Apple Pro, and fine-art monograph publications.
- Integrated an editorial typographic system (editorial serif display titles, clean geometric grotesque details, and tracking).

### Phase B: Design Tokens & Motion Physics &check;
- **Photographic Palette:**
  - Darkroom surfaces: Obsidian (`#060608`), deep carbon (`#0b0b0e`), elevated slate (`#121216`), subtle neutral borders (`#222228`).
  - Warm Gallery Light Mode: Warm ivory (`#fcfbf9`), gallery neutral (`#f4f3ef`), warm amber (`#b38938`).
  - Muted Photographic Accents: Titanium (`#c8c8cc`), gold champagne (`#d4af37`), phosphor emerald (`#34d399`), deep crimson (`#e05353`).
- **Texture:** Film grain noise overlay (`.film-grain`) and hairline dividers (`.border-hairline`).
- **Motion Engine (`src/lib/motion.ts`):** Framer Motion physics with spring curves, staggered entrance choreographies, progressive reveals, and reduced-motion accessibility overrides.

### Phase C: Editorial Landing Page & Authentication Redesign &check;
- **Landing Page (`/`):**
  - Editorial Hero: *"Every memory deserves a beautiful home."* with supporting headline *"Your photos and videos, organized intelligently and kept strictly under your control."*
  - Interactive Exhibition Preview: Live photographic plates with EXIF readouts (f/2.8, 1/500s, ISO 100).
  - Design Philosophy Manifesto: 4 Pillars of Media Sovereignty.
  - Architecture Matrix: Comparison between commercial surveillance clouds vs. PHOTON's sovereign vault.
  - Animated Inquiries Accordion (FAQ).
- **Authentication Pages:**
  - Sign In (`/auth/login`): Darkroom aesthetic, password visibility toggle, animated error states, and 1-click Instant Sandbox Mode.
  - Registration (`/auth/register`): Dynamic 4-tier password strength bar, privacy pledge checkbox.
  - Recovery (`/auth/forgot-password`): Minimalist recovery desk.

### Phase D: Navigation & Dashboard Redesign &check;
- **Navbar (`src/components/layout/Navbar.tsx`):** Hairline topbar, shutter-style upload trigger, real-time vault indicator (`LOCAL SANDBOX` / `CLOUD SYNC`), darkroom theme toggle.
- **Sidebar (`src/components/layout/Sidebar.tsx`):** Architectural layout, monograph navigation, minimal storage capacity gauge.
- **Mobile Navigation (`src/components/layout/MobileNav.tsx`):** Clean touch-friendly bottom bar.
- **Dashboard (`/dashboard`):** Personal memory exhibition space.
  - Welcome back banner with memory continuity (`Continue where you left off`).
  - Minimalist 4-part status ribbon (Photographs, Motion Films, Monographs, Vault Status).
  - Monograph series horizontal preview.
  - Recent acquisitions gallery with progressive reveals.

### Phase E: Gallery, Photo Viewer & Ingestion Engine &check;
- **Ingestion Modal (`src/components/media/UploadModal.tsx`):**
  - Smooth drag-and-drop target with active highlight.
  - Queue progress tracking with individual file progress and overall percentage.
  - Status transitions (Computing SHA-256 fingerprint, Extracting EXIF parameters, Storing).
  - Destination monograph selector, retry on error, cancel controls.
- **Gallery Grid (`src/components/media/MediaGrid.tsx`):**
  - Staggered entrance animations.
  - Subtle hover scale (`scale-[1.03]`).
  - Floating batch selection action pill (Assign Monograph, Export, Archive, Clear).
- **Darkroom Lightbox (`src/components/media/MediaLightbox.tsx`):**
  - Pure `#000000` background for maximum photographic contrast.
  - Leica/Hasselblad style EXIF inspector drawer (Camera make, model, lens, aperture, shutter, ISO, GPS coordinates with OpenStreetMap link, SHA-256 integrity hash).
  - Keyboard navigation (`Esc`, `ArrowLeft`, `ArrowRight`, `i`).

### Phase F: Monographs, Timeline & Studio Tools &check;
- **Monographs (`/albums` & `/albums/[id]`):** Physical photographic collection aesthetic, book cover ratio, rename and archive actions.
- **Timeline (`/timeline`):** Hairline timeline node structure grouping memories by year and month.
- **Curation Studio (`/smart-organize`):** One-click detection for screenshots, heavy motion reels (>15MB), and uncataloged negatives.
- **Deduplication Center (`/duplicates`):** Side-by-side comparative inspection for exact SHA-256 duplicates and 64-bit dHash perceptual burst sequences with match percentage and space reclamation.
- **Archive Bin (`/deleted`):** Negative restoration and permanent purge warnings.
- **Settings (`/settings`, `/settings/privacy`, `/settings/storage`):** Curator profile, JSON catalog archive export, and capacity gauges.

---

## 2. Technical Quality & Build Verification

- **Production Build:** `npm run build` compiled **18/18 static and dynamic routes** with 0 errors.
- **Type Safety:** 100% TypeScript compliance.
- **Zero External Paid Dependencies:** 100% open-source free tier stack.
- **Local Persistence:** Full IndexedDB offline storage and Supabase PostgreSQL RLS compatibility.

---

## 3. Current Live Application

- Development server running on **`http://localhost:3000`**.
- Ready for immediate exploration in your browser.
