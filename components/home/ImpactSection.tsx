"use client";

import { motion, useInView } from "framer-motion";
import { Users, BookOpen, Play, Trophy } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useAppTranslation } from "@/contexts/LanguageContext";

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
    { end: 5000, label: t("home.impact.studentsTaught"), icon: Users, suffix: "+" },
    { end: 120, label: t("home.impact.coursesConducted"), icon: BookOpen, suffix: "+" },
    { end: 500, label: t("home.impact.liveClasses"), icon: Play, suffix: "+" },
    { end: 50, label: t("home.impact.olympiadWinners"), icon: Trophy, suffix: "+" },
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-950 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-[#101423] to-black">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      
      <div className="container relative mx-auto px-4 md:px-6">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="text-center p-8 rounded-3xl glass-effect-dark hover:border-primary/50 hover:shadow-[0_0_30px_rgba(241,2,76,0.15)] transition-all duration-500 group"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <stat.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
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
    </section>
  );
}
