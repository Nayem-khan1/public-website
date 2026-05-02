"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Rocket,
  Sparkles,
  Telescope,
  Star,
  Globe2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarBackground } from "@/components/StarBackground";
import { useAppTranslation } from "@/contexts/LanguageContext";
import Image from "next/image";

export function HeroSection() {
  const { t } = useAppTranslation();

  const stats = [
    {
      value: t("home.hero.stat1Value"),
      label: t("home.hero.stat1Label"),
      icon: Globe2,
      color: "text-primary",
      bg: "bg-primary/15",
    },
    {
      value: t("home.hero.stat2Value"),
      label: t("home.hero.stat2Label"),
      icon: Star,
      color: "text-secondary",
      bg: "bg-secondary/15",
    },
    {
      value: t("home.hero.stat3Value"),
      label: t("home.hero.stat3Label"),
      icon: Telescope,
      color: "text-purple-400",
      bg: "bg-purple-500/15",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden z-10">
      <StarBackground />

      <div className="container relative z-10 mx-auto px-4 md:px-6 pt-36 pb-20 md:pt-44 md:pb-28">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── LEFT: Text Content ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 backdrop-blur-sm border border-white/15 text-white/90 font-medium text-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              {t("home.hero.badge")}
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-display font-bold text-white leading-[1.08] tracking-tight mb-6"
            >
              {t("home.hero.titleLine1")}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-400 to-secondary">
                {t("home.hero.titleLine2")}
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-base sm:text-lg md:text-xl text-white/65 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              {t("home.hero.description")}
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="flex flex-col sm:flex-row items-center lg:items-start gap-5 mb-12"
            >
              <Button
                asChild
                size="lg"
                className="rounded-full text-base px-9 h-14 bg-primary hover:bg-primary/90 text-white shadow-[0_0_40px_rgba(241,2,76,0.3)] hover:shadow-[0_0_60px_rgba(241,2,76,0.45)] transition-all duration-500 hover:scale-[1.03] font-semibold"
              >
                <Link href="/courses">
                  <Rocket className="w-5 h-5 mr-2" />
                  {t("home.hero.cta")}
                </Link>
              </Button>

              {/* Trust line */}
              <p className="text-sm text-white/50 flex items-center gap-1.5 pt-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                {t("home.hero.trustLine")}
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl ${stat.bg} backdrop-blur-sm flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-white leading-none">{stat.value}</p>
                    <p className="text-xs text-white/55 mt-0.5">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Hero Image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-[520px] mx-auto">
              {/* Ambient glow behind image */}
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(241,2,76,0.2)_0%,transparent_65%)] blur-3xl scale-125 animate-glow-pulse" />

              {/* Main image container */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <Image
                  src="/hero-student.png"
                  alt={t("home.hero.spaceIllustration")}
                  width={520}
                  height={520}
                  priority
                  className="w-full h-auto object-contain drop-shadow-[0_20px_60px_rgba(241,2,76,0.15)] rounded-3xl"
                />

                {/* Floating badge - Courses */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -left-6 top-[20%] px-4 py-2.5 rounded-2xl bg-white/8 backdrop-blur-xl border border-white/15 shadow-xl flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Rocket className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white leading-none">20+ Courses</p>
                    <p className="text-[10px] text-white/50 mt-0.5">Space Science</p>
                  </div>
                </motion.div>

                {/* Floating badge - Asteroids */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -right-4 bottom-[25%] px-4 py-2.5 rounded-2xl bg-white/8 backdrop-blur-xl border border-white/15 shadow-xl flex items-center gap-2.5"
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <Telescope className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white leading-none">450+ Asteroids</p>
                    <p className="text-[10px] text-white/50 mt-0.5">Discovered</p>
                  </div>
                </motion.div>
              </motion.div>

              {/* Orbital ring decoration */}
              <div className="absolute inset-[-15%] border border-white/[0.04] rounded-full pointer-events-none" />
              <div className="absolute inset-[-30%] border border-white/[0.02] rounded-full pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-7 h-12 border-2 border-white/15 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-3 bg-white/60 rounded-full"
            animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
