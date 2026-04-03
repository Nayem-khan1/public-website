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
    <section className="py-24 bg-slate-50 relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-50 via-slate-100 to-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {t("home.testimonials.eyebrow")}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {t("home.testimonials.title")}
          </h2>
          <p className="text-lg text-slate-600">{t("home.testimonials.subtitle")}</p>
        </motion.div>

        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto snap-x snap-mandatory hide-scrollbar">
          {visibleTestimonials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 md:p-10 rounded-3xl relative border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 min-w-[85vw] md:min-w-0 snap-center group"
            >
              <div className="absolute top-6 right-8 text-8xl font-serif text-slate-100 group-hover:text-primary/5 transition-colors duration-500 pointer-events-none select-none">
                &rdquo;
              </div>
              
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              
              <p className="text-slate-700 text-lg mb-8 leading-relaxed italic relative z-10 font-medium">
                &ldquo;{item.content}&rdquo;
              </p>
              
              <div className="flex items-center gap-4 border-t border-slate-100 py-4 mt-auto">
                <img
                  src={item.photoUrl || "https://i.pravatar.cc/100"}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-slate-900">
                    {item.name || t("common.student")}
                  </h4>
                  <p className="text-sm text-slate-500 font-medium tracking-wide text-primary">
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
