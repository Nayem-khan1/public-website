"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CourseProgressCard } from "@/components/dashboard/course-progress-card";
import { ProgressBar } from "@/components/dashboard/progress-bar";
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
  const overallProgress = Math.round(data?.stats.completion_rate ?? 0);

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-8 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.2)] md:px-8">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          {t("dashboard.dashboardLabel")}
        </p>
        <h2 className="mt-2 text-3xl font-bold text-slate-950 md:text-4xl">
          {loading
            ? t("dashboard.loadingDashboard")
            : t("dashboard.welcomeBack", {
                name: data?.student.name || t("common.student"),
              })}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
          {t("dashboard.dashboardHeroSubtitle")}
        </p>

        <div className="mt-6 max-w-md rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
          <ProgressBar
            value={overallProgress}
            label={t("dashboard.progress")}
            valueLabel={`${overallProgress}%`}
          />
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-[1.85rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              {t("dashboard.continueLearning")}
            </p>
            <h3 className="mt-2 text-2xl font-bold text-slate-950">
              {t("dashboard.learningQueue")}
            </h3>
          </div>

          <Button asChild variant="outline" className="rounded-full border-slate-200">
            <Link href="/dashboard/courses">{t("dashboard.myCourses")}</Link>
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
          <div className="grid gap-5 xl:grid-cols-3">
            {continueCourses.map((course) => (
              <CourseProgressCard key={course.enrollment_id} course={course} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
