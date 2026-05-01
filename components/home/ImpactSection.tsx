"use client";

import { motion, useInView } from "framer-motion";
import { Video, HelpCircle, Layers } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useAppTranslation } from "@/contexts/LanguageContext";
import { GlassStars } from "./GlassStars";

function AnimatedCounter({ end, suffix = "+" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;
    const duration = 2000;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export function ImpactSection() {
  const { t } = useAppTranslation();
  const stats = [
    { end: 115, label: t("home.impact.videosCount") || "Videos", icon: Video, suffix: "+" },
    { end: 720, label: t("home.impact.quizzesCount") || "Quizzes", icon: HelpCircle, suffix: "+" },
    { end: 1500, label: t("home.impact.materialsCount") || "Learning Materials", icon: Layers, suffix: "+" },
  ];

  return (
    <section className="py-12 relative overflow-hidden bg-black">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative glass-section border border-white/10 hover:border-white/20 group">
          {/* Colored glow orbs - Top Left & Bottom Left */}
          <div className="absolute top-0 left-0 -m-20 w-96 h-96 bg-amber-500/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -m-20 w-96 h-96 bg-orange-500/25 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Glass Stars */}
          <GlassStars colors={[
            "bg-amber-400 shadow-[0_0_12px_2px_rgba(251,191,36,0.8)]",
            "bg-orange-400 shadow-[0_0_12px_2px_rgba(251,146,60,0.8)]"
          ]} />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-secondary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {t("home.impact.sectionEyebrow")}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {t("home.impact.title")}
          </h2>
          <p className="text-lg text-slate-300">{t("home.impact.subtitle")}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="relative text-center p-8 rounded-[2rem] bg-[#050505] border border-orange-500/30 hover:border-orange-500/60 hover:shadow-[0_0_40px_rgba(249,115,22,0.2)] transition-all duration-500 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent pointer-events-none" />
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative z-10">
                <stat.icon className="w-8 h-8 text-orange-400 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-orange-200 mb-3 drop-shadow-[0_0_15px_rgba(249,115,22,0.5)] relative z-10">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </h3>
              <p className="text-slate-400 font-medium tracking-wide uppercase text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-slate-400 uppercase tracking-widest mb-8 font-semibold">
            {t("home.impact.recognizedBy")}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 opacity-80">
            {[
              t("home.impact.org1"),
              t("home.impact.org2"),
              t("home.impact.org3"),
              t("home.impact.org4"),
            ].map((org) => (
              <div key={org} className="text-slate-300 font-bold text-lg px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                {org}
              </div>
            ))}
          </div>
        </motion.div>
        
        </div>
      </div>
    </section>
  );
}
