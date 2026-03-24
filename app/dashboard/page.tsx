"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowUpRight, Flag, Rocket, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseProgressCard } from "@/components/dashboard/course-progress-card";
import { StatePill } from "@/components/dashboard/state-pill";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import { formatRelativeDate, getCourseActivityCounts } from "@/lib/student-dashboard";
import {
  completeNextLesson,
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
  const [actionLoadingCourseId, setActionLoadingCourseId] = useState<string | null>(null);

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

  async function handleCompleteNextLesson(courseId: string) {
    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.authRequired"));
      return;
    }

    setActionLoadingCourseId(courseId);
    setError(null);

    try {
      await completeNextLesson(courseId, token);
      await loadDashboard();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : t("dashboard.completeLessonFailed"));
    } finally {
      setActionLoadingCourseId(null);
    }
  }

  const courses = data?.enrolled_courses ?? [];
  const counts = getCourseActivityCounts(courses);
  const continuingCourses = [...courses]
    .filter((course) => course.access_status === "active")
    .sort((left, right) => right.progress_percent - left.progress_percent)
    .slice(0, 3);
  const focusCourse = continuingCourses.find((course) => course.remaining_lessons > 0) ?? continuingCourses[0] ?? null;
  const attentionCourses = courses.filter(
    (course) =>
      course.access_status === "active" &&
      course.status !== "completed" &&
      course.progress_percent < 35,
  );
  const topPerformer = [...courses]
    .filter((course) => course.progress_percent > 0)
    .sort((left, right) => right.progress_percent - left.progress_percent)[0] ?? null;
  const nextLesson = data?.upcoming_lessons[0] ?? null;
  const nextMissionSlug = nextLesson
    ? courses.find((course) => course.course_id === nextLesson.course_id)?.slug
    : null;
  const nextMissionHref = nextMissionSlug
    ? `/dashboard/courses/${nextMissionSlug}`
    : "/dashboard/courses";

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_right,rgba(241,2,76,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(81,74,137,0.22),transparent_35%),linear-gradient(135deg,#020617_0%,#111827_55%,#1e293b_100%)] px-6 py-7 text-white shadow-[0_36px_80px_-42px_rgba(15,23,42,0.75)] md:px-8 md:py-9">
        <div className="absolute -right-20 top-0 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-16 left-10 h-44 w-44 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
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
              {t("dashboard.heroSubtitle")}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-white/90">
                <Link href="/dashboard/courses">
                  {t("dashboard.viewRoadmap")}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
                <Link href="/courses">{t("dashboard.browseCatalog")}</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-[1.8rem] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.22em] text-white/60">
              <Rocket className="h-4 w-4" />
              {t("dashboard.nextMission")}
            </div>
            {nextLesson ? (
              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/45">{nextLesson.course_title}</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{nextLesson.lesson_title}</h3>
                  <p className="mt-2 text-sm text-white/70">
                    {t("dashboard.lessonNumber", { number: nextLesson.order_no })}
                  </p>
                </div>
                <Button asChild className="w-full rounded-full bg-primary text-white hover:bg-primary/90">
                  <Link href={nextMissionHref}>{t("dashboard.openMission")}</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <StatePill variant="completed" className="border-white/15 bg-white/10 text-white" />
                <p className="text-lg font-semibold text-white">{t("dashboard.noUpcomingLessons")}</p>
                <p className="text-sm text-white/65">{t("dashboard.noMissionSubtitle")}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          {
            title: t("dashboard.enrolledCourses"),
            value: loading ? "-" : data?.stats.enrolled_courses ?? 0,
            helper: t("dashboard.learningPortfolio"),
            icon: Flag,
            accent: "from-rose-500/20 to-rose-100",
          },
          {
            title: t("dashboard.activeCourses"),
            value: loading ? "-" : counts.active,
            helper: t("dashboard.keepMomentum"),
            icon: Rocket,
            accent: "from-cyan-500/20 to-cyan-100",
          },
          {
            title: t("dashboard.remainingLessons"),
            value: loading ? "-" : counts.remainingLessons,
            helper: t("dashboard.lessonsWaiting"),
            icon: Sparkles,
            accent: "from-violet-500/20 to-violet-100",
          },
          {
            title: t("dashboard.certificates"),
            value: loading ? "-" : data?.stats.issued_certificates ?? 0,
            helper: `${t("dashboard.completionRate")} � ${Math.round(data?.stats.completion_rate ?? 0)}%`,
            icon: Trophy,
            accent: "from-amber-500/20 to-amber-100",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.32)]">
            <div className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${item.accent} p-3 text-slate-900`}>
              <item.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">{item.title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
            <p className="mt-2 text-sm text-slate-500">{item.helper}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[1.85rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t("dashboard.continueLearning")}</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">{t("dashboard.keepMomentum")}</h3>
            </div>
            <Button asChild variant="ghost" className="rounded-full text-primary hover:bg-primary/10 hover:text-primary">
              <Link href="/dashboard/courses">{t("common.viewAll")}</Link>
            </Button>
          </div>

          {loading ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
              {t("dashboard.loadingEnrolledCourses")}
            </div>
          ) : continuingCourses.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
              {t("dashboard.noEnrolledCourses")}
            </div>
          ) : (
            <div className="grid gap-5 xl:grid-cols-2">
              {continuingCourses.map((course) => (
                <CourseProgressCard
                  key={course.enrollment_id}
                  course={course}
                  locale={locale}
                  actionLoadingCourseId={actionLoadingCourseId}
                  onCompleteNext={handleCompleteNextLesson}
                />
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-600">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t("dashboard.achievements")}</p>
                <h3 className="text-xl font-bold text-slate-950">{t("dashboard.learningHighlights")}</h3>
              </div>
            </div>
            <div className="space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{t("dashboard.completedCourses")}</p>
                <p className="mt-1 text-slate-500">{counts.completed}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{t("dashboard.bestProgress")}</p>
                <p className="mt-1 text-slate-500">
                  {topPerformer
                    ? `${topPerformer.title} � ${topPerformer.progress_percent}%`
                    : t("dashboard.bestProgressFallback")}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="font-semibold text-slate-950">{t("dashboard.lastActive")}</p>
                <p className="mt-1 text-slate-500">
                  {focusCourse ? formatRelativeDate(focusCourse.last_activity_at, locale) : t("dashboard.noActivityYet")}
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-50 p-3 text-amber-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t("dashboard.attentionNeeded")}</p>
                <h3 className="text-xl font-bold text-slate-950">{t("dashboard.upcomingLessons")}</h3>
              </div>
            </div>
            {data?.upcoming_lessons.length ? (
              <div className="space-y-3">
                {data?.upcoming_lessons.map((lesson) => {
                  const lessonSlug = courses.find((course) => course.course_id === lesson.course_id)?.slug;
                  const lessonHref = lessonSlug ? `/dashboard/courses/${lessonSlug}` : "/dashboard/courses";
                  return (
                    <Link
                      key={lesson.lesson_id}
                      href={lessonHref}
                      className="block rounded-2xl border border-slate-200 px-4 py-4 transition-colors hover:border-primary/30 hover:bg-primary/5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                        {lesson.course_title}
                      </p>
                      <p className="mt-2 font-semibold text-slate-950">{lesson.lesson_title}</p>
                      <p className="mt-1 text-sm text-slate-500">{t("dashboard.lessonNumber", { number: lesson.order_no })}</p>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                {t("dashboard.noUpcomingLessons")}
              </p>
            )}
          </article>
        </div>
      </section>

      <section className="rounded-[1.85rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t("dashboard.attentionNeeded")}</p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">{t("dashboard.coursesNeedingAttention")}</h3>
          </div>
          <StatePill variant={attentionCourses.length ? "paused" : "available"} />
        </div>
        {attentionCourses.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {attentionCourses.map((course) => (
              <div key={course.enrollment_id} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold text-slate-950">{course.title}</p>
                <p className="mt-2 text-sm text-slate-500">
                  {t("dashboard.lessonsRemaining", { count: course.remaining_lessons })}
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,#f97316_0%,#f1024c_100%)]"
                    style={{ width: `${course.progress_percent}%` }}
                  />
                </div>
                <div className="mt-5 flex items-center gap-3">
                  <Button asChild size="sm" className="rounded-full bg-slate-950 text-white hover:bg-slate-800">
                    <Link href={`/dashboard/courses/${course.slug}`}>{t("dashboard.viewRoadmap")}</Link>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={actionLoadingCourseId === course.course_id}
                    onClick={() => void handleCompleteNextLesson(course.course_id)}
                    className="rounded-full text-primary hover:bg-primary/10 hover:text-primary"
                  >
                    {actionLoadingCourseId === course.course_id ? t("dashboard.updating") : t("dashboard.completeNext")}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
            {t("dashboard.noAttentionCourses")}
          </div>
        )}
      </section>
    </div>
  );
}
