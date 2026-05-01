import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  Clock3,
  Globe2,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseHeaderProps {
  title: string;
  subtitle?: string;
  category: string;
  level: string;
  backText: string;
  mode?: string;
  lessonsText?: string;
  durationText?: string;
  languageText?: string;
}

export function CourseHeader({
  title,
  subtitle,
  category,
  level,
  backText,
  mode,
  lessonsText,
  durationText,
  languageText,
}: CourseHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-[#0d101b] pb-16 pt-24 md:pb-24 md:pt-28">
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d101b] via-[#0d101b]/90 to-transparent z-0" />
      
      {/* Brand Glowing Orbs */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[120px] pointer-events-none mix-blend-screen" />

      <div className="container relative mx-auto px-4 md:px-6 z-10">
        <Link
          href="/courses"
          className="mb-8 inline-flex items-center gap-2.5 text-slate-400 transition-all hover:text-white font-medium hover:-translate-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Link>

        <div className="max-w-3xl lg:w-[65%]">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge className="border-white/10 bg-white/5 text-white px-3 py-1 text-[13px] backdrop-blur-md flex items-center gap-1.5 font-medium rounded-md">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              {category}
            </Badge>
            <Badge className="border-white/10 bg-white/5 text-white px-3 py-1 text-[13px] backdrop-blur-md font-medium rounded-md">
              {level}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold leading-[1.3] text-white md:text-4xl lg:text-[2.5rem] mb-4 drop-shadow-sm font-display tracking-tight">
            {title}
          </h1>
          
          {subtitle && (
            <p className="mt-2 text-base md:text-lg text-slate-300 leading-relaxed font-light max-w-2xl">{subtitle}</p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-6">
            {lessonsText ? (
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <BookOpen className="h-4 w-4 text-primary" />
                <span>{lessonsText}</span>
              </div>
            ) : null}

            {durationText ? (
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Clock3 className="h-4 w-4 text-primary" />
                <span>{durationText}</span>
              </div>
            ) : null}

            {languageText ? (
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Globe2 className="h-4 w-4 text-primary" />
                <span>{languageText}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
