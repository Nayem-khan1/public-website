"use client";

import { useEffect, useState } from "react";
import { BarChart3, BookOpen, Flame, Sparkles } from "lucide-react";
import Link from "next/link";
import { ActivityTracker } from "@/components/dashboard/activity-tracker";
import { Button } from "@/components/ui/button";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  formatRelativeDate,
  getActivityTotals,
} from "@/lib/student-dashboard";
import {
  getStudentAccessToken,
  getStudentCourses,
  getStudentDashboard,
  type StudentCourse,
  type StudentDashboardData,
} from "@/lib/student-api";

export default function LearningReportPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const [dashboard, setDashboard] = useState<StudentDashboardData | null>(null);
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      const token = getStudentAccessToken();
      if (!token) {
        if (!cancelled) {
          setError(t("dashboard.dashboardAuthRequired"));
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const [dashboardData, courseData] = await Promise.all([
          getStudentDashboard(token, locale),
          getStudentCourses(token, locale),
        ]);

        if (!cancelled) {
          setDashboard(dashboardData);
          setCourses(courseData);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : t("dashboard.loadDashboardFailed"),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadReport();

    return () => {
      cancelled = true;
    };
  }, [locale, t]);

  const activityTotals = getActivityTotals(dashboard?.activity_last_7_days ?? []);
  const averageProgress = courses.length
    ? Math.round(
        courses.reduce((sum, course) => sum + course.progress_percent, 0) / courses.length,
      )
    : 0;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)] md:px-8 md:py-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
              {t("dashboard.learningReport")}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              {t("dashboard.learningReportTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              {t("dashboard.learningReportSubtitle")}
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-slate-200">
            <Link href="/dashboard/courses">{t("dashboard.viewRoadmap")}</Link>
          </Button>
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
            title: t("dashboard.completionRate"),
            value: loading ? "-" : `${Math.round(dashboard?.stats.completion_rate ?? 0)}%`,
            icon: Sparkles,
          },
          {
            title: t("dashboard.averageProgress"),
            value: loading ? "-" : `${averageProgress}%`,
            icon: BarChart3,
          },
          {
            title: t("dashboard.currentStreak"),
            value: loading ? "-" : dashboard?.stats.current_streak ?? 0,
            icon: Flame,
          },
          {
            title: t("dashboard.activeDays"),
            value: loading ? "-" : activityTotals.activeDays,
            icon: BookOpen,
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]"
          >
            <div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-3 text-slate-900">
              <item.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-slate-500">{item.title}</p>
            <p className="mt-2 text-3xl font-bold text-slate-950">{item.value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <ActivityTracker days={dashboard?.activity_last_7_days ?? []} />

        <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-900">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                {t("dashboard.progress")}
              </p>
              <h3 className="text-xl font-bold text-slate-950">
                {t("dashboard.progressByCourse")}
              </h3>
            </div>
          </div>

          {loading ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
              {t("dashboard.loadingEnrolledCourses")}
            </div>
          ) : courses.length === 0 ? (
            <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
              {t("dashboard.noReportCourses")}
            </div>
          ) : (
            <div className="space-y-4">
              {courses.map((course) => (
                <article
                  key={course.enrollment_id}
                  className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-950">
                        {course.title}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatRelativeDate(course.last_activity_at, locale)}
                      </p>
                    </div>
                    <Button asChild variant="outline" className="rounded-full border-slate-200">
                      <Link href={`/dashboard/courses/${course.slug}`}>
                        {t("dashboard.continueAction")}
                      </Link>
                    </Button>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-slate-600">
                        {t("dashboard.progress")}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {course.progress_percent}%
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,#f1024c_0%,#514a89_100%)]"
                        style={{ width: `${course.progress_percent}%` }}
                      />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>
                        {course.completed_lessons_count}/{course.total_lessons}{" "}
                        {t("dashboard.lessonsDone")}
                      </span>
                      <span>
                        {t("dashboard.lessonsRemaining", {
                          count: course.remaining_lessons,
                        })}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
