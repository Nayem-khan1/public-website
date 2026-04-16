"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export function GallerySection() {
  const { locale } = useLanguage();

  const eyebrow = locale === "bn" ? "অ্যাস্ট্রোনমি গ্যালারি" : "Our Gallery";
  const title = locale === "bn" ? "মহাবিশ্বের এক ঝলক" : "Glimpses of the Universe";
  const subtitle = locale === "bn" 
    ? "আমাদের শিক্ষা কার্যক্রম, ক্যাম্প ও ইভেন্টের কিছু মুগ্ধকর মুহূর্ত।" 
    : "Some mesmerizing moments from our educational programs, camps, and events.";

  // Demo space/astronomy placeholder images
  const topImages = [
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80",
    "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
    "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
    "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",
  ];

  const bottomImages = [
    "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=800&q=80",
    "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80",
    "https://images.unsplash.com/photo-1481819613568-3701cbc70156?w=800&q=80",
    "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80",
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80",
  ];

  return (
    <section className="py-12 relative overflow-hidden flex flex-col items-center z-10">
      <div className="container px-4 md:px-6 relative z-10 mb-12 w-full">
        <div className="relative rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 border-t-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-gradient-to-br from-fuchsia-500/10 via-transparent to-pink-500/5 py-14 overflow-hidden group w-full hover:border-fuchsia-500/30 transition-all duration-500">
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <span className="text-secondary font-semibold tracking-wider text-sm uppercase mb-3 block">
              {eyebrow}
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {title}
            </h2>
            <p className="text-lg text-white/70">
              {subtitle}
            </p>
          </motion.div>

          {/* Top Row - Scrolls Left */}
          <div className="w-full overflow-hidden whitespace-nowrap py-4 relative group">
            <div className="flex w-max animate-scroll-left hover:[animation-play-state:paused]">
              {[...topImages, ...topImages].map((image, index) => (
                <div key={`top-${index}`} className="w-[280px] sm:w-[320px] md:w-[400px] flex-shrink-0 mx-3">
                  <div className="relative w-full h-[200px] md:h-[260px] rounded-[2rem] overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] border border-cyan-500/30 group/card hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] bg-[#050505] transition-all duration-500">
                    <img 
                      src={image} 
                      alt={`Gallery Image ${index + 1}`} 
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 ease-in-out" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row - Scrolls Right */}
          <div className="w-full overflow-hidden whitespace-nowrap py-4 relative group cursor-pointer">
            <div className="flex w-max animate-scroll-right hover:[animation-play-state:paused]">
              {[...bottomImages, ...bottomImages].map((image, index) => (
                <div key={`bottom-${index}`} className="w-[280px] sm:w-[320px] md:w-[400px] flex-shrink-0 mx-3">
                  <div className="relative w-full h-[200px] md:h-[260px] rounded-[2rem] overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.1)] border border-cyan-500/30 group/card hover:border-cyan-400/60 hover:shadow-[0_0_40px_rgba(6,182,212,0.4)] bg-[#050505] transition-all duration-500">
                    <img 
                      src={image} 
                      alt={`Gallery Image ${index + 1}`} 
                      className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700 ease-in-out" 
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
