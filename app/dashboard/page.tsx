"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, Trophy, TrendingUp, Play, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  completeNextLesson,
  getStudentAccessToken,
  getStudentDashboard,
  type StudentDashboardData,
} from "@/lib/student-api";
import { useLocale, useTranslations } from "next-intl";
import { normalizeLocale, formatNumber } from "@/lib/i18n";

export default function DashboardPage() {
  const t = useTranslations("common");
  const locale = normalizeLocale(useLocale());
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingCourseId, setActionLoadingCourseId] = useState<string | null>(null);

  async function loadDashboard() {
    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.error_login"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const dashboard = await getStudentDashboard(token);
      setData(dashboard);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.error_login"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadDashboard();
  }, []);

  async function handleCompleteNextLesson(courseId: string) {
    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.error_continue"));
      return;
    }

    setActionLoadingCourseId(courseId);
    setError(null);

    try {
      await completeNextLesson(courseId, token);
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.error_continue"));
    } finally {
      setActionLoadingCourseId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-white">
        <h2 className="text-2xl font-display font-bold mb-2">
          {loading
            ? t("dashboard.welcome_loading")
            : t("dashboard.welcome_back", { name: data?.student.name || "Student" })}
        </h2>
        <p className="text-white/80">{t("dashboard.welcome_subtitle")}</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: BookOpen,
            label: t("dashboard.stats_enrolled"),
            value: data?.stats.enrolled_courses ?? 0,
            color: "text-primary bg-primary/10",
          },
          {
            icon: Clock,
            label: t("dashboard.stats_completed"),
            value: data?.stats.total_lessons_completed ?? 0,
            color: "text-secondary bg-secondary/10",
          },
          {
            icon: Trophy,
            label: t("dashboard.stats_certificates"),
            value: data?.stats.issued_certificates ?? 0,
            color: "text-amber-500 bg-amber-50",
          },
          {
            icon: TrendingUp,
            label: t("dashboard.stats_completion"),
            value: `${Math.round(data?.stats.completion_rate ?? 0)}%`,
            color: "text-emerald-500 bg-emerald-50",
          },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{loading ? "-" : stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-bold text-slate-900">{t("dashboard.continue_learning")}</h3>
            <Link href="/dashboard/courses" className="text-sm text-primary font-semibold hover:underline">
              {t("dashboard.view_all")}
            </Link>
          </div>

          {!loading && (data?.enrolled_courses.length ?? 0) === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-slate-500">
              {t("dashboard.no_enrollments")}
            </div>
          ) : null}

          {(data?.enrolled_courses ?? []).map((course) => (
            <div
              key={course.enrollment_id}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4"
            >
              <img
                src={course.thumbnail || "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800"}
                alt={course.title}
                className="w-full sm:w-32 h-24 rounded-xl object-cover"
              />
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 mb-1 line-clamp-1">{course.title}</h4>
                <p className="text-sm text-slate-500 mb-3">
                  {t("courses.lessons", { count: formatNumber(course.total_lessons, locale) })} •{" "}
                  {course.duration || t("courses.self_paced")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all"
                      style={{ width: `${course.progress_percent}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    {course.progress_percent}%
                  </span>
                </div>
              </div>
              <Button
                size="sm"
                disabled={actionLoadingCourseId === course.course_id || course.remaining_lessons === 0}
                onClick={() => void handleCompleteNextLesson(course.course_id)}
                className="bg-primary hover:bg-primary/90 text-white rounded-full self-center shrink-0"
              >
                <Play className="w-4 h-4 mr-1" />
                {actionLoadingCourseId === course.course_id
                  ? t("actions.updating")
                  : course.remaining_lessons === 0
                    ? t("actions.completed")
                    : t("actions.complete_next")}
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold text-slate-900">{t("dashboard.upcoming_lessons")}</h3>
          {(data?.upcoming_lessons ?? []).length === 0 ? (
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-sm text-slate-500">
              {t("dashboard.no_upcoming")}
            </div>
          ) : null}
          {(data?.upcoming_lessons ?? []).map((lesson) => (
            <div key={lesson.lesson_id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-2">
                <Calendar className="w-3.5 h-3.5" />
                {t("labels.lesson_order", { order: lesson.order_no })}
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">{lesson.lesson_title}</h4>
              <p className="text-xs text-slate-500">{lesson.course_title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
