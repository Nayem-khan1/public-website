"use client";

import { motion } from "framer-motion";
import { Handshake } from "lucide-react";
import { useAppTranslation } from "@/contexts/LanguageContext";
import { GlassStars } from "./GlassStars";

function DummyLogo({ name, color }: { name: string; color: string }) {
  return (
    <div className={`flex items-center gap-3 px-6 py-4 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 group/logo`}>
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center text-white font-black text-sm shrink-0 group-hover/logo:scale-110 transition-transform duration-300`}>
        {name.split(" ").map(w => w[0]).join("").slice(0, 2)}
      </div>
      <span className="text-white/70 font-semibold text-sm group-hover/logo:text-white/90 transition-colors whitespace-nowrap">
        {name}
      </span>
    </div>
  );
}

export function CollaboratorsSection() {
  const { t } = useAppTranslation();

  const collaborators = [
    { name: t("home.collaborators.org1"), color: "bg-gradient-to-br from-blue-500 to-blue-700" },
    { name: t("home.collaborators.org2"), color: "bg-gradient-to-br from-indigo-500 to-violet-700" },
    { name: t("home.collaborators.org3"), color: "bg-gradient-to-br from-teal-500 to-emerald-700" },
    { name: t("home.collaborators.org4"), color: "bg-gradient-to-br from-orange-500 to-red-600" },
    { name: t("home.collaborators.org5"), color: "bg-gradient-to-br from-pink-500 to-rose-700" },
    { name: t("home.collaborators.org6"), color: "bg-gradient-to-br from-cyan-500 to-sky-700" },
  ];

  return (
    <section className="py-12 relative overflow-hidden bg-black z-10">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative glass-section border border-white/10 hover:border-white/20 group">
          {/* Colored glow orbs - Top Left & Bottom Left */}
          <div className="absolute top-0 left-0 -m-20 w-96 h-96 bg-blue-500/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -m-20 w-96 h-96 bg-indigo-500/25 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Glass Stars */}
          <GlassStars colors={[
            "bg-blue-400 shadow-[0_0_12px_2px_rgba(96,165,250,0.8)]",
            "bg-indigo-400 shadow-[0_0_12px_2px_rgba(129,140,248,0.8)]"
          ]} />
          {/* Glows */}
          <div className="absolute top-[-20%] left-[20%] w-[400px] h-[400px] bg-blue-500/8 blur-[150px] rounded-full pointer-events-none" />
          <div className="absolute bottom-[-20%] right-[20%] w-[400px] h-[400px] bg-indigo-500/8 blur-[150px] rounded-full pointer-events-none" />

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
              className="inline-flex items-center gap-2 text-blue-400 font-semibold tracking-wider text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20"
            >
              <Handshake className="w-4 h-4" />
              {t("home.collaborators.eyebrow")}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {t("home.collaborators.title")}
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {t("home.collaborators.subtitle")}
            </p>
          </motion.div>

          {/* Logo Grid */}
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {collaborators.map((org, i) => (
              <motion.div
                key={org.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <DummyLogo name={org.name} color={org.color} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
