"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/contexts/LanguageContext";

export function LiveClassesSection() {
  const { t } = useAppTranslation();
  const items = [
    t("home.live.point1"),
    t("home.live.point2"),
    t("home.live.point3"),
    t("home.live.point4"),
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
              {t("home.live.eyebrow")}
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
              {t("home.live.title")}
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              {t("home.live.subtitle")}
            </p>

            <div className="space-y-4 mb-8">
              {items.map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4 glass-effect-dark"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 animate-glow-pulse">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-slate-200 font-medium">{item}</span>
                </motion.div>
              ))}
            </div>

            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary hover:bg-primary/90 text-white px-8 shadow-2xl shadow-primary/50"
            >
              <Link href="/events">
                <Calendar className="w-5 h-5 mr-2" />
                {t("home.live.viewSchedule")}
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop"
                alt={t("home.live.imageAlt")}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />

              <motion.div
                className="absolute top-6 right-6 bg-white/20 backdrop-blur-md border border-white/30 px-6 py-3 rounded-full shadow-xl z-20"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                  </div>
                  <span className="font-bold text-white tracking-wide">{t("home.live.liveNow")}</span>
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-2xl flex items-center gap-4 z-20 w-max"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <div className="flex -space-x-3">
                  {[1, 2, 3].map((v) => (
                    <div key={v} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-xs text-white">
                      User
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-primary flex items-center justify-center text-xs font-bold text-white z-10">
                    +1.2k
                  </div>
                </div>
                <div>
                  <div className="text-sm font-bold text-white">Students Online</div>
                  <div className="text-xs text-slate-400">Joining live session</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
