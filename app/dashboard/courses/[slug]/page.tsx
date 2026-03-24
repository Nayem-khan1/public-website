/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  Layers,
  PlayCircle,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatePill } from "@/components/dashboard/state-pill";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import { formatRelativeDate, formatShortDate } from "@/lib/student-dashboard";
import {
  completeNextLesson,
  getStudentAccessToken,
  getStudentCourseRoadmap,
  getStudentCourses,
  type StudentCourse,
  type StudentCourseRoadmapData,
} from "@/lib/student-api";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1400";

export default function StudentCourseRoadmapPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const params = useParams();
  const rawSlug = params?.slug;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug ?? "";
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null);
  const [roadmap, setRoadmap] = useState<StudentCourseRoadmapData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadRoadmap = useCallback(async () => {
    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.dashboardAuthRequired"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const courses = await getStudentCourses(token, locale);
      const matchedCourse = courses.find((course) => course.slug === slug);

      if (!matchedCourse) {
        setSelectedCourse(null);
        setRoadmap(null);
        setError(t("dashboard.courseNotFound"));
        return;
      }

      setSelectedCourse(matchedCourse);
      const nextRoadmap = await getStudentCourseRoadmap(matchedCourse.course_id, token, locale);
      setRoadmap(nextRoadmap);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("dashboard.loadCoursesFailed"));
    } finally {
      setLoading(false);
    }
  }, [locale, slug, t]);

  useEffect(() => {
    void loadRoadmap();
  }, [loadRoadmap]);

  async function handleCompleteNextLesson() {
    if (!roadmap) {
      return;
    }

    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.authRequired"));
      return;
    }

    setActionLoading(true);
    setError(null);

    try {
      await completeNextLesson(roadmap.course.course_id, token);
      await loadRoadmap();
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : t("dashboard.completeLessonFailed"));
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)]">
        <div className="relative overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(241,2,76,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(81,74,137,0.18),transparent_35%),linear-gradient(135deg,#020617_0%,#0f172a_60%,#1e293b_100%)] px-6 py-8 text-white md:px-8 md:py-10">
          <div className="relative z-10 flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
            <div className="max-w-3xl">
              <Button asChild variant="ghost" className="mb-4 rounded-full px-0 text-white/70 hover:bg-transparent hover:text-white">
                <Link href="/dashboard/courses">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t("dashboard.backToMyCourses")}
                </Link>
              </Button>
              <div className="mb-4 flex flex-wrap gap-2">
                <StatePill
                  variant={
                    roadmap?.course.status === "completed"
                      ? "completed"
                      : roadmap?.course.status === "paused"
                        ? "paused"
                        : "active"
                  }
                  className="border-white/15 bg-white/10 text-white"
                />
                {roadmap?.course.access_status === "locked" ? (
                  <StatePill variant="locked" className="border-white/15 bg-white/10 text-white" />
                ) : null}
              </div>
              <h2 className="text-3xl font-bold md:text-5xl">
                {loading
                  ? t("dashboard.loadingDashboard")
                  : roadmap?.course.title || selectedCourse?.title || t("dashboard.courseNotFound")}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 md:text-base">
                {roadmap?.course.subtitle || t("dashboard.roadmapSubtitle")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild className="rounded-full bg-white text-slate-950 hover:bg-white/90">
                  <Link href={`/courses/${slug}`}>{t("dashboard.openCourse")}</Link>
                </Button>
                <Button asChild variant="outline" className="rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white">
                  <Link href="/dashboard/courses">{t("dashboard.viewRoadmap")}</Link>
                </Button>
              </div>
            </div>

            <div className="w-full max-w-md overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/10 backdrop-blur-xl">
              <img
                src={roadmap?.course.thumbnail || selectedCourse?.thumbnail || FALLBACK_IMAGE}
                alt={roadmap?.course.title || selectedCourse?.title || t("dashboard.courseNotFound")}
                className="h-44 w-full object-cover"
              />
              <div className="space-y-4 p-5 text-sm text-white/72">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">{t("dashboard.progress")}</p>
                    <p className="mt-1 text-xl font-semibold text-white">{roadmap?.course.progress_percent ?? selectedCourse?.progress_percent ?? 0}%</p>
                  </div>
                  <div className="rounded-2xl bg-white/8 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-white/45">{t("dashboard.lastUpdated")}</p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      {roadmap ? formatShortDate(roadmap.course.last_activity_at, locale) : t("common.loading")}
                    </p>
                  </div>
                </div>
                <p>{roadmap ? formatRelativeDate(roadmap.course.last_activity_at, locale) : t("common.loading")}</p>
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
        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t("dashboard.roadmapOverview")}</p>
                <h3 className="text-xl font-bold text-slate-950">{t("dashboard.learningPortfolio")}</h3>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("dashboard.totalModules")}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{roadmap?.summary.total_modules ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("dashboard.completedModules")}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{roadmap?.summary.completed_modules ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("dashboard.lessonsCompleted")}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{roadmap?.summary.completed_lessons ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("dashboard.remainingLessons")}</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{roadmap?.course.remaining_lessons ?? 0}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                <Rocket className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t("dashboard.nextMission")}</p>
                <h3 className="text-xl font-bold text-slate-950">{t("dashboard.currentLesson")}</h3>
              </div>
            </div>
            {roadmap?.summary.next_lesson ? (
              <div className="space-y-4">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{roadmap.summary.next_lesson.module_title}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{roadmap.summary.next_lesson.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {t("dashboard.lessonNumber", { number: roadmap.summary.next_lesson.order_no })}
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() => void handleCompleteNextLesson()}
                  disabled={actionLoading || roadmap.course.access_status === "locked"}
                  className="w-full rounded-full bg-slate-950 text-white hover:bg-slate-800"
                >
                  {actionLoading ? (
                    <>
                      <Clock3 className="mr-2 h-4 w-4" />
                      {t("dashboard.updating")}
                    </>
                  ) : (
                    <>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      {t("dashboard.completeNext")}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">
                <div className="flex items-center gap-2 text-slate-900">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span className="font-semibold">{t("dashboard.completed")}</span>
                </div>
                <p>{t("dashboard.noUpcomingLessons")}</p>
              </div>
            )}
            {roadmap?.course.access_status === "locked" ? (
              <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {t("dashboard.lockedCourseMessage")}
              </p>
            ) : null}
          </article>
        </div>

        <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t("dashboard.roadmapOverview")}</p>
              <h3 className="text-xl font-bold text-slate-950">{t("dashboard.modulesTitle")}</h3>
            </div>
          </div>
          {loading ? (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">{t("dashboard.loadingDashboard")}</p>
          ) : roadmap?.modules.length ? (
            <div className="space-y-3">
              {roadmap.modules.map((module) => (
                <div key={module.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{t("dashboard.moduleLabel", { number: module.order_no })}</p>
                      <p className="mt-1 font-semibold text-slate-950">{module.title}</p>
                    </div>
                    <StatePill variant={module.status === "completed" ? "completed" : module.status === "locked" ? "locked" : module.status === "current" ? "current" : "upcoming"} />
                  </div>
                  <div className="mb-4 h-2 overflow-hidden rounded-full bg-white">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#f1024c_0%,#514a89_100%)]"
                      style={{ width: `${module.progress_percent}%` }}
                    />
                  </div>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white px-3 py-3 text-sm">
                        <div>
                          <p className="font-medium text-slate-900">{lesson.title}</p>
                          <p className="text-xs text-slate-500">{t("dashboard.lessonNumber", { number: lesson.order_no })}</p>
                        </div>
                        <StatePill variant={lesson.status} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-2xl bg-slate-50 px-4 py-5 text-sm text-slate-500">{t("dashboard.noModules")}</p>
          )}
        </article>
      </section>
    </div>
  );
}
