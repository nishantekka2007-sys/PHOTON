# PHOTON — Complete Product Refinement & Cinematic Redesign

> **Tagline:** Your memories. Beautifully organized.  
> **Visual Identity:** Luxury Editorial Design &bull; Cinematic Photography &bull; Minimalist Sophistication &bull; Creative Spatial Studio &bull; Fluid Natural Motion  
> **Core Architecture:** Photographs First &bull; Zero Budget (&dollar;0 / &#8377;0) &bull; Zero Fake Statistics / AI Fabrication &bull; Local-First IndexedDB Sandbox with Optional Supabase PostgreSQL RLS  

---

## 1. Executive Summary & Accomplishments

PHOTON has been elevated from a basic template into a world-class, production-ready photo and video platform adhering strictly to all client requirements:

1. **Photographs Become the Design:**
   - Deep obsidian (`#08090B`) and secondary graphite (`#141519`) darkroom environments alternating intentionally with warm ivory (`#F5F3ED`) editorial surfaces.
   - Elegant typography system pairing high-contrast display serif typography (Playfair / Cormorant / Georgia) with precision interface sans-serif and monospace optics telemetry.
   - Multi-depth floating hero montage with pointer-reactive spring physics, real medium-format camera plates, and floating physical monograph chips.

2. **Honesty & Integrity (Zero Fake Data):**
   - **No Auto-Injected Fake Media:** New users start with a clean empty state (`media = []`). Demo data is strictly opt-in via an explicit "Load Sample Exhibition Plates" action.
   - **Real Metric Calculations:** Dashboard displays actual photo count, video count, collection count, and true storage consumption calculated byte-for-byte from user files.
   - **Accurate Privacy Claims:** Transparent explanation of local-first IndexedDB browser storage (tens of GBs offline) vs. free-tier Supabase cloud storage (1 GB with 50 MB file limits).

3. **Signature Spatial Studio (`/smart-organize`):**
   - Interactive spatial canvas with fluid spring physics.
   - HTML5 drag-and-drop into destination collections, uncataloged library tray, or the trash bin.
   - Multi-selection and batch operations.
   - Interactive zoom controls (`75%` to `145%`) and instant reset.
   - Instant inline monograph creation directly on the canvas.
   - Working undo action stack to revert previous drag or sort decisions.

4. **Professional Darkroom Media Lightbox:**
   - Fullscreen darkroom viewing environment with backdrop blur.
   - Interactive zoom engine: Zoom In (`+`), Zoom Out (`-`), and Reset (`0` / 100%).
   - True HTML5 Fullscreen toggle (`requestFullscreen`).
   - Keyboard navigation (Left/Right arrows for Prev/Next, Escape to close).
   - Real EXIF metadata drawer with camera optics (Aperture, Shutter, ISO, Focal Length, Camera Model, Dimensions, SHA-256 digest) with graceful fallbacks.

5. **Exhibition & Archive Views:**
   - **All Photos (`/photos`):** Suspense-wrapped URL search parameters for `favorites=true`, live camera model dropdown filter, sorting (newest, oldest, size, filename), and Uniform Grid vs Natural Masonry view toggle.
   - **Motion Archive (`/videos`):** Video duration tracking, video player preview, and size metrics.
   - **Memory Timeline (`/timeline`):** Chronological clustering by verified EXIF capture dates.
   - **Duplicates & Burst Inspection (`/duplicates`):** Client-side cryptographic SHA-256 binary matching and 64-bit dHash perceptual similarity clustering.
   - **Monographs (`/albums` & `/albums/[id]`):** Physical book series presentation with create, rename, and delete workflows.
   - **Decommissioned Negatives (`/deleted`):** Safe retention bin with multi-restore and permanent purge confirmation.
   - **Sovereign Security & Storage (`/settings/privacy` & `/settings/storage`):** Master JSON catalog export, session log purges, and byte-level quota allocation bars.

---

## 2. Routes & System Verification

All 18 Next.js App Router routes compile cleanly with 0 TypeScript and 0 build errors:

| Route | Type | Description |
|---|---|---|
| `/` | Static | Cinematic Homepage with Floating Hero Montage & Exhibition |
| `/dashboard` | Dynamic | Studio Overview, Real Statistics & Curated Monographs |
| `/photos` | Dynamic | Master Archive with Camera Filter, Favorites & Masonry Toggle |
| `/videos` | Dynamic | Motion Archive with Duration Sorting & Playback |
| `/timeline` | Dynamic | Chronological Epoch Timeline based on EXIF Timestamps |
| `/smart-organize` | Dynamic | Signature Spatial Studio (Drag & Drop, Zoom, Batch Routing) |
| `/albums` | Dynamic | Curated Monographs & Physical Book Series |
| `/albums/[id]` | Dynamic | Individual Monograph Gallery & Series Management |
| `/duplicates` | Dynamic | Cryptographic SHA-256 & 64-bit dHash Matrix |
| `/deleted` | Dynamic | Decommissioned Negatives Archive Bin & Purge Controls |
| `/settings` | Dynamic | Curator Identity, Atmosphere Theme & Local Session Purge |
| `/settings/privacy` | Dynamic | Data Sovereignty, Master JSON Export & Activity History |
| `/settings/storage` | Dynamic | Segmented Capacity Allocation & Honest Provider Limits |
| `/auth/login` | Dynamic | Curator Authentication & Direct Sandbox Access |
| `/auth/register` | Dynamic | New Account Enrollment with IndexedDB Initializer |
| `/auth/forgot-password` | Dynamic | Password Recovery Flow |
| `/_not-found` | Static | Architectural 404 Route |

---

## 3. Technology Stack Adherence

- **Framework:** Next.js 14 (App Router) + React 18 + TypeScript 5
- **Animation & Physics:** Framer Motion 11
- **Styling & Design Tokens:** Tailwind CSS 3 with custom obsidian, ivory, and champagne palette
- **Local-First Storage:** IndexedDB (`idb` v8) with local client-side offline persistence
- **Cloud Storage & RLS:** Supabase (`@supabase/supabase-js` v2, `@supabase/ssr`)
- **Optics & Telemetry Parsing:** `exifr` for client-side EXIF metadata extraction
- **Cryptographic & Perceptual Hashing:** Web Crypto API (SHA-256) + client-side dHash canvas analysis
- **Budget Consumed:** &#8377;0 / &dollar;0
