"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

export function OfflineCenterSlider({ images }: { images: string[] }) {
  const features = [
    "Best Learning Experience in BD",
    "1-1 Mentor Session",
    "Hands On Learning Experience"
  ];

  return (
    <div className="relative rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-8 md:p-14 overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-4xl mx-auto mb-12 relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-8">
          Offline Center Experience
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
          {features.map((feature, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex items-center gap-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 shadow-lg"
            >
              <CheckCircle2 className="w-5 h-5 text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]" />
              <span className="font-medium text-white/90">{feature}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="relative z-10 mt-12 w-full max-w-[100vw] overflow-hidden -mx-8 px-8 md:-mx-14 md:px-14">
        <Swiper
          effect={'coverflow'}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          coverflowEffect={{
            rotate: 15,
            stretch: 0,
            depth: 250,
            modifier: 1.5,
            slideShadows: true,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true,
          }}
          modules={[EffectCoverflow, Pagination, Autoplay]}
          className="w-full !pb-16"
        >
          {images.map((img, i) => (
            <SwiperSlide key={i} className="!w-[280px] md:!w-[450px] !h-[220px] md:!h-[320px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="w-full h-full relative group">
                <img 
                  src={`/offlineCenter/${img}`} 
                  alt={`Offline Center Experience ${i + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3) !important;
          opacity: 1 !important;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #a855f7 !important; /* purple-500 */
          box-shadow: 0 0 12px rgba(168, 85, 247, 0.8);
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
}
