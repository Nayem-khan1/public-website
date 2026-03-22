"use client";

import Link from "next/link";
import { Clock, BookOpen, Star } from "lucide-react";
import { Badge } from "./ui/badge";
import type { Course } from "@/data/types";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  getCourseLanguageLabel,
  getCourseLevelLabel,
  getCourseModeLabel,
} from "@/lib/i18n/course";
import { formatCurrency } from "@/lib/i18n/format";

interface CourseProps {
  course: Course;
}

export function CourseCard({ course }: CourseProps) {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnailUrl}
          alt={course.title || t("courseCard.untitled")}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute left-4 top-4 flex flex-col gap-2">
          <Badge className="w-fit border-none bg-white/90 font-semibold text-slate-900 backdrop-blur-md hover:bg-white">
            {course.category || t("courseCard.defaultCategory")}
          </Badge>
          <Badge className="w-fit border border-white/20 bg-black/50 font-medium text-white backdrop-blur-md hover:bg-black/60">
            {course.grade || t("courseCard.allGrades")}
          </Badge>
        </div>

        <div className="absolute right-4 top-4">
          <Badge
            variant={course.mode === "live" ? "default" : "secondary"}
            className={`${course.mode === "live" ? "bg-red-500 hover:bg-red-600" : "bg-slate-700 hover:bg-slate-800"} border-none text-white shadow-lg`}
          >
            {getCourseModeLabel(course.mode, t)}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between text-sm font-medium text-slate-500">
          <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1">
            <BookOpen className="h-3.5 w-3.5 text-primary" />{" "}
            {getCourseLevelLabel(course.level, t)}
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5 text-slate-400" />{" "}
              {course.totalLessons} {t("common.lessons")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />{" "}
              {course.duration || t("common.selfPaced")}
            </span>
          </div>
        </div>

        <Link href={`/courses/${course.slug}`}>
          <h3 className="mb-3 line-clamp-2 cursor-pointer text-xl font-bold text-slate-900 transition-colors group-hover:text-primary">
            {course.title || t("courseCard.untitled")}
          </h3>
        </Link>

        <div className="mb-3 text-xs text-slate-500">
          {getCourseLanguageLabel(course.language, t)}
        </div>

        <div className="mb-4 flex items-center gap-1">
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
