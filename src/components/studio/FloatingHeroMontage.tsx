'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { ArrowLeft, ArrowRight, Camera, MapPin, Sparkles } from 'lucide-react';

const plates = [
  { title:'Kyoto, in quiet light', place:'Kyoto, Japan', camera:'Hasselblad X2D · 38mm', image:'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85', shape:'portrait' },
  { title:'Where the mountains breathe', place:'Dolomites, Italy', camera:'Leica M11 · 50mm', image:'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=85', shape:'landscape' },
  { title:'A study in expression', place:'Paris, France', camera:'Sony A7R V · 85mm', image:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85', shape:'portrait' },
  { title:'The warmth of a Sunday', place:'At home, somewhere', camera:'Canon EOS R5 · 35mm', image:'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1400&q=85', shape:'landscape' },
  { title:'A little blue hour', place:'Coastal roads', camera:'Fujifilm GFX · 45mm', image:'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1400&q=85', shape:'landscape' },
];

export function FloatingHeroMontage() {
  const [active, setActive] = useState(1);
  const move = (step:number) => setActive((current) => (current + step + plates.length) % plates.length);
  const handleDragEnd = (_:MouseEvent|TouchEvent|PointerEvent, info:PanInfo) => {
    if (info.offset.x < -65) move(1);
    if (info.offset.x > 65) move(-1);
  };

  return (
    <div className="relative mx-auto flex h-[500px] w-full max-w-[660px] select-none flex-col items-center justify-center sm:h-[570px]">
      <div className="absolute inset-x-10 top-12 h-72 rounded-full bg-[#E8DECB]/70 blur-[90px]" />
      <div className="absolute bottom-10 left-1/2 h-20 w-[70%] -translate-x-1/2 rounded-full bg-[#CFC3AD]/30 blur-3xl" />
      <div className="relative h-[410px] w-full touch-pan-y sm:h-[460px]">
        {plates.map((plate,index) => {
          let offset = index - active;
          if (offset > plates.length/2) offset -= plates.length;
          if (offset < -plates.length/2) offset += plates.length;
          const isActive = offset === 0;
          const visible = Math.abs(offset) <= 2;
          return (
            <motion.button
              key={plate.title}
              type="button"
              aria-label={`Show ${plate.title}`}
              onClick={() => !isActive && setActive(index)}
              drag={isActive ? 'x' : false}
              dragConstraints={{left:0,right:0}}
              dragElastic={0.18}
              onDragEnd={handleDragEnd}
              initial={false}
              animate={{
                x: offset * (typeof window !== 'undefined' && window.innerWidth < 640 ? 112 : 155),
                y: Math.abs(offset) * 17 + (isActive ? 0 : 8),
                rotate: offset * 7,
                scale: isActive ? 1 : Math.max(.76, 1-Math.abs(offset)*.12),
                opacity: visible ? (isActive ? 1 : .72-Math.abs(offset)*.16) : 0,
                zIndex: 20-Math.abs(offset),
                filter: isActive ? 'saturate(1)' : 'saturate(.72)'
              }}
              transition={{type:'spring',stiffness:190,damping:23,mass:.8}}
              className={`absolute left-1/2 top-1/2 w-[250px] -translate-x-1/2 -translate-y-1/2 cursor-grab overflow-hidden rounded-[25px] border border-white/80 bg-[#FBFAF7] p-2.5 text-left shadow-[0_28px_70px_rgba(55,48,37,.22)] active:cursor-grabbing sm:w-[330px] ${isActive?'pointer-events-auto':'pointer-events-auto'}`}
              style={{marginLeft:'-125px',marginTop:'-190px'}}
            >
              <div className={`relative overflow-hidden rounded-[18px] ${plate.shape==='portrait'?'aspect-[4/5]':'aspect-[5/4]'}`}>
                <img src={plate.image} alt={plate.title} draggable={false} className="h-full w-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 pt-14 text-white">
                  <p className="font-serif text-xl leading-tight sm:text-2xl">{plate.title}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[9px] tracking-wide text-white/85"><MapPin size={11}/>{plate.place}</p>
                </div>
                <span className="absolute left-3 top-3 rounded-full border border-white/35 bg-black/25 px-2.5 py-1 text-[8px] uppercase tracking-[.18em] text-white backdrop-blur-md">Plate 0{index+1}</span>
              </div>
              <div className="flex items-center justify-between px-2 pb-1 pt-3">
                <span className="flex items-center gap-1.5 text-[9px] text-[#777166]"><Camera size={11}/>{plate.camera}</span>
                <span className="font-serif text-[11px] italic text-[#A18A62]">PHOTON archive</span>
              </div>
            </motion.button>
          );
        })}
      </div>
      <div className="relative z-30 mt-2 flex w-full items-center justify-between px-4 sm:px-10">
        <button onClick={()=>move(-1)} aria-label="Previous photograph" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD5C8] bg-white/80 text-[#4D483F] shadow-sm transition hover:-translate-x-1 hover:bg-white"><ArrowLeft size={16}/></button>
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">{plates.map((p,i)=><button key={p.title} onClick={()=>setActive(i)} aria-label={`Go to photograph ${i+1}`} className={`h-1.5 rounded-full transition-all duration-300 ${i===active?'w-7 bg-[#A88C58]':'w-1.5 bg-[#C9C0B1] hover:bg-[#96866A]'}`}/>)}</div>
          <span className="text-[9px] uppercase tracking-[.2em] text-[#8B8376]">{String(active+1).padStart(2,'0')} <span className="mx-1 text-[#C2B8A8]">/</span> {String(plates.length).padStart(2,'0')} · Drag to explore</span>
        </div>
        <button onClick={()=>move(1)} aria-label="Next photograph" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#DDD5C8] bg-white/80 text-[#4D483F] shadow-sm transition hover:translate-x-1 hover:bg-white"><ArrowRight size={16}/></button>
      </div>
      <div className="absolute right-2 top-4 hidden items-center gap-2 rounded-full border border-[#E5DFD4] bg-white/75 px-3 py-2 text-[9px] uppercase tracking-[.13em] text-[#8B8376] sm:flex"><Sparkles size={12} className="text-[#A88C58]"/> Interactive photo deck</div>
    </div>
  );
}
