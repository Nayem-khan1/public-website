"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Testimonial } from "@/data/types";
import { useAppTranslation } from "@/contexts/LanguageContext";

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  const { t } = useAppTranslation();
  const visibleTestimonials = testimonials.slice(0, 4);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#101423] to-slate-950">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10"></div>
      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {t("home.testimonials.eyebrow")}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-md">
            {t("home.testimonials.title")}
          </h2>
          <p className="text-lg text-slate-300">{t("home.testimonials.subtitle")}</p>
        </motion.div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto snap-x snap-mandatory hide-scrollbar">
          {visibleTestimonials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-3xl relative border border-white/10 shadow-sm hover:shadow-[0_0_40px_rgba(56,189,248,0.1)] transition-all duration-300 min-w-[85vw] md:min-w-0 snap-center group overflow-hidden hover:border-cyan-500/30"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500 group-hover:to-blue-500 transition-all duration-500" />
              <div className="absolute top-6 right-8 text-8xl font-serif text-white/5 group-hover:text-cyan-500/10 transition-colors duration-500 pointer-events-none select-none">
                &rdquo;
              </div>
              
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]"
                  />
                ))}
              </div>
              
              <p className="text-slate-300 text-lg mb-8 leading-relaxed italic relative z-10 font-medium">
                &ldquo;{item.content}&rdquo;
              </p>
              
              <div className="flex items-center gap-4 border-t border-white/10 py-4 mt-auto">
                <img
                  src={item.photoUrl || "https://i.pravatar.cc/100"}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/50 shadow-[0_0_15px_rgba(241,2,76,0.3)]"
                />
                <div>
                  <h4 className="font-bold text-white">
                    {item.name || t("common.student")}
                  </h4>
                  <p className="text-sm text-cyan-400 font-medium tracking-wide">
                    {item.role || t("common.learner")}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
