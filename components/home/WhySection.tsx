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
    <section className="py-12 relative overflow-hidden z-10">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 border-t-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-gradient-to-br from-primary/10 via-transparent to-primary/5 p-8 md:p-14 overflow-hidden group hover:border-primary/30 transition-all duration-500">
          
          <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
            {t("home.why.eyebrow")}
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {t("home.why.title")}
          </h2>
          <p className="text-lg text-white/70">{t("home.why.subtitle")}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative group p-8 bg-[#050505] border border-red-500/30 rounded-[2rem] shadow-[0_0_30px_rgba(241,2,76,0.15)] hover:shadow-[0_0_50px_rgba(241,2,76,0.4)] transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 to-transparent pointer-events-none" />
              
              <div className="absolute -right-4 -top-6 text-[100px] font-black text-white/5 group-hover:text-primary/10 transition-colors duration-500 select-none">
                0{i + 1}
              </div>

              <div
                className={`relative w-16 h-16 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_40px_rgba(241,2,76,0.25)] border border-white/20`}
              >
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary transition-all">
                {feature.title}
              </h3>
              <p className="text-white/70 leading-relaxed text-base">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
}
