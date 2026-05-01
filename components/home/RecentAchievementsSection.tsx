"use client";

import { motion } from "framer-motion";
import { Award, Trophy } from "lucide-react";
import { useAppTranslation } from "@/contexts/LanguageContext";

export function RecentAchievementsSection() {
  const { t } = useAppTranslation();

  const achievements = [
    {
      id: 1,
      title: t("home.achievements.item1Title"),
      description: t("home.achievements.item1Desc"),
      icon: <Trophy className="w-8 h-8" />,
      color: "from-amber-500 to-yellow-600",
      glowColor: "rgba(245,158,11,0.3)",
      iconColor: "text-amber-400",
      borderHover: "hover:border-amber-500/50",
      bannerGradient: "from-amber-500/20 via-yellow-500/10 to-transparent",
      badge: "2025",
    },
    {
      id: 2,
      title: t("home.achievements.item2Title"),
      description: t("home.achievements.item2Desc"),
      icon: <Award className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-600",
      glowColor: "rgba(16,185,129,0.3)",
      iconColor: "text-emerald-400",
      borderHover: "hover:border-emerald-500/50",
      bannerGradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
      badge: "ICT Division",
    },
  ];

  return (
    <section className="py-12 relative overflow-hidden bg-black z-10">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/10 border-t-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] bg-gradient-to-br from-amber-500/10 via-transparent to-emerald-500/5 p-8 md:p-14 overflow-hidden group hover:border-amber-500/30 transition-all duration-500">
          {/* Glows */}
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-amber-500/8 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/8 blur-[150px] rounded-full pointer-events-none" />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 relative z-10"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-amber-400 font-semibold tracking-wider text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20"
            >
              <Trophy className="w-4 h-4" />
              {t("home.achievements.eyebrow")}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {t("home.achievements.title")}
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {t("home.achievements.subtitle")}
            </p>
          </motion.div>

          {/* Achievement Cards */}
          <div className="grid md:grid-cols-2 gap-8 relative z-10">
            {achievements.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: "spring", stiffness: 100 }}
                className={`group/card relative rounded-2xl bg-[#0a0a0a] border border-white/10 ${item.borderHover} transition-all duration-500 overflow-hidden`}
              >
                {/* Banner area */}
                <div className={`relative h-44 bg-gradient-to-br ${item.bannerGradient} flex items-center justify-center overflow-hidden`}>
                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px), radial-gradient(circle at 60% 80%, white 1px, transparent 1px)`,
                      backgroundSize: '60px 60px',
                    }} />
                  </div>
                  {/* Animated shimmer */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent`}
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                  />
                  {/* Center icon */}
                  <div className={`relative z-10 w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-lg`}>
                    {item.icon}
                  </div>
                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-xs font-bold text-white/90 uppercase tracking-wider">
                    {item.badge}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover/card:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at center, ${item.glowColor} 0%, transparent 70%)` }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
