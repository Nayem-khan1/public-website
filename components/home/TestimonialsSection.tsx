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
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
            {t("home.testimonials.title")}
          </h2>
          <p className="text-lg text-slate-600">{t("home.testimonials.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {visibleTestimonials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl relative border border-slate-100 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-slate-700 text-lg mb-6 leading-relaxed italic">
                &ldquo;{item.content}&rdquo;
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={item.photoUrl || "https://i.pravatar.cc/100"}
                  alt={item.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-slate-900">
                    {item.name || t("common.student")}
                  </h4>
                  <p className="text-sm text-slate-500">
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
