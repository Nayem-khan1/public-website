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
        "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.42)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_70px_-38px_rgba(15,23,42,0.42)]",
        course.isPopular && "border-amber-200/90 bg-[linear-gradient(180deg,rgba(255,251,235,0.9),rgba(255,255,255,1))]",
        animationClass,
      )}
    >
      {course.isPopular ? (
        <div
          className={cn(
            "pointer-events-none absolute -right-14 -top-14 h-36 w-36 rounded-full bg-amber-300/30 blur-3xl",
            orbClass,
          )}
        />
      ) : null}

      <div className="relative h-52 overflow-hidden">
        <img
          src={course.thumbnailUrl}
          alt={course.title || t("courseCard.untitled")}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-900/20 to-transparent" />

        <div className="absolute left-4 top-4 flex max-w-[80%] flex-wrap gap-2">
          {course.isPopular ? (
            <Badge className="border-none bg-amber-300 text-slate-950 hover:bg-amber-300">
              <Sparkles className="mr-1 h-3.5 w-3.5" />
              {popularLabel}
            </Badge>
          ) : null}
          <Badge className="border-none bg-white/90 font-semibold text-slate-900 backdrop-blur-md hover:bg-white">
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
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-medium text-slate-500">
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
            <BookOpen className="h-3.5 w-3.5 text-primary" />
            {getCourseLevelLabel(course.level, t)}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {course.duration || t("common.selfPaced")}
          </span>
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1">
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            {course.totalLessons} {t("common.lessons")}
          </span>
        </div>

        <Link href={`/courses/${course.slug}`}>
          <h3 className="mb-3 line-clamp-2 cursor-pointer text-xl font-bold text-slate-900 transition-colors group-hover:text-primary">
            {course.title || t("courseCard.untitled")}
          </h3>
        </Link>

        <p className="mb-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {course.shortDescription || course.description}
        </p>

        <div className="mb-3 text-xs uppercase tracking-[0.24em] text-slate-400">
          {getCourseLanguageLabel(course.language, t)}
        </div>

        <div className="mb-5 flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-1 text-xs text-slate-500">(4.8)</span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 line-through">
              {course.originalPrice ? formatCurrency(course.originalPrice, locale) : ""}
            </span>
            <span className="text-xl font-bold text-primary">
              {course.price === 0
                ? t("courseCard.free")
                : formatCurrency(course.price, locale)}
            </span>
          </div>
          <Link
            href={`/courses/${course.slug}`}
            className="text-sm font-semibold text-slate-900 underline decoration-2 decoration-primary/30 underline-offset-4 transition-all hover:text-primary hover:decoration-primary"
          >
            {t("courseCard.viewDetails")}
          </Link>
        </div>
      </div>
    </div>
  );
}
