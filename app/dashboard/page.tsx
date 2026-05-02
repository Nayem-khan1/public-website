"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, CheckCircle, PlayCircle, Award } from "lucide-react";
import { CourseProgressCard } from "@/components/dashboard/course-progress-card";
import { ProgressBar } from "@/components/dashboard/progress-bar";
import { ActivityTracker } from "@/components/dashboard/activity-tracker";
import { Button } from "@/components/ui/button";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  getStudentAccessToken,
  getStudentDashboard,
  getStudentOrders,
  type StudentDashboardData,
  type StudentOrder,
} from "@/lib/student-api";
import { formatNumber } from "@/lib/i18n/format";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [orders, setOrders] = useState<StudentOrder[]>([]);
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
      const [dashboard, ordersData] = await Promise.all([
        getStudentDashboard(token, locale),
        getStudentOrders(token),
      ]);
      setData(dashboard);
      setOrders(ordersData.slice(0, 3));
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
    <div className="flex flex-col gap-6 xl:flex-row">
      <div className="flex-1 space-y-8 min-w-0">
        <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white px-8 py-10 shadow-sm">
          {/* Background Glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />
          <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-indigo-500/5 blur-[80px]" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-primary/60">
              {t("dashboard.dashboardLabel")}
            </p>
            <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
              {loading
                ? t("dashboard.loadingDashboard")
                : t("dashboard.welcomeBack", {
                    name: data?.student.name || t("common.student"),
                  })}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
              {t("dashboard.dashboardHeroSubtitle")}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col justify-center rounded-3xl border border-slate-200 bg-slate-50/50 p-6">
                <ProgressBar
                  value={overallProgress}
                  label={t("dashboard.progress")}
                  valueLabel={`${formatNumber(overallProgress, locale)}%`}
                  className="w-full"
                />
              </div>
              <div className="hidden sm:flex items-center justify-center p-6 bg-slate-50/30 rounded-3xl border border-dashed border-slate-200">
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{t("dashboard.currentStreak")}</p>
                  <p className="mt-1 text-3xl font-black text-slate-950">{formatNumber(data?.stats.current_streak ?? 0, locale)} 🔥</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {!loading && data ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group relative overflow-hidden rounded-[1.8rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-blue-500/10 blur-2xl group-hover:bg-blue-500/20" />
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500 text-white shadow-lg shadow-blue-200">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900/60 uppercase tracking-wider">{t("dashboard.enrolledCourses")}</p>
                  <p className="text-3xl font-bold text-blue-950">
                    {formatNumber(data.stats.enrolled_courses, locale)}
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.8rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-emerald-500/10 blur-2xl group-hover:bg-emerald-500/20" />
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-200">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-emerald-900/60 uppercase tracking-wider">{t("dashboard.completedCourses")}</p>
                  <p className="text-3xl font-bold text-emerald-950">
                    {formatNumber(data.stats.completed_courses, locale)}
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.8rem] border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20" />
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-200">
                  <PlayCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-amber-900/60 uppercase tracking-wider">{t("dashboard.lessonsCompleted")}</p>
                  <p className="text-3xl font-bold text-amber-950">
                    {formatNumber(data.stats.total_lessons_completed, locale)}
                  </p>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-[1.8rem] border border-fuchsia-100 bg-gradient-to-br from-fuchsia-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-fuchsia-500/10 blur-2xl group-hover:bg-fuchsia-500/20" />
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-200">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-fuchsia-900/60 uppercase tracking-wider">{t("dashboard.certificates")}</p>
                  <p className="text-3xl font-bold text-fuchsia-950">
                    {formatNumber(data.stats.issued_certificates, locale)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="rounded-[1.85rem] border border-slate-200 bg-white p-6 shadow-sm">
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
          <div className="grid gap-5 xl:grid-cols-2">
            {continueCourses.map((course) => (
              <CourseProgressCard key={course.enrollment_id} course={course} />
            ))}
          </div>
        )}
        </section>
      </div>

      <div className="w-full shrink-0 space-y-6 xl:w-[400px]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-1 overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 p-6 rounded-[1.75rem]">
            <h3 className="text-lg font-bold text-slate-950 mb-1">{t("dashboard.learningInsights")}</h3>
            <p className="text-sm text-slate-500 mb-6">{t("dashboard.learningInsightsSubtitle")}</p>
            {!loading && data?.activity_last_7_days ? (
              <ActivityTracker days={data.activity_last_7_days} className="border-0 shadow-none p-0 bg-transparent" />
            ) : (
              <div className="h-40 flex items-center justify-center border border-dashed border-slate-200 rounded-2xl text-slate-400 text-sm">
                {t("dashboard.loadingInsights")}
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-1 overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 p-6 rounded-[1.75rem]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-950 mb-1">{t("dashboard.paymentOverview")}</h3>
                <p className="text-sm text-slate-500">{t("dashboard.recentTransactions")}</p>
              </div>
              <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-bold">
                <Link href="/dashboard/orders">{t("common.viewAll")}</Link>
              </Button>
            </div>

            <div className="space-y-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-16 w-full animate-pulse rounded-2xl bg-slate-100" />
                ))
              ) : orders.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  {t("dashboard.noRecentTransactions")}
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-2xl bg-white p-3 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold",
                        order.status === "verified" ? "bg-emerald-100 text-emerald-600" :
                        order.status === "failed" ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                      )}>
                        {order.gateway?.charAt(0) || "P"}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-950">{order.course_name}</p>
                        <p className="text-[10px] font-medium text-slate-500">{new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", { dateStyle: "medium" }).format(new Date(order.submitted_at))}</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-slate-950">
                      {new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(order.amount)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
