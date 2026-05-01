"use client";

import { motion } from "framer-motion";
import { GlassStars } from "./GlassStars";
import { Download, FileText, Sparkles, BookOpen } from "lucide-react";
import { useAppTranslation } from "@/contexts/LanguageContext";

export function OnlineResourcesSection() {
  const { t } = useAppTranslation();

  const resources = [
    {
      id: 1,
      title: t("home.resources.resource1Title"),
      description: t("home.resources.resource1Desc"),
      size: "2.4 MB",
      pages: 42,
      color: "from-cyan-500 to-blue-600",
      glowColor: "rgba(6,182,212,0.4)",
      iconBg: "bg-cyan-500/20",
      iconBorder: "border-cyan-500/30",
      iconText: "text-cyan-400",
      hoverBorder: "hover:border-cyan-500/60",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]",
    },
    {
      id: 2,
      title: t("home.resources.resource2Title"),
      description: t("home.resources.resource2Desc"),
      size: "1.8 MB",
      pages: 36,
      color: "from-violet-500 to-purple-600",
      glowColor: "rgba(139,92,246,0.4)",
      iconBg: "bg-violet-500/20",
      iconBorder: "border-violet-500/30",
      iconText: "text-violet-400",
      hoverBorder: "hover:border-violet-500/60",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(139,92,246,0.15)]",
    },
    {
      id: 3,
      title: t("home.resources.resource3Title"),
      description: t("home.resources.resource3Desc"),
      size: "3.1 MB",
      pages: 58,
      color: "from-amber-500 to-orange-600",
      glowColor: "rgba(245,158,11,0.4)",
      iconBg: "bg-amber-500/20",
      iconBorder: "border-amber-500/30",
      iconText: "text-amber-400",
      hoverBorder: "hover:border-amber-500/60",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]",
    },
    {
      id: 4,
      title: t("home.resources.resource4Title"),
      description: t("home.resources.resource4Desc"),
      size: "1.5 MB",
      pages: 28,
      color: "from-emerald-500 to-teal-600",
      glowColor: "rgba(16,185,129,0.4)",
      iconBg: "bg-emerald-500/20",
      iconBorder: "border-emerald-500/30",
      iconText: "text-emerald-400",
      hoverBorder: "hover:border-emerald-500/60",
      hoverShadow: "hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]",
    },
  ];

  return (
    <section className="py-12 relative overflow-hidden bg-black z-10">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative glass-section border border-white/10 hover:border-white/20 group">
          {/* Colored glow orbs - Top Right & Bottom Right */}
          <div className="absolute top-0 right-0 -m-20 w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 -m-20 w-96 h-96 bg-sky-500/25 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Glass Stars */}
          <GlassStars colors={[
            "bg-cyan-400 shadow-[0_0_12px_2px_rgba(34,211,238,0.8)]",
            "bg-sky-400 shadow-[0_0_12px_2px_rgba(56,189,248,0.8)]"
          ]} />
          <div className="absolute top-[-30%] right-[-15%] w-[600px] h-[600px] bg-cyan-500/10 blur-[180px] rounded-full pointer-events-none animate-pulse" />
          <div className="absolute bottom-[-30%] left-[-15%] w-[600px] h-[600px] bg-violet-500/10 blur-[180px] rounded-full pointer-events-none animate-pulse" />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />

          {/* Section Header */}
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
              className="inline-flex items-center gap-2 text-cyan-400 font-semibold tracking-wider text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              {t("home.resources.eyebrow")}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {t("home.resources.title")}
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {t("home.resources.subtitle")}
            </p>
          </motion.div>

          {/* Resource Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {resources.map((resource, i) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 100 }}
                className={`group/card relative flex flex-col rounded-2xl bg-[#0a0a0a] border border-white/10 ${resource.hoverBorder} ${resource.hoverShadow} transition-all duration-500 overflow-hidden`}
              >
                {/* Card top gradient strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${resource.color}`} />

                {/* Card glow on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at top, ${resource.glowColor} 0%, transparent 70%)`,
                  }}
                />

                <div className="flex flex-col flex-grow p-6 relative z-10">
                  {/* PDF visual mockup */}
                  <div className="relative mb-6">
                    <div className={`w-16 h-20 rounded-lg bg-gradient-to-br ${resource.color} p-[1px]`}>
                      <div className="w-full h-full rounded-lg bg-[#0a0a0a] flex flex-col items-center justify-center gap-1.5">
                        <FileText className={`w-6 h-6 ${resource.iconText}`} />
                        <span className={`text-[10px] font-bold tracking-wider uppercase ${resource.iconText}`}>PDF</span>
                      </div>
                    </div>
                    {/* Page count badge */}
                    <div className="absolute -top-2 -right-2 flex items-center gap-1 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                      <BookOpen className="w-3 h-3 text-white/60" />
                      <span className="text-[10px] font-semibold text-white/70">{resource.pages}p</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover/card:text-transparent group-hover/card:bg-clip-text group-hover/card:bg-gradient-to-r group-hover/card:from-white group-hover/card:to-white/80 transition-all leading-snug">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-6 flex-grow">
                    {resource.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-xs font-medium text-white/30 uppercase tracking-wider">
                      {resource.size}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => alert("This is a demo PDF download!")}
                      className={`flex items-center gap-2 text-xs font-semibold ${resource.iconText} ${resource.iconBg} ${resource.iconBorder} border px-3 py-1.5 rounded-full hover:bg-opacity-40 transition-all duration-300`}
                    >
                      <Download className="w-3.5 h-3.5" />
                      {t("home.resources.downloadPdf")}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
