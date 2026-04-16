"use client";

import { motion } from "framer-motion";
import { Search, PlayCircle, Edit3, Award } from "lucide-react";
import { useAppTranslation } from "@/contexts/LanguageContext";

export function HowItWorksSection() {
  const { t } = useAppTranslation();

  const steps = [
    {
      icon: Search,
      title: t("home.howItWorks.step1Title"),
      desc: t("home.howItWorks.step1Desc"),
    },
    {
      icon: PlayCircle,
      title: t("home.howItWorks.step2Title"),
      desc: t("home.howItWorks.step2Desc"),
    },
    {
      icon: Edit3,
      title: t("home.howItWorks.step3Title"),
      desc: t("home.howItWorks.step3Desc"),
    },
    {
      icon: Award,
      title: t("home.howItWorks.step4Title"),
      desc: t("home.howItWorks.step4Desc"),
    },
  ];

  return (
    <section className="py-12 relative overflow-hidden z-10">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 border-t-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/5 p-8 md:p-14 overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
          
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {t("home.howItWorks.eyebrow")}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {t("home.howItWorks.title")}
          </h2>
          <p className="text-lg text-white/70">
            {t("home.howItWorks.subtitle")}
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent">
            <div className="absolute top-0 right-1/2 w-32 h-full bg-primary/60 blur-sm animate-shimmer"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center group"
              >
                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 group-hover:opacity-100"></div>
                  <div className="relative w-24 h-24 rounded-full bg-[#050505] flex items-center justify-center border border-green-500/30 group-hover:border-green-400/60 transition-colors duration-500 z-10 shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                    <step.icon className="w-10 h-10 text-white group-hover:text-primary transition-colors" />
                    
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-green-500 text-white font-bold flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)] border-2 border-slate-950">
                      {index + 1}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)] transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-white/70 leading-relaxed px-4">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
