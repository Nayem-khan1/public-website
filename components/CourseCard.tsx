"use client";

import Link from "next/link";
import { BookOpen, Clock, Sparkles, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import type { Course } from "@/data/types";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  getCourseLanguageLabel,
  getCourseLevelLabel,
  getCourseModeLabel,
} from "@/lib/i18n/course";
import { formatCurrency } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";

interface CourseProps {
  course: Course;
}

export function CourseCard({ course }: CourseProps) {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();

  const popularLabel = locale === "bn" ? "জনপ্রিয়" : "Popular";
  const spotlightLabel = locale === "bn" ? "স্পটলাইট" : "Spotlight";
  const animationClass =
    course.highlightAnimation === "pulse"
      ? "course-card-highlight-pulse"
      : course.highlightAnimation === "blink"
        ? "course-card-highlight-blink"
        : "";
  const orbClass =
    course.highlightAnimation === "pulse"
      ? "course-spotlight-pulse"
      : course.highlightAnimation === "blink"
        ? "course-spotlight-blink"
        : "";

  return (
    <div
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-blue-500/30 bg-[#050505] shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_0_50px_rgba(59,130,246,0.4)] hover:border-blue-400/50",
        course.isPopular && "border-blue-500/60 shadow-[0_0_40px_rgba(59,130,246,0.2)]",
        animationClass,
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none" />

      {course.isPopular ? (
        <div
          className={cn(
            "pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-blue-500/30 blur-[60px]",
            orbClass,
          )}
        />
      ) : null}

      <div className="relative h-52 overflow-hidden rounded-t-[2rem]">
        <img
          src={course.thumbnailUrl}
          alt={course.title || t("courseCard.untitled")}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />

        <div className="absolute left-4 top-4 flex max-w-[80%] flex-wrap gap-2">
          {course.isPopular ? (
            <Badge className="border-none bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)]">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {popularLabel}
            </Badge>
          ) : null}
          <Badge className="border border-white/20 bg-black/60 font-medium text-white/90 backdrop-blur-md">
            {course.category || t("courseCard.defaultCategory")}
          </Badge>
          <Badge className="border border-white/20 bg-black/50 font-medium text-white backdrop-blur-md hover:bg-black/60">
            {course.grade || t("courseCard.allGrades")}
          </Badge>
        </div>

        <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
          <Badge
            variant={course.mode === "live" ? "default" : "secondary"}
            className={`${course.mode === "live" ? "bg-red-500 hover:bg-red-600" : "bg-slate-700 hover:bg-slate-800"} border-none text-white shadow-lg`}
          >
            {getCourseModeLabel(course.mode, t)}
          </Badge>
          {course.highlightAnimation !== "none" ? (
            <Badge className="border-none bg-slate-950/75 text-white backdrop-blur-md hover:bg-slate-950/75">
              {spotlightLabel}
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-medium text-white/60">
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-md">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            {getCourseLevelLabel(course.level, t)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-md">
            <Clock className="h-3.5 w-3.5 text-white/60" />
            {course.duration || t("common.selfPaced")}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 backdrop-blur-md">
            <BookOpen className="h-3.5 w-3.5 text-white/60" />
            {course.totalLessons} {t("common.lessons")}
          </span>
        </div>

        <Link href={`/courses/${course.slug}`} className="relative z-10">
          <h3 className="mb-3 line-clamp-2 cursor-pointer text-xl font-bold text-white transition-all duration-300 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">
            {course.title || t("courseCard.untitled")}
          </h3>
        </Link>

        <p className="mb-3 line-clamp-3 text-sm leading-6 text-white/70">
          {course.shortDescription || course.description}
        </p>

        <div className="mb-3 text-xs uppercase tracking-[0.24em] text-white/50">
          {getCourseLanguageLabel(course.language, t)}
        </div>

        <div className="mb-5 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 fill-primary text-primary drop-shadow-[0_0_8px_rgba(241,2,76,0.4)]" />
          ))}
          <span className="ml-1 text-xs text-white/50">(4.8)</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-white/50 line-through">
              {course.originalPrice ? formatCurrency(course.originalPrice, locale) : ""}
            </span>
            <span className="text-xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              {course.price === 0
                ? t("courseCard.free")
                : formatCurrency(course.price, locale)}
            </span>
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="text-sm font-semibold text-primary/80 transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_10px_rgba(241,2,76,0.6)]"
          >
            {t("courseCard.viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
}
