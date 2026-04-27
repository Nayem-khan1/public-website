"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CourseProgressCard } from "@/components/dashboard/course-progress-card";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  getStudentAccessToken,
  getStudentCourses,
  type StudentCourse,
} from "@/lib/student-api";

export default function MyCoursesPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : t("dashboard.loadCoursesFailed"));
    } finally {
      setLoading(false);
    }
  }, [locale, t]);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)] md:px-8 md:py-8 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
            {t("dashboard.myCourses")}
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">
            {t("dashboard.myCoursesTitle")}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
            {t("dashboard.myCoursesSubtitle")}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline" className="rounded-full border-slate-200">
            <Link href="/courses">{t("dashboard.browseMoreCourses")}</Link>
          </Button>
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[1.8rem] border border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-500 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
          {t("dashboard.loadingEnrolledCourses")}
        </div>
      ) : courses.length === 0 ? (
        <div className="rounded-[1.8rem] border border-dashed border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-500 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.12)]">
          {t("dashboard.noEnrolledCoursesYet")}
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <CourseProgressCard key={course.enrollment_id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
