# PHOTON — Ultimate Cinematic Redesign (`cinematic-redesign`)

> **Tagline:** Every memory deserves a beautiful home.  
> **Visual Identity:** Luxury Editorial Design &bull; Cinematic Photography &bull; Minimalist Sophistication &bull; Creative Spatial Photo Compositions &bull; Fluid Natural Animations  
> **Core Direction:** Photographs First &bull; Zero Budget (&dollar;0 / &#8377;0) &bull; Zero AI Ingestion &bull; Sovereign Monograph Collections

---

## 1. Visual Foundation & Creative Art Direction

### A. Colour Palette & Environmental Rhythm
- **Warm Ivory & Cream Editorial Surfaces:** `#faf9f6`, `#f7f5ee`, `#f2efe9` for tactile museum paper and publication sections.
- **Cinematic Darkroom Surfaces:** Obsidian (`#060608`), deep carbon (`#0b0c0e`), elevated slate (`#121216`), subtle neutral borders (`#222228`).
- **Muted Metallic & Photographic Accents:** Champagne gold (`#d4af37`), titanium silver (`#c8c8cc`), phosphor emerald (`#34d399`), deep crimson (`#e05353`).
- **Environmental Modulation:** Deliberately alternating between deep cinematic darkrooms and warm ivory editorial spaces.

### B. Typography Hierarchy
- **Major Headlines:** High-contrast editorial display serifs (Cormorant Garamond / Georgia) with italic accents for emotional resonance.
- **Interface & Controls:** Crisp geometric sans-serif (`SF Pro Display`, `Inter`) for menus and buttons.
- **Technical Telemetry:** Monospace (`SF Mono`, `Menlo`) for camera optics (aperture, shutter speed, ISO, focal length, GPS, SHA-256 digests).

---

## 2. Completed Phase: Rebuilt Landing Page Hero

### A. Integrated First Viewport Composition
- **Side-by-Side 12-Column Spatial Architecture:** On desktop, the headline, value propositions, and primary actions sit on the left, while the **Floating Hero Montage** occupies the right column directly within the initial viewport (no scrolling required).
- **Pointer-Reactive Parallax Engine:** Custom Framer Motion spring physics (`smoothX`, `smoothY`) that subtly move foreground and background layers in response to cursor position.

### B. Multi-Depth Floating Photographic Exhibition
- **Layer 1 (Left / Ambient Drift):** *Kyoto Modernist Pavilion* (Hasselblad X2D 100C &bull; 38mm &#402;/2.8) with `-3.5°` tilt and `Plate No. 01` badge.
- **Layer 2 (Center Master Canvas):** *Seceda Ridge Alpenglow* (Leica M11 Monochrom &bull; 50mm &#402;/1.4 &bull; 46.5985° N) elevated on z-index 20 with gold master negative badge and SHA-256 validation.
- **Layer 3 (Right / Foreground Tilt):** *Studio Portrait Studies No. 4*, Paris (Sony A7R V &bull; 85mm &#402;/1.8) with `+3.5°` tilt and telemetry drawer.
- **Tactile Floating Chips:** *Modernist Geometry* bound monograph chip and *IndexedDB Local Runtime* zero-cloud verification badge.
- **Ambient Lighting:** Gaussian gold/titanium light flare (`blur-[140px]`) giving the photographs rich environmental depth.

### C. The 7 Distinct Landing Page Sections
1. **Cinematic Hero:** Pointer parallax, floating medium-format plates, and dual action triggers (`Launch PHOTON Studio` and `Watch Photo Movement`).
2. **Curated Negative Plates Exhibition:** Warm ivory & cream museum paper surface (`bg-[#f7f5ee] text-stone-900`) with asymmetric aspect ratios (vertical portrait 3:4, panoramic 16:9, square 1:1, editorial 4:5).
3. **Signature Spatial Studio:** Illuminated darkroom chamber (`bg-[#0b0c0e]`) with interactive raw intake, aperture vector scanning, and real-time spring routing.
4. **Curated Monograph Collections:** Tactile physical book series presentation with cover photographs and negative counts.
5. **Sovereign Covenant Manifesto:** Warm sand architectural surface (`bg-[#f2efe9] text-stone-900`) with large editorial numerals (`01` through `04`).
6. **Clarity & Transparency FAQ:** Interactive accordion with honest answers on &#8377;0 budget and privacy guarantees.
7. **Final Call to Action:** Luxury closing portal leading directly into the curator dashboard.

---

## 3. Build & System Health

- **Dedicated Branch:** `cinematic-redesign` (clean, non-destructive branching).
- **TypeScript & Next.js:** `npm run build` compiled all **18 static and dynamic routes** cleanly with 0 errors.
- **Live Local Server:** Running at `http://localhost:3000` (Landing Page) and `http://localhost:3000/dashboard` (Curator Workspace).
