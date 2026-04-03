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
    <section className="py-24 relative overflow-hidden bg-slate-950 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-[#1a1c2e] to-black">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      
      <div className="container relative mx-auto px-4 md:px-6">
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
          <p className="text-lg text-slate-300">
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
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 group-hover:opacity-100"></div>
                  <div className="relative w-24 h-24 rounded-full glass-effect-dark flex items-center justify-center border border-white/10 group-hover:border-primary/50 transition-colors duration-500 z-10">
                    <step.icon className="w-10 h-10 text-white group-hover:text-primary transition-colors" />
                    
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center shadow-lg shadow-primary/30 border-2 border-slate-900">
                      {index + 1}
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-400 leading-relaxed px-4">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
