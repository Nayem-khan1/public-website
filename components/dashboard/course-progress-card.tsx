/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type { StudentCourse } from "@/lib/student-api";
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
  const focusLabel = course.current_lesson_title
    ? t("dashboard.upNext")
    : t("dashboard.lastCompletedLesson");
  const focusValue =
    course.current_lesson_title || course.last_completed_lesson_title || t("dashboard.noUpcomingLessons");

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white shadow-[0_20px_50px_-34px_rgba(15,23,42,0.22)]",
        className,
      )}
    >
      <div className="flex items-start gap-4 border-b border-slate-100 p-5">
        <div className="h-16 w-24 overflow-hidden rounded-[1.1rem] bg-slate-100">
          <img
            src={course.thumbnail || FALLBACK_IMAGE}
            alt={course.title}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatePill
              variant={
                course.status === "completed"
                  ? "completed"
                  : course.status === "paused"
                    ? "paused"
                    : "active"
              }
            />
            {course.access_status === "locked" ? <StatePill variant="locked" /> : null}
          </div>

          <h3 className="line-clamp-2 text-lg font-bold text-slate-950">{course.title}</h3>

          {course.current_module_title ? (
            <p className="mt-1 line-clamp-1 text-sm text-slate-500">
              {course.current_module_title}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            {focusLabel}
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-950">{focusValue}</p>
        </div>

        <ProgressBar
          value={course.progress_percent}
          label={t("dashboard.progress")}
          valueLabel={`${course.progress_percent}%`}
        />

        <div className="flex items-center justify-between gap-3 text-sm text-slate-500">
          <span>
            {course.completed_lessons_count}/{course.total_lessons} {t("common.lessons")}
          </span>
          <span>{t("dashboard.lessonsRemaining", { count: course.remaining_lessons })}</span>
        </div>

        <Button asChild className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800">
          <Link href={`/dashboard/courses/${course.slug}`}>
            <PlayCircle className="mr-2 h-4 w-4" />
            {t("dashboard.continueAction")}
          </Link>
        </Button>
      </div>
    </article>
  );
}
