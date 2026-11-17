'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Camera, MapPin, Check, Sparkles, Sliders, ShieldCheck } from 'lucide-react';
import { floatSlow, floatOpposite, springTactile } from '@/lib/motion';

export function FloatingHeroMontage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  // Smooth pointer parallax coordinates
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const y = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    mouseX.set(x * 14);
    mouseY.set(y * 14);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-[440px] sm:h-[500px] lg:h-[560px] select-none flex items-center justify-center overflow-visible"
    >
      {/* Background Cinematic Atmosphere & Light Field */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[520px] lg:w-[620px] h-[300px] sm:h-[360px] bg-gradient-to-tr from-accent-gold/15 via-white/5 to-transparent blur-[110px] sm:blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-accent-amber/10 blur-[90px] pointer-events-none rounded-full" />

      {/* Layer 1: Left Floating Plate (Kyoto Architecture, angled -3.5deg, deep depth) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="absolute left-0 sm:left-4 lg:left-6 top-8 sm:top-12 z-10"
      >
        <motion.div
          {...floatSlow(0, 8, 7)}
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
          transition={springTactile}
          className="w-44 sm:w-60 lg:w-68 rounded-2xl overflow-hidden border border-[#E5DFD4]/90 bg-[#FBFAF7] p-2 sm:p-2.5 shadow-[0_18px_45px_rgba(55,48,37,0.14)] cursor-pointer group"
        >
          <div className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-black relative">
            <img
              src="https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=85"
              alt="Kyoto Modernist Pavilion"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Film frame contact indicator */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] sm:text-[10px] font-mono text-white border border-white/10 uppercase tracking-wider">
              Plate No. 01
            </div>

            {/* Bottom Optics Readout */}
            <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/75 backdrop-blur-md text-left transition-opacity">
              <p className="font-serif text-[11px] sm:text-xs text-white leading-tight font-normal">
                Kyoto Modernist Pavilion
              </p>
              <p className="text-[8px] sm:text-[9px] font-mono text-[#817A6E] flex items-center gap-1 mt-0.5">
                <Camera className="h-2.5 w-2.5 text-accent-titanium" />
                Hasselblad X2D &bull; 38mm ƒ/2.8
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Layer 2: Center Master Exhibition Canvas (Seceda Ridge, Elevated z-20) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="absolute left-1/2 -translate-x-1/2 top-2 sm:top-4 z-20"
      >
        <motion.div
          {...floatOpposite(0.4, 6, 6.5)}
          whileHover={{ scale: 1.035, zIndex: 45 }}
          transition={springTactile}
          className="w-64 sm:w-84 lg:w-[410px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 bg-[#FBFAF7] p-2.5 sm:p-3.5 shadow-[0_18px_45px_rgba(55,48,37,0.14)] cursor-pointer group"
        >
          <div className="aspect-[16/11] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-black relative">
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85"
              alt="Seceda Ridge Alpenglow"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Master Negative Badge */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/85 backdrop-blur-md text-[9px] sm:text-[10px] font-mono text-accent-gold border border-accent-gold/40 uppercase tracking-wider flex items-center gap-1.5 shadow-soft">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-gold animate-pulse" />
              Master Negative &bull; 100% Unique
            </div>

            {/* Bottom Optics & Coordinates Drawer */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2 sm:p-3 rounded-xl bg-black/80 backdrop-blur-md text-left flex items-center justify-between">
              <div>
                <p className="font-serif text-xs sm:text-sm text-white font-normal">
                  Seceda Ridge Alpenglow
                </p>
                <p className="text-[8px] sm:text-[10px] font-mono text-[#817A6E] flex items-center gap-1 mt-0.5">
                  <MapPin className="h-2.5 w-2.5 text-accent-emerald" />
                  Val Gardena, Dolomites &bull; Leica M11 &bull; 50mm ƒ/1.4
                </p>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono text-accent-emerald uppercase border border-accent-emerald/40 px-2 py-0.5 rounded-full">
                SHA-256 OK
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Layer 3: Right Floating Plate (Paris Portrait, angled +3.5deg) */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
        }}
        className="absolute right-0 sm:right-4 lg:right-6 top-12 sm:top-18 z-10"
      >
        <motion.div
          {...floatSlow(0.8, 8, 7.5)}
          whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
          transition={springTactile}
          className="w-44 sm:w-60 lg:w-68 rounded-2xl overflow-hidden border border-[#E5DFD4]/90 bg-[#FBFAF7] p-2 sm:p-2.5 shadow-[0_18px_45px_rgba(55,48,37,0.14)] cursor-pointer group"
        >
          <div className="aspect-[4/5] w-full rounded-xl overflow-hidden bg-black relative">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85"
              alt="Studio Portrait Studies"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[9px] sm:text-[10px] font-mono text-white border border-white/10 uppercase tracking-wider">
              Plate No. 03
            </div>

            <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-black/75 backdrop-blur-md text-left">
              <p className="font-serif text-[11px] sm:text-xs text-white leading-tight font-normal">
                Studio Portrait Studies
              </p>
              <p className="text-[8px] sm:text-[9px] font-mono text-[#817A6E] flex items-center gap-1 mt-0.5">
                <Camera className="h-2.5 w-2.5 text-accent-titanium" />
                Sony A7R V &bull; 85mm ƒ/1.8
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Monograph Chip (Tactile Book Binder accent) */}
      <motion.div
        animate={{ y: [3, -4, 3] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden sm:flex absolute left-4 lg:left-10 bottom-3 px-3.5 py-2 rounded-xl bg-[#FBFAF7]/95 border border-[#E5DFD4] shadow-soft items-center space-x-2.5 z-30"
      >
        <div className="h-6 w-6 rounded-md bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center text-accent-gold text-[10px] font-serif font-bold">
          MG
        </div>
        <div>
          <p className="font-serif text-[11px] text-[#302D26]">Modernist Geometry</p>
          <p className="text-[8px] font-mono text-[#817A6E]">Monograph Bound &bull; 24 Negatives</p>
        </div>
      </motion.div>

      {/* Floating Cryptographic Security Badge */}
      <motion.div
        animate={{ y: [-3, 4, -3] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="hidden sm:flex absolute right-4 lg:right-10 bottom-3 px-3.5 py-2 rounded-xl bg-[#FBFAF7]/95 border border-[#E5DFD4] shadow-soft items-center space-x-2.5 z-30"
      >
        <div className="h-6 w-6 rounded-md bg-accent-emerald/10 border border-accent-emerald/30 flex items-center justify-center text-accent-emerald text-[10px]">
          <Check className="h-3.5 w-3.5" />
        </div>
        <div>
          <p className="font-serif text-[11px] text-[#302D26]">Zero Cloud Tracking</p>
          <p className="text-[8px] font-mono text-[#817A6E]">IndexedDB Local Runtime</p>
        </div>
      </motion.div>
    </div>
  );
}

