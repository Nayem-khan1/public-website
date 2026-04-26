"use client";

import { useCallback, useDeferredValue, useEffect, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CourseProgressCard } from "@/components/dashboard/course-progress-card";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  filterAndSortStudentCourses,
  getCourseActivityCounts,
  type StudentCourseFilter,
  type StudentCourseSort,
} from "@/lib/student-dashboard";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<StudentCourseFilter>("all");
  const [sort, setSort] = useState<StudentCourseSort>("recent");
  const deferredSearchTerm = useDeferredValue(searchTerm);

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

  const counts = getCourseActivityCounts(courses);
  const visibleCourses = filterAndSortStudentCourses(courses, {
    searchTerm: deferredSearchTerm,
    filter,
    sort,
  });
  const filterOptions: Array<{ value: StudentCourseFilter; label: string; count: number }> = [
    { value: "all", label: t("dashboard.filterAll"), count: courses.length },
    { value: "active", label: t("dashboard.filterActive"), count: counts.active },
    { value: "completed", label: t("dashboard.filterCompleted"), count: counts.completed },
    { value: "locked", label: t("dashboard.filterLocked"), count: counts.locked },
  ];
  const sortOptions: Array<{ value: StudentCourseSort; label: string }> = [
    { value: "recent", label: t("dashboard.sortRecent") },
    { value: "progress", label: t("dashboard.sortProgress") },
    { value: "title", label: t("dashboard.sortTitle") },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-6 rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)] md:px-8 md:py-8 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">{t("dashboard.myCourses")}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-950">{t("dashboard.myCoursesTitle")}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{t("dashboard.myCoursesSubtitle")}</p>
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

      <section className="rounded-[1.85rem] border border-slate-200 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)] md:p-6">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t("dashboard.searchCoursesPlaceholder")}
              className="h-12 rounded-full border-slate-200 pl-11 pr-4"
            />
          </label>
          <div className="flex items-center gap-3 rounded-full border border-slate-200 px-4">
            <SlidersHorizontal className="h-4 w-4 text-slate-400" />
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as StudentCourseSort)}
              className="h-12 flex-1 bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {filterOptions.map((option) => {
            const active = filter === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  active
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-300/30"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                {option.label} <span className="ml-1 opacity-70">{option.count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {loading ? (
        <div className="rounded-[1.8rem] border border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-500 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
          {t("dashboard.loadingEnrolledCourses")}
        </div>
      ) : visibleCourses.length === 0 ? (
        <div className="rounded-[1.8rem] border border-dashed border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-500 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
          {courses.length === 0 ? t("dashboard.noEnrolledCoursesYet") : t("dashboard.noMatchingCourses")}
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {visibleCourses.map((course) => (
            <CourseProgressCard
              key={course.enrollment_id}
              course={course}
              locale={locale}
            />
          ))}
        </div>
      )}
    </div>
  );
}
