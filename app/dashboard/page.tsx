"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Award, BookOpen, Flame, Sparkles } from "lucide-react";
import { ActivityTracker } from "@/components/dashboard/activity-tracker";
import { CourseProgressCard } from "@/components/dashboard/course-progress-card";
import { Button } from "@/components/ui/button";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  getStudentAccessToken,
  getStudentDashboard,
  type StudentDashboardData,
} from "@/lib/student-api";

export default function DashboardPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.dashboardAuthRequired"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dashboard = await getStudentDashboard(token, locale);
      setData(dashboard);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("dashboard.loadDashboardFailed"));
    } finally {
      setLoading(false);
    }
  }, [locale, t]);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const courses = data?.enrolled_courses ?? [];
  const continueCourses = courses
    .filter((course) => course.access_status === "active")
    .slice(0, 3);
  const nextLesson = data?.upcoming_lessons[0] ?? null;
  const nextLessonSlug = nextLesson
    ? courses.find((course) => course.course_id === nextLesson.course_id)?.slug ?? null
    : null;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(241,2,76,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(81,74,137,0.22),transparent_35%),linear-gradient(135deg,#020617_0%,#111827_55%,#1e293b_100%)] px-6 py-8 text-white shadow-[0_36px_80px_-42px_rgba(15,23,42,0.75)] md:px-8 md:py-9">
        <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-secondary/20 blur-3xl" />

        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-white/75">
              <Sparkles className="h-3.5 w-3.5" />
              {t("dashboard.dashboardLabel")}
            </div>
            <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
              {loading
                ? t("dashboard.loadingDashboard")
                : t("dashboard.welcomeBack", {
                    name: data?.student.name || t("common.student"),
                  })}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
              {t("dashboard.dashboardHeroSubtitle")}
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  {t("dashboard.enrolledCourses")}
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {loading ? "-" : data?.stats.enrolled_courses ?? 0}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  {t("dashboard.completedCourses")}
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {loading ? "-" : data?.stats.completed_courses ?? 0}
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                  {t("dashboard.currentStreak")}
                </p>
                <p className="mt-2 flex items-center gap-2 text-3xl font-bold text-white">
                  <Flame className="h-6 w-6 text-amber-300" />
                  {loading ? "-" : data?.stats.current_streak ?? 0}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/60">
              <BookOpen className="h-4 w-4" />
              {t("dashboard.nextMission")}
            </div>

            {nextLesson && nextLessonSlug ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">
                    {nextLesson.course_title}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">
                    {nextLesson.lesson_title}
                  </h3>
                  <p className="mt-2 text-sm text-white/70">
                    {t("dashboard.lessonNumber", { number: nextLesson.order_no })}
                  </p>
                </div>
                <Button asChild className="w-full rounded-full bg-white text-slate-950 hover:bg-white/90">
                  <Link href={`/dashboard/courses/${nextLessonSlug}`}>
                    {t("dashboard.continueAction")}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  {t("dashboard.completed")}
                </div>
                <p className="text-lg font-semibold text-white">{t("dashboard.noUpcomingLessons")}</p>
                <p className="text-sm text-white/65">{t("dashboard.noMissionSubtitle")}</p>
              </div>
            )}

            <div className="mt-6 border-t border-white/10 pt-5">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span>{t("dashboard.certificates")}</span>
                <span className="font-semibold text-white">
                  {loading ? "-" : data?.stats.issued_certificates ?? 0}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-white/70">
                <span>{t("dashboard.completionRate")}</span>
                <span className="font-semibold text-white">
                  {loading ? "-" : `${Math.round(data?.stats.completion_rate ?? 0)}%`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[1.85rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                {t("dashboard.continueLearning")}
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">
                {t("dashboard.learningQueue")}
              </h3>
            </div>
            <Button asChild variant="ghost" className="rounded-full text-primary hover:bg-primary/10 hover:text-primary">
              <Link href="/my-courses">{t("common.viewAll")}</Link>
            </Button>
          </div>

          {loading ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
              {t("dashboard.loadingEnrolledCourses")}
            </div>
          ) : continueCourses.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
              {t("dashboard.noEnrolledCourses")}
            </div>
          ) : (
            <div className="-mx-2 flex snap-x gap-5 overflow-x-auto px-2 pb-2">
              {continueCourses.map((course) => (
                <CourseProgressCard
                  key={course.enrollment_id}
                  course={course}
                  locale={locale}
                  className="min-w-[320px] snap-start md:min-w-[360px]"
                />
              ))}
            </div>
          )}
        </div>

        <ActivityTracker days={data?.activity_last_7_days ?? []} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: t("dashboard.lessonsCompleted"),
            value: loading ? "-" : data?.stats.total_lessons_completed ?? 0,
            icon: BookOpen,
          },
          {
            title: t("dashboard.certificates"),
            value: loading ? "-" : data?.stats.issued_certificates ?? 0,
            icon: Award,
          },
          {
            title: t("dashboard.completionRate"),
            value: loading ? "-" : `${Math.round(data?.stats.completion_rate ?? 0)}%`,
            icon: Sparkles,
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.22)]"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-3 text-slate-900">
              <item.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">{item.title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
