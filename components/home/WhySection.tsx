"use client";

import { motion } from "framer-motion";
import { Globe2, Award, Trophy, Rocket } from "lucide-react";
import { useAppTranslation } from "@/contexts/LanguageContext";

export function WhySection() {
  const { t } = useAppTranslation();
  const features = [
    {
      icon: Globe2,
      title: t("home.why.feature1Title"),
      desc: t("home.why.feature1Description"),
      gradient: "from-primary/10 to-pink-50",
      iconColor: "text-primary",
    },
    {
      icon: Award,
      title: t("home.why.feature2Title"),
      desc: t("home.why.feature2Description"),
      gradient: "from-secondary/10 to-purple-50",
      iconColor: "text-secondary",
    },
    {
      icon: Trophy,
      title: t("home.why.feature3Title"),
      desc: t("home.why.feature3Description"),
      gradient: "from-primary/10 to-pink-50",
      iconColor: "text-primary",
    },
    {
      icon: Rocket,
      title: t("home.why.feature4Title"),
      desc: t("home.why.feature4Description"),
      gradient: "from-secondary/10 to-purple-50",
      iconColor: "text-secondary",
    },
  ];

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-[#0A0514] via-slate-900 to-slate-950">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
      <div className="container relative mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {t("home.why.eyebrow")}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 drop-shadow-md">
            {t("home.why.title")}
          </h2>
          <p className="text-lg text-slate-300">{t("home.why.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group p-8 rounded-3xl bg-white/5 border border-white/10 shadow-sm hover:shadow-[0_0_40px_rgba(241,2,76,0.15)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:from-primary group-hover:to-secondary transition-all duration-500"></div>
              
              <div className="absolute -right-4 -top-6 text-[100px] font-black text-white/5 group-hover:text-primary/10 transition-colors duration-500 select-none">
                0{i + 1}
              </div>

              <div
                className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 glass-effect border border-white/10 shadow-inner`}
              >
                <feature.icon className={`w-10 h-10 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-400 leading-relaxed text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
