'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Camera, Check, ChevronDown, HardDrive, Lock, ShieldCheck, Sparkles, DownloadCloud, Layers, Aperture, Plus, Minus } from 'lucide-react';
import { FloatingHeroMontage } from '@/components/studio/FloatingHeroMontage';
import { SignatureSpatialSorter } from '@/components/studio/SignatureSpatialSorter';

const photographs = [
  { title: 'Quiet Geometry', place: 'Kyoto, Japan', camera: 'Hasselblad X2D', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85', ratio: 'md:col-span-1 aspect-[4/5]' },
  { title: 'Where the Mountains Breathe', place: 'Dolomites, Italy', camera: 'Leica M11', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85', ratio: 'md:col-span-2 aspect-[16/10]' },
  { title: 'A Study in Light', place: 'Paris, France', camera: 'Sony A7R V', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', ratio: 'md:col-span-1 aspect-[4/5]' },
];

const collections = [
  { title: 'Alpine Solitude', subtitle: 'A collection of quiet horizons and mountain light.', count: '14 photographs', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Modernist Geometry', subtitle: 'Lines, shadows, architecture and form.', count: '24 photographs', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=85' },
  { title: 'Portrait Studies', subtitle: 'An intimate collection of people and expression.', count: '18 photographs', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85' },
];

const questions = [
  { q: 'Where are my photographs stored?', a: 'PHOTON is local-first by default. Your media stays in your browser storage unless you choose to connect an optional cloud backend.' },
  { q: 'Are the images on this page my personal photos?', a: 'No. The photographs on this landing page are illustrative examples. Your own library is available inside your private Studio.' },
  { q: 'Can I organize photos into collections?', a: 'Yes. Create albums, add or remove media, browse your library and use the organization canvas to arrange your collection.' },
  { q: 'Can I export my data?', a: 'PHOTON supports exporting a structured catalog manifest so your collection information remains portable.' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#25231F] selection:bg-[#D8C8A5] selection:text-[#25231F]">
      <header className="sticky top-0 z-50 border-b border-[#E8E3D8] bg-[#F7F5EF]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-serif text-[27px] tracking-[.18em] text-[#292720]">PHOTON</span>
            <span className="hidden border-l border-[#D8D1C4] pl-3 text-[9px] uppercase tracking-[.2em] text-[#8B8579] sm:inline">A home for your memories</span>
          </Link>
          <nav className="hidden items-center gap-8 text-[11px] uppercase tracking-[.16em] text-[#777166] md:flex">
            <Link className="transition hover:text-[#25231F]" href="/dashboard">Studio</Link>
            <a className="transition hover:text-[#25231F]" href="#spatial-studio">Spatial Studio</a>
            <a className="transition hover:text-[#25231F]" href="#collections">Collections</a>
            <a className="transition hover:text-[#25231F]" href="#privacy">Privacy</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden text-[11px] uppercase tracking-[.14em] text-[#777166] transition hover:text-[#25231F] sm:block">Sign in</Link>
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-[#292720] px-5 py-3 text-[10px] font-semibold uppercase tracking-[.14em] text-white transition hover:bg-[#494438]">Enter Studio <ArrowRight size={14}/></Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid min-h-[680px] max-w-7xl items-center gap-8 px-6 py-16 lg:grid-cols-[.88fr_1.12fr] lg:py-20">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }} className="relative z-10">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#E5DFD2] bg-white/70 px-4 py-2 text-[9px] uppercase tracking-[.16em] text-[#817966]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A88C58]"/> Personal photography, thoughtfully arranged
          </div>
          <h1 className="max-w-xl font-serif text-6xl font-normal leading-[.98] tracking-[-.035em] text-[#292720] sm:text-7xl xl:text-[88px]">A beautiful home for <em className="text-[#9A835B]">every memory.</em></h1>
          <p className="mt-7 max-w-lg text-[15px] leading-8 text-[#777166]">Bring your photographs and videos into one calm, considered space. Explore, organize and rediscover your collection — with your privacy at the centre.</p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link href="/dashboard" className="inline-flex items-center gap-3 rounded-full bg-[#292720] px-7 py-4 text-[10px] font-semibold uppercase tracking-[.15em] text-white shadow-[0_12px_28px_rgba(42,39,32,.14)] transition hover:-translate-y-0.5 hover:bg-[#494438]">Explore your Studio <ArrowRight size={15}/></Link>
            <a href="#collections" className="rounded-full border border-[#DCD5C8] bg-white/50 px-6 py-4 text-[10px] uppercase tracking-[.15em] text-[#615B50] transition hover:bg-white">View collections</a>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-[#E4DED2] pt-6 text-[10px] uppercase tracking-[.12em] text-[#8A8377]">
            <span className="flex items-center gap-2"><ShieldCheck size={13}/> Privacy-first</span>
            <span className="flex items-center gap-2"><HardDrive size={13}/> Local-first storage</span>
            <span className="flex items-center gap-2"><Lock size={13}/> Your library, your control</span>
          </div>
        </motion.div>
        <div className="relative min-w-0">
          <div className="absolute -inset-8 rounded-full bg-[#E9E0D0]/70 blur-3xl"/>
          <div className="relative"><FloatingHeroMontage/></div>
          <p className="mt-1 text-center text-[9px] uppercase tracking-[.2em] text-[#A19A8D]">A little space for the things worth keeping</p>
        </div>
      </section>

      <section className="border-y border-[#E8E3D8] bg-[#EFECE4] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="mb-3 text-[10px] uppercase tracking-[.2em] text-[#9A835B]">The visual archive</p><h2 className="max-w-2xl font-serif text-4xl leading-tight text-[#292720] sm:text-6xl">Photographs deserve room to breathe.</h2></div>
            <p className="max-w-sm text-sm leading-7 text-[#777166]">A considered way to revisit the places, people and passing moments that make a life.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {photographs.map((photo, i) => <motion.article key={photo.title} whileHover={{ y: -5 }} className={`group rounded-[22px] border border-[#E5DFD4] bg-[#FBFAF7] p-3 shadow-[0_8px_26px_rgba(53,47,36,.045)] ${photo.ratio.split(' ')[0]}`}>
              <div className={`relative overflow-hidden rounded-[15px] ${photo.ratio.split(' ')[1]}`}><img src={photo.image} alt={photo.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"/><span className="absolute left-4 top-4 rounded-full bg-[#F7F5EF]/90 px-3 py-1.5 text-[9px] uppercase tracking-[.14em] text-[#5E584D]">Plate 0{i+1}</span></div>
              <div className="flex items-end justify-between gap-3 px-2 pb-2 pt-4"><div><h3 className="font-serif text-xl text-[#302D26]">{photo.title}</h3><p className="mt-1 text-[11px] text-[#8B8579]">{photo.place} · {photo.camera}</p></div><Camera size={16} className="mb-1 shrink-0 text-[#A18A62]"/></div>
            </motion.article>)}
          </div>
        </div>
      </section>

      <section id="spatial-studio" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div><p className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[.2em] text-[#9A835B]"><Sparkles size={14}/> A more natural way to organize</p><h2 className="font-serif text-4xl text-[#292720] sm:text-6xl">Meet Spatial Studio.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-[#777166]">See your photographs move into thoughtfully arranged collections. Explore the experience, then open the live canvas to organize your own library.</p></div>
            <Link href="/smart-organize" className="inline-flex items-center gap-2 self-start rounded-full border border-[#DCD5C8] px-5 py-3 text-[10px] uppercase tracking-[.14em] text-[#514B40] transition hover:bg-white md:self-auto">Open live canvas <ArrowRight size={14}/></Link>
          </div>
          <SignatureSpatialSorter/>
        </div>
      </section>

      <section id="collections" className="scroll-mt-24 border-y border-[#E8E3D8] bg-[#F0EDE5] px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12"><p className="mb-3 text-[10px] uppercase tracking-[.2em] text-[#9A835B]">Collected with intention</p><h2 className="font-serif text-4xl text-[#292720] sm:text-6xl">Your memories, in chapters.</h2><p className="mt-4 max-w-lg text-sm leading-7 text-[#777166]">Collections turn a growing photo library into personal visual stories you can return to.</p></div>
          <div className="grid gap-7 md:grid-cols-3">{collections.map((item, i) => <motion.article key={item.title} whileHover={{ y: -6 }} className="group overflow-hidden rounded-[22px] border border-[#E1DBCF] bg-[#FBFAF7] p-3 shadow-[0_8px_26px_rgba(53,47,36,.045)]"><div className="relative aspect-[5/4] overflow-hidden rounded-[15px]"><img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105"/><span className="absolute left-4 top-4 rounded-full bg-[#F7F5EF]/90 px-3 py-1.5 text-[9px] uppercase tracking-[.14em] text-[#5E584D]">Collection 0{i+1}</span></div><div className="px-2 pb-2 pt-5"><h3 className="font-serif text-2xl text-[#302D26]">{item.title}</h3><p className="mt-2 text-xs leading-6 text-[#817A6E]">{item.subtitle}</p><div className="mt-5 flex items-center justify-between border-t border-[#EAE5DC] pt-4 text-[10px] uppercase tracking-[.12em] text-[#938B7D]"><span>{item.count}</span><ArrowRight size={14} className="text-[#9A835B]"/></div></div></motion.article>)}</div>
        </div>
      </section>

      <section id="privacy" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]"><div><p className="mb-3 text-[10px] uppercase tracking-[.2em] text-[#9A835B]">Quietly by design</p><h2 className="font-serif text-4xl leading-tight text-[#292720] sm:text-6xl">Your memories stay yours.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-[#777166]">A personal media space should put you in control. PHOTON is designed around local-first storage and transparent data handling.</p></div><div className="grid gap-8 sm:grid-cols-2">{[{n:'01',t:'Local-first library',d:'Your media can remain in browser storage on your own device.'},{n:'02',t:'No AI training on your media',d:'Your personal photographs are not used to train generative models.'},{n:'03',t:'Optional cloud connection',d:'Connect a backend only when you choose to use cloud sync.'},{n:'04',t:'Portable collection data',d:'Keep your catalog information exportable and under your control.'}].map(x=><div key={x.n} className="border-t border-[#DED8CC] pt-5"><span className="text-[10px] tracking-[.18em] text-[#A18A62]">{x.n}</span><h3 className="mt-3 font-serif text-2xl text-[#302D26]">{x.t}</h3><p className="mt-2 text-xs leading-6 text-[#817A6E]">{x.d}</p></div>)}</div></div>
        </div>
      </section>

      <section className="border-y border-[#E8E3D8] bg-[#EFECE4] px-6 py-24">
        <div className="mx-auto max-w-7xl"><p className="mb-3 text-[10px] uppercase tracking-[.2em] text-[#9A835B]">Made for the details</p><h2 className="max-w-2xl font-serif text-4xl text-[#292720] sm:text-5xl">Everything you need to care for your collection.</h2><div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">{[{icon:Camera,t:'Photo details',d:'Keep camera and EXIF information close to every image.'},{icon:Layers,t:'Thoughtful albums',d:'Create collections that make sense to the way you remember.'},{icon:Aperture,t:'Visual organization',d:'Arrange your media through a tactile spatial canvas.'},{icon:DownloadCloud,t:'Data portability',d:'Keep your catalog information exportable.'}].map(item=><div key={item.t} className="border-t border-[#DCD5C8] pt-5"><item.icon size={19} className="text-[#9A835B]"/><h3 className="mt-4 font-serif text-xl text-[#302D26]">{item.t}</h3><p className="mt-2 text-xs leading-6 text-[#817A6E]">{item.d}</p></div>)}</div></div>
      </section>

      <section id="faq" className="scroll-mt-24 px-6 py-24">
        <div className="mx-auto max-w-3xl"><p className="mb-3 text-center text-[10px] uppercase tracking-[.2em] text-[#9A835B]">A few things you might wonder</p><h2 className="mb-10 text-center font-serif text-4xl text-[#292720] sm:text-5xl">Frequently asked questions.</h2><div className="divide-y divide-[#E3DDD1] border-y border-[#E3DDD1]">{questions.map((item,i)=><div key={item.q}><button onClick={()=>setOpenFaq(openFaq===i?null:i)} className="flex w-full items-center justify-between gap-5 py-6 text-left font-serif text-xl text-[#302D26]"><span>{item.q}</span>{openFaq===i?<Minus size={17}/>:<Plus size={17}/>}</button><AnimatePresence>{openFaq===i&&<motion.p initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}} exit={{height:0,opacity:0}} className="overflow-hidden pb-6 text-sm leading-7 text-[#777166]">{item.a}</motion.p>}</AnimatePresence></div>)}</div></div>
      </section>

      <section className="px-6 pb-24"><div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-[#292720] px-7 py-16 text-center text-[#F7F5EF] sm:py-24"><p className="mb-4 text-[10px] uppercase tracking-[.2em] text-[#C7B58F]">Make room for what matters</p><h2 className="mx-auto max-w-2xl font-serif text-4xl leading-tight sm:text-6xl">Give your memories a place to belong.</h2><p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#D1CCBF]">Start with your own library. Organize at your pace, and make the space yours.</p><Link href="/dashboard" className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#F7F5EF] px-7 py-4 text-[10px] font-semibold uppercase tracking-[.15em] text-[#292720] transition hover:bg-white">Enter PHOTON Studio <ArrowRight size={15}/></Link></div></section>

      <footer className="border-t border-[#E8E3D8] px-6 py-9"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-[10px] uppercase tracking-[.14em] text-[#938B7D] sm:flex-row"><div className="flex items-center gap-3"><span className="font-serif text-lg tracking-[.18em] text-[#292720]">PHOTON</span><span>·</span><span>Every memory deserves a beautiful home.</span></div><div className="flex flex-wrap items-center gap-5"><a href="https://github.com/nishantekka2007-sys/PHOTON" target="_blank" rel="noopener noreferrer" className="hover:text-[#292720]">GitHub</a><span>Local-first by design</span><span>© {new Date().getFullYear()}</span></div></div></footer>
    </main>
  );
}
