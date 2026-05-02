/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import type { StudentCourse } from "@/lib/student-api";
import { formatNumber } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";
import { ProgressBar } from "./progress-bar";
import { StatePill } from "./state-pill";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200";

export function CourseProgressCard({
  course,
  className,
}: {
  course: StudentCourse;
  className?: string;
}) {
  const { t } = useAppTranslation();
  const { locale } = useLanguage();
  const focusLabel = course.current_lesson_title
    ? t("dashboard.upNext")
    : t("dashboard.lastCompletedLesson");
  const focusValue =
    course.current_lesson_title || course.last_completed_lesson_title || t("dashboard.noUpcomingLessons");

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50",
        className,
      )}
    >
      <div className="relative flex items-start gap-4 border-b border-slate-100 p-6">
        <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
          <img
            src={course.thumbnail || FALLBACK_IMAGE}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap gap-2">
            <StatePill
              variant={
                course.status === "completed"
                  ? "completed"
                  : course.status === "paused"
                    ? "paused"
                    : "active"
              }
              className="text-[10px]"
            />
            {course.access_status === "locked" ? <StatePill variant="locked" className="text-[10px]" /> : null}
          </div>

          <h3 className="line-clamp-2 text-base font-bold tracking-tight text-slate-950 group-hover:text-primary transition-colors">{course.title}</h3>
        </div>
      </div>

      <div className="flex flex-1 flex-col space-y-5 p-6">
        <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-colors group-hover:bg-slate-50">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            {focusLabel}
          </p>
          <p className="mt-1.5 line-clamp-1 text-sm font-bold text-slate-950">{focusValue}</p>
        </div>

        <div className="space-y-3">
          <ProgressBar
            value={course.progress_percent}
            label={t("dashboard.progress")}
            valueLabel={`${formatNumber(course.progress_percent, locale)}%`}
            className="h-2.5"
          />

          <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>
              {formatNumber(course.completed_lessons_count, locale)} / {formatNumber(course.total_lessons, locale)} {t("common.lessons")}
            </span>
            <span className="text-slate-500">
              {course.progress_percent}%
            </span>
          </div>
        </div>

        <Button asChild className="mt-auto w-full rounded-full bg-slate-950 px-6 py-6 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all hover:bg-primary hover:shadow-primary/20">
          <Link href={`/dashboard/courses/${course.slug}`}>
            <PlayCircle className="mr-2 h-4 w-4 fill-white/20" />
            {t("dashboard.continueAction")}
          </Link>
        </Button>
      </div>
    </article>
  );
}
