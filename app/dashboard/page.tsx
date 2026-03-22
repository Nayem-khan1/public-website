"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Trophy,
  TrendingUp,
  Play,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  completeNextLesson,
  getStudentAccessToken,
  getStudentDashboard,
  type StudentDashboardData,
} from "@/lib/student-api";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";

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
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.loadDashboardFailed"));
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
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.completeLessonFailed"));
    } finally {
      setActionLoadingCourseId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-8 text-white">
        <h2 className="mb-2 text-2xl font-bold">
          {loading
            ? t("dashboard.loadingDashboard")
            : t("dashboard.welcomeBack", {
                name: data?.student.name || t("common.student"),
              })}
        </h2>
        <p className="text-white/80">{t("dashboard.keepExploring")}</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            icon: BookOpen,
            label: t("dashboard.enrolledCourses"),
            value: data?.stats.enrolled_courses ?? 0,
            color: "text-primary bg-primary/10",
          },
          {
            icon: Clock,
            label: t("dashboard.lessonsCompleted"),
            value: data?.stats.total_lessons_completed ?? 0,
            color: "text-secondary bg-secondary/10",
          },
          {
            icon: Trophy,
            label: t("dashboard.certificates"),
            value: data?.stats.issued_certificates ?? 0,
            color: "text-amber-500 bg-amber-50",
          },
          {
            icon: TrendingUp,
            label: t("dashboard.completionRate"),
            value: `${Math.round(data?.stats.completion_rate ?? 0)}%`,
            color: "text-emerald-500 bg-emerald-50",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
          >
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{loading ? "-" : stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">{t("dashboard.continueLearning")}</h3>
            <Link href="/dashboard/courses" className="text-sm font-semibold text-primary hover:underline">
              {t("common.viewAll")}
            </Link>
          </div>

          {!loading && (data?.enrolled_courses.length ?? 0) === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-6 text-slate-500 shadow-sm">
              {t("dashboard.noEnrolledCourses")}
            </div>
          ) : null}

          {(data?.enrolled_courses ?? []).map((course) => (
            <div
              key={course.enrollment_id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:flex-row"
            >
              <img
                src={course.thumbnail || "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800"}
                alt={course.title}
                className="h-24 w-full rounded-xl object-cover sm:w-32"
              />
              <div className="flex-1">
                <h4 className="mb-1 line-clamp-1 font-bold text-slate-900">{course.title}</h4>
                <p className="mb-3 text-sm text-slate-500">
                  {course.total_lessons} {t("common.lessons")} | {course.duration || t("common.selfPaced")}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
                      style={{ width: `${course.progress_percent}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{course.progress_percent}%</span>
                </div>
              </div>
              <Button
                size="sm"
                disabled={actionLoadingCourseId === course.course_id || course.remaining_lessons === 0}
                onClick={() => void handleCompleteNextLesson(course.course_id)}
                className="self-center rounded-full bg-primary text-white hover:bg-primary/90"
              >
                <Play className="mr-1 h-4 w-4" />
                {actionLoadingCourseId === course.course_id
                  ? t("dashboard.updating")
                  : course.remaining_lessons === 0
                    ? t("dashboard.completed")
                    : t("dashboard.completeNext")}
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900">{t("dashboard.upcomingLessons")}</h3>
          {(data?.upcoming_lessons ?? []).length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-5 text-sm text-slate-500 shadow-sm">
              {t("dashboard.noUpcomingLessons")}
            </div>
          ) : null}
          {(data?.upcoming_lessons ?? []).map((lesson) => (
            <div key={lesson.lesson_id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-primary">
                <Calendar className="h-3.5 w-3.5" />
                {t("dashboard.lessonNumber", { number: lesson.order_no })}
              </div>
              <h4 className="mb-1 text-sm font-bold text-slate-900">{lesson.lesson_title}</h4>
              <p className="text-xs text-slate-500">{lesson.course_title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
