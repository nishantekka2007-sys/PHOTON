# PHOTON

> **Every memory deserves a beautiful home.**  
> A thoughtful space to organize, explore, and preserve your photographs and videos.

PHOTON is a personal photo and video workspace built around a simple idea: your memories should be easy to enjoy, beautifully organized, and under your control.

The project combines an editorial photography-inspired interface with practical media tools, including collections, metadata exploration, duplicate detection, and a signature spatial organization experience.

**Live application:** https://photon-bn7e25qjz-nishantekka2007-6282.vercel.app  
**Repository:** https://github.com/nishantekka2007-sys/PHOTON

---

## Product principles

- **Beautiful by default** — a calm, photography-led interface with considered typography, spacing, and motion.
- **Useful, not decorative** — controls should perform real actions, and sample demonstrations should be clearly distinguished from a user's own media.
- **Privacy with transparency** — explain clearly when media is stored locally or synced to a configured cloud service. Security and privacy claims must match the actual implementation.
- **Ownership and portability** — make it straightforward to understand, manage, and export personal media and collection data.
- **Works across screens** — deliver a coherent experience on desktop, tablet, and mobile.

## Current development milestone

### Milestone 1 — Visual foundation

**Current focus:** establish a consistent premium visual language and make the first-use experience clear, polished, and responsive.

This milestone covers:

- A cohesive dark and light theme with reusable design tokens.
- Refined typography, spacing, surfaces, borders, and iconography.
- A clearer homepage hierarchy and product explanation.
- A consistent navigation and responsive layout.
- A more intentional visual presentation for the photography exhibition and Spatial Studio preview.
- Honest sample-data labels and accurate product messaging.

The milestone should be considered complete only after the updated experience has been reviewed on desktop and mobile and the production build passes.

## Product experience

The project is being developed around these core areas:

| Area | Purpose |
| --- | --- |
| **Studio dashboard** | A central place to enter the workspace and reach recent media and collections. |
| **Photo and video library** | Browse, search, filter, and manage personal media. |
| **Collections** | Curate photographs and videos into meaningful groups. |
| **Media viewer** | View media at full size and inspect available metadata. |
| **Signature Spatial Studio** | Arrange media visually in a spatial workspace. |
| **Duplicate review** | Identify exact or visually similar files for user review. |
| **Privacy and settings** | Understand storage behavior and manage account or local preferences. |

Feature availability can depend on the current implementation and backend configuration. The interface should not present a planned or simulated capability as a completed operation.

## Technology

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 14, React, TypeScript |
| Styling | Tailwind CSS |
| Motion | Framer Motion |
| Icons | Lucide |
| Media metadata | exifr |
| Local persistence | IndexedDB via idb |
| Authentication and cloud data | Supabase |
| Deployment | Vercel |

## Run locally

### Requirements

- Node.js and npm
- Git

### Setup

```bash
git clone https://github.com/nishantekka2007-sys/PHOTON.git
cd PHOTON
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Some cloud-backed functionality may require Supabase project credentials and environment variables. Configure these locally using the project's environment setup; never commit secrets or private keys to the repository.

## Development roadmap

The roadmap is organized into focused milestones so that visual improvements do not compromise working product functionality.

- [ ] **Milestone 1 — Visual foundation:** design system, homepage, navigation, responsive polish.
- [ ] **Milestone 2 — Core product experience:** dashboard, library, media viewer, collections, and upload workflow.
- [ ] **Milestone 3 — Signature Spatial Studio:** reliable spatial interactions, collection organization, undo/redo, and workspace persistence.
- [ ] **Milestone 4 — Trust and reliability:** authentication, storage permissions, privacy review, error handling, and data portability.
- [ ] **Milestone 5 — Final polish:** accessibility, performance, mobile refinements, and production verification.

Progress should be checked against the actual application before marking a milestone complete.

## Privacy and security

PHOTON is designed with personal media ownership in mind. Its local-storage and optional cloud-sync behavior must be described accurately:

- Local browser storage and cloud storage are different modes and should be clearly identified.
- Cloud access must be protected by correctly configured authentication, database policies, and storage permissions.
- Media metadata should only be displayed when it is actually available.
- Privacy, encryption, and data-retention claims should be made only when verified in the implementation.
- Users should be able to understand how to export or delete their data.

Do not place Supabase service-role keys, API secrets, or other credentials in client-side code or version control.

## Contributing and project direction

PHOTON is being developed incrementally. Before adding a dependency or replacing a component, review the existing implementation and preserve working behavior. Prefer focused changes, reusable components, accessible interactions, and clear loading, empty, and error states.

## License

Licensed under the [MIT License](LICENSE).
