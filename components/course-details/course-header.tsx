import Link from "next/link";
import { ArrowLeft, Star, PlayCircle, Sparkles, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseHeaderProps {
  title: string;
  subtitle?: string;
  category: string;
  level: string;
  rating?: number;
  totalStudents?: number;
  backText: string;
  language?: string;
  isFree?: boolean;
  mode?: string;
}

export function CourseHeader({
  title,
  subtitle,
  category,
  level,
  rating = 4.8,
  totalStudents = 1250,
  backText,
  mode
}: CourseHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-slate-950 pb-20 pt-28 md:pb-36 md:pt-36 border-b border-indigo-900/40">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-black opacity-100" />
      
      {/* Abstract Glowing Orbs */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/3 w-[500px] h-[500px] rounded-full bg-blue-500/15 blur-[120px] pointer-events-none" />

      <div className="container relative mx-auto px-4 md:px-6 z-10">
        <Link
          href="/courses"
          className="mb-8 inline-flex items-center gap-2.5 text-slate-400 transition-all hover:text-white font-medium hover:-translate-x-1"
        >
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Link>

        <div className="max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge className="border-primary/50 bg-primary/20 text-blue-100 px-3 py-1.5 text-sm backdrop-blur-md flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              {category}
            </Badge>
            <Badge className="border-purple-500/40 bg-purple-500/20 text-purple-200 px-3 py-1.5 text-sm backdrop-blur-md">
              {level}
            </Badge>
            {mode && (
              <Badge className="border-emerald-500/40 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 text-sm backdrop-blur-md flex gap-1.5 items-center">
                <PlayCircle className="w-3.5 h-3.5" />
                {mode}
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-black leading-[1.1] text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400 md:text-5xl lg:text-6xl mb-6 tracking-tight drop-shadow-sm">
            {title}
          </h1>
          
          {subtitle && (
            <p className="mb-8 mt-2 text-lg md:text-xl text-slate-300/90 leading-relaxed font-light max-w-2xl">{subtitle}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-xl rounded-full px-5 py-3 border border-white/10 shadow-2xl hover:bg-white/10 transition-colors cursor-default">
              <div className="flex text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current opacity-40" />
              </div>
              <span className="text-white font-bold tracking-wide">{rating}</span>
              <span className="text-slate-400 text-sm font-medium">(124 reviews)</span>
            </div>
            
            <div className="flex items-center gap-2.5 bg-white/5 backdrop-blur-xl rounded-full px-5 py-3 border border-white/10 shadow-2xl hover:bg-white/10 transition-colors cursor-default">
              <Trophy className="h-4 w-4 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span className="font-bold text-white tracking-wide">{totalStudents}</span>
              <span className="text-sm font-medium text-slate-400 border-l border-white/20 pl-2">Enrolled</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
