"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  completeNextLesson,
  getStudentAccessToken,
  getStudentCourses,
  type StudentCourse,
} from "@/lib/student-api";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";

export default function MyCoursesPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoadingCourseId, setActionLoadingCourseId] = useState<string | null>(null);

  const loadCourses = useCallback(async () => {
    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.coursesAuthRequired"));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getStudentCourses(token, locale);
      setCourses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.loadCoursesFailed"));
    } finally {
      setLoading(false);
    }
  }, [locale, t]);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

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
      await loadCourses();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("dashboard.updateCourseProgressFailed"),
      );
    } finally {
      setActionLoadingCourseId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{t("dashboard.myCoursesTitle")}</h2>
        <Button asChild className="rounded-full bg-primary text-white hover:bg-primary/90">
          <Link href="/courses">{t("dashboard.browseMoreCourses")}</Link>
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
          {t("dashboard.loadingEnrolledCourses")}
        </div>
      ) : null}

      {!loading && courses.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-500">
          {t("dashboard.noEnrolledCoursesYet")}
        </div>
      ) : null}

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <div
            key={course.enrollment_id}
            className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={course.thumbnail || "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=800"}
                alt={course.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="line-clamp-1 text-lg font-bold text-white">{course.title}</h3>
              </div>
            </div>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {course.total_lessons} {t("common.lessons")}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {course.duration || t("common.selfPaced")}
                </span>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">{t("dashboard.progress")}</span>
                  <span className="text-sm font-bold text-primary">{course.progress_percent}%</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${course.progress_percent}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-400">
                  {t("dashboard.lessonsRemaining", { count: course.remaining_lessons })}
                </span>
                <Button
                  size="sm"
                  disabled={
                    actionLoadingCourseId === course.course_id || course.remaining_lessons === 0
                  }
                  onClick={() => void handleCompleteNextLesson(course.course_id)}
                  className="rounded-full bg-primary text-white hover:bg-primary/90"
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  {actionLoadingCourseId === course.course_id
                    ? t("dashboard.updating")
                    : course.remaining_lessons === 0
                      ? t("dashboard.completed")
                      : t("dashboard.completeNext")}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
