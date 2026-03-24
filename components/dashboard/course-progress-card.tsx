/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  Clock,
  History,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type { Locale } from "@/lib/i18n/config";
import { formatRelativeDate } from "@/lib/student-dashboard";
import type { StudentCourse } from "@/lib/student-api";
import { cn } from "@/lib/utils";
import { StatePill } from "./state-pill";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200";

export function CourseProgressCard({
  course,
  locale,
  actionLoadingCourseId,
  onCompleteNext,
  className,
}: {
  course: StudentCourse;
  locale: Locale;
  actionLoadingCourseId: string | null;
  onCompleteNext: (courseId: string) => Promise<void> | void;
  className?: string;
}) {
  const { t } = useAppTranslation();
  const isActionLoading = actionLoadingCourseId === course.course_id;
  const isCompleted = course.remaining_lessons === 0 || course.status === "completed";
  const isLocked = course.access_status === "locked";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_22px_55px_-34px_rgba(15,23,42,0.32)]",
        className,
      )}
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={course.thumbnail || FALLBACK_IMAGE}
          alt={course.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/35 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <StatePill
            variant={
              course.status === "completed"
                ? "completed"
                : course.status === "paused"
                  ? "paused"
                  : "active"
            }
          />
          {isLocked ? <StatePill variant="locked" /> : null}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="line-clamp-2 text-xl font-bold text-white">{course.title}</h3>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              <BookOpen className="h-3.5 w-3.5" />
              {t("common.lessons")}
            </div>
            <p className="font-semibold text-slate-900">{course.total_lessons}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              <Clock className="h-3.5 w-3.5" />
              {t("dashboard.duration")}
            </div>
            <p className="font-semibold text-slate-900">{course.duration || t("common.selfPaced")}</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <div className="mb-1 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              <History className="h-3.5 w-3.5" />
              {t("dashboard.lastActive")}
            </div>
            <p className="font-semibold text-slate-900">{formatRelativeDate(course.last_activity_at, locale)}</p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-slate-600">{t("dashboard.progress")}</span>
            <span className="font-semibold text-slate-900">{course.progress_percent}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#f1024c_0%,#514a89_100%)] transition-all duration-500"
              style={{ width: `${course.progress_percent}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
            <span>
              {course.completed_lessons_count}/{course.total_lessons} {t("dashboard.lessonsDone")}
            </span>
            <span>{t("dashboard.lessonsRemaining", { count: course.remaining_lessons })}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
            <Link href={`/dashboard/courses/${course.slug}`}>
              {t("dashboard.viewRoadmap")}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full border-slate-200">
            <Link href={`/courses/${course.slug}`}>{t("dashboard.openCourse")}</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            disabled={isActionLoading || isCompleted || isLocked}
            onClick={() => void onCompleteNext(course.course_id)}
            className="rounded-full text-primary hover:bg-primary/10 hover:text-primary"
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t("dashboard.completed")}
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                {isActionLoading ? t("dashboard.updating") : t("dashboard.completeNext")}
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
