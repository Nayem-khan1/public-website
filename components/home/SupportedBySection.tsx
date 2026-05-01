"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useAppTranslation } from "@/contexts/LanguageContext";
import { GlassStars } from "./GlassStars";

function SupporterLogo({ name, color }: { name: string; color: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 group/logo">
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white font-black text-lg shrink-0 group-hover/logo:scale-110 group-hover/logo:shadow-lg transition-all duration-300`}>
        {name.split(" ").map(w => w[0]).join("").slice(0, 2)}
      </div>
      <span className="text-white/60 font-medium text-xs text-center group-hover/logo:text-white/90 transition-colors leading-tight">
        {name}
      </span>
    </div>
  );
}

export function SupportedBySection() {
  const { t } = useAppTranslation();

  const supporters = [
    { name: t("home.supportedBy.org1"), color: "bg-gradient-to-br from-green-500 to-emerald-700" },
    { name: t("home.supportedBy.org2"), color: "bg-gradient-to-br from-violet-500 to-purple-700" },
    { name: t("home.supportedBy.org3"), color: "bg-gradient-to-br from-sky-500 to-blue-700" },
    { name: t("home.supportedBy.org4"), color: "bg-gradient-to-br from-rose-500 to-pink-700" },
    { name: t("home.supportedBy.org5"), color: "bg-gradient-to-br from-amber-500 to-orange-700" },
  ];

  return (
    <section className="py-12 relative overflow-hidden bg-black z-10">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative glass-section border border-white/10 hover:border-white/20 group">
          {/* Colored glow orbs - Top Right & Bottom Right */}
          <div className="absolute top-0 right-0 -m-20 w-96 h-96 bg-green-500/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 -m-20 w-96 h-96 bg-teal-500/25 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Glass Stars */}
          <GlassStars colors={[
            "bg-green-400 shadow-[0_0_12px_2px_rgba(74,222,128,0.8)]",
            "bg-teal-400 shadow-[0_0_12px_2px_rgba(45,212,190,0.8)]"
          ]} />
          {/* Glows */}
          <div className="absolute top-[-20%] right-[15%] w-[400px] h-[400px] bg-green-500/8 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[15%] w-[400px] h-[400px] bg-violet-500/8 blur-[150px] rounded-full pointer-events-none" />

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14 relative z-10"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 text-green-400 font-semibold tracking-wider text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20"
            >
              <ShieldCheck className="w-4 h-4" />
              {t("home.supportedBy.eyebrow")}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {t("home.supportedBy.title")}
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {t("home.supportedBy.subtitle")}
            </p>
          </motion.div>

          {/* Logo Grid */}
          <div className="relative z-10 flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {supporters.map((org, i) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 120 }}
                className="w-[140px] md:w-[160px]"
              >
                <SupporterLogo name={org.name} color={org.color} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
