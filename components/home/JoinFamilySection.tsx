"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Heart, ExternalLink } from "lucide-react";
import { GlassStars } from "./GlassStars";
import { useAppTranslation } from "@/contexts/LanguageContext";

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const PodcastIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <path d="M12 1a9 9 0 0 0-9 9v7c0 1.66 1.34 3 3 3h3v-8H5v-2a7 7 0 0 1 14 0v2h-4v8h3c1.66 0 3-1.34 3-3v-7a9 9 0 0 0-9-9z" />
  </svg>
);

const UsersGroupIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export function JoinFamilySection() {
  const { t } = useAppTranslation();

  const channels = [
    {
      id: "yt-official",
      icon: <YoutubeIcon />,
      name: t("home.joinFamily.ytOfficial"),
      description: t("home.joinFamily.ytOfficialDesc"),
      link: "https://www.youtube.com/@astronomypathshalaofficial/featured",
      color: "from-red-500 to-red-700",
      glowColor: "rgba(239,68,68,0.35)",
      iconBg: "bg-red-500/15",
      iconBorder: "border-red-500/30",
      hoverBorder: "hover:border-red-500/60",
      textColor: "text-red-400",
      tag: "YouTube",
    },
    {
      id: "yt-academics",
      icon: <YoutubeIcon />,
      name: t("home.joinFamily.ytAcademics"),
      description: t("home.joinFamily.ytAcademicsDesc"),
      link: "https://www.youtube.com/@AP-academics",
      color: "from-orange-500 to-red-600",
      glowColor: "rgba(249,115,22,0.35)",
      iconBg: "bg-orange-500/15",
      iconBorder: "border-orange-500/30",
      hoverBorder: "hover:border-orange-500/60",
      textColor: "text-orange-400",
      tag: "YouTube",
    },
    {
      id: "podcast",
      icon: <PodcastIcon />,
      name: t("home.joinFamily.podcast"),
      description: t("home.joinFamily.podcastDesc"),
      link: "#",
      color: "from-purple-500 to-violet-700",
      glowColor: "rgba(139,92,246,0.35)",
      iconBg: "bg-purple-500/15",
      iconBorder: "border-purple-500/30",
      hoverBorder: "hover:border-purple-500/60",
      textColor: "text-purple-400",
      tag: "Podcast",
      comingSoon: true,
    },
    {
      id: "fb-page",
      icon: <FacebookIcon />,
      name: t("home.joinFamily.fbPage"),
      description: t("home.joinFamily.fbPageDesc"),
      link: "#",
      color: "from-blue-500 to-blue-700",
      glowColor: "rgba(59,130,246,0.35)",
      iconBg: "bg-blue-500/15",
      iconBorder: "border-blue-500/30",
      hoverBorder: "hover:border-blue-500/60",
      textColor: "text-blue-400",
      tag: "Facebook",
    },
    {
      id: "fb-group",
      icon: <UsersGroupIcon />,
      name: t("home.joinFamily.fbGroup"),
      description: t("home.joinFamily.fbGroupDesc"),
      link: "#",
      color: "from-sky-500 to-cyan-600",
      glowColor: "rgba(14,165,233,0.35)",
      iconBg: "bg-sky-500/15",
      iconBorder: "border-sky-500/30",
      hoverBorder: "hover:border-sky-500/60",
      textColor: "text-sky-400",
      tag: "Community",
    },
  ];

  return (
    <section className="py-12 relative overflow-hidden bg-black z-10">
      <div className="container relative mx-auto px-4 md:px-6 mb-12">
        <div className="relative glass-section border border-white/10 hover:border-white/20 group">
          {/* Colored glow orbs - Bottom Left & Bottom Right */}
          <div className="absolute bottom-0 left-0 -m-20 w-96 h-96 bg-pink-500/30 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 -m-20 w-96 h-96 bg-fuchsia-500/25 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Glass Stars */}
          <GlassStars colors={[
            "bg-pink-400 shadow-[0_0_12px_2px_rgba(244,114,182,0.8)]",
            "bg-fuchsia-400 shadow-[0_0_12px_2px_rgba(232,121,249,0.8)]"
          ]} />

          {/* Animated background glows */}
          <motion.div
            className="absolute top-[-20%] left-[10%] w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[160px] pointer-events-none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[-20%] right-[10%] w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[160px] pointer-events-none"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />

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
              className="inline-flex items-center gap-2 text-pink-400 font-semibold tracking-wider text-sm uppercase mb-4 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20"
            >
              <Heart className="w-4 h-4" />
              {t("home.joinFamily.eyebrow")}
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              {t("home.joinFamily.title")}
            </h2>
            <p className="text-lg text-white/60 max-w-2xl mx-auto">
              {t("home.joinFamily.subtitle")}
            </p>
          </motion.div>

          {/* Cards - top row 2 + bottom row 3 */}
          <div className="relative z-10 space-y-6">
            {/* Top row: 2 YouTube channels */}
            <div className="grid md:grid-cols-2 gap-6">
              {channels.slice(0, 2).map((channel, i) => (
                <ChannelCard key={channel.id} channel={channel} index={i} />
              ))}
            </div>
            {/* Bottom row: 3 cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {channels.slice(2).map((channel, i) => (
                <ChannelCard key={channel.id} channel={channel} index={i + 2} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

interface ChannelCardProps {
  channel: {
    id: string;
    icon: React.ReactNode;
    name: string;
    description: string;
    link: string;
    color: string;
    glowColor: string;
    iconBg: string;
    iconBorder: string;
    hoverBorder: string;
    textColor: string;
    tag: string;
    comingSoon?: boolean;
  };
  index: number;
}

function ChannelCard({ channel, index }: ChannelCardProps) {
  const { t } = useAppTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
    >
      <Link
        href={channel.link}
        target={channel.link !== "#" ? "_blank" : undefined}
        rel={channel.link !== "#" ? "noopener noreferrer" : undefined}
        className={`group/card relative flex items-start gap-5 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 ${channel.hoverBorder} transition-all duration-500 overflow-hidden block`}
      >
        {/* Top gradient strip */}
        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${channel.color} opacity-0 group-hover/card:opacity-100 transition-opacity duration-500`} />

        {/* Hover glow */}
        <div
          className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top left, ${channel.glowColor} 0%, transparent 60%)`,
          }}
        />

        {/* Icon */}
        <div className={`relative z-10 shrink-0 w-14 h-14 rounded-xl ${channel.iconBg} ${channel.iconBorder} border flex items-center justify-center ${channel.textColor} group-hover/card:scale-110 transition-transform duration-300`}>
          {channel.icon}
        </div>

        {/* Content */}
        <div className="relative z-10 flex-grow min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <h3 className="text-lg font-bold text-white group-hover/card:text-white/90 transition-colors truncate">
              {channel.name}
            </h3>
            <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full ${channel.iconBg} ${channel.textColor} border ${channel.iconBorder} shrink-0`}>
              {channel.tag}
            </span>
            {channel.comingSoon && (
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0 animate-pulse">
                {t("home.joinFamily.comingSoon")}
              </span>
            )}
          </div>
          <p className="text-sm text-white/50 leading-relaxed">
            {channel.description}
          </p>
        </div>

        {/* Arrow */}
        <div className="relative z-10 shrink-0 self-center">
          <ExternalLink className="w-5 h-5 text-white/20 group-hover/card:text-white/60 transition-colors" />
        </div>
      </Link>
    </motion.div>
  );
}
