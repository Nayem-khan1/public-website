"use client";

import { useEffect, useMemo, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import type { Course } from "@/data/types";
import {
  getCourseCards,
  getLocalizedCourseCategoryText,
  type PublicCourseCategoryRecord,
} from "@/lib/public-api";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";

type PriceFilterValue = "all" | "free" | "paid";

export default function CoursesPageClient({
  initialCourses,
  initialCategories,
}: {
  initialCourses: Course[];
  initialCategories: PublicCourseCategoryRecord[];
}) {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilterValue>("all");
  const isDefaultFilter = categoryFilter === "all" && priceFilter === "all";

  const priceOptions = [
    { value: "all" as const, label: t("common.all") },
    { value: "free" as const, label: t("common.free") },
    { value: "paid" as const, label: t("common.paid") },
  ];

  const categoryOptions = useMemo(() => {
    const base = [{ id: "all", label: t("common.all") }];
    const dynamic = initialCategories.map((category) => ({
      id: category.id,
      label: getLocalizedCourseCategoryText(category, locale).title,
    }));

    return [...base, ...dynamic];
  }, [initialCategories, locale, t]);

  useEffect(() => {
    if (isDefaultFilter) {
      return;
    }

    let cancelled = false;

    void (async () => {
      setIsLoading(true);

      const data = await getCourseCards(undefined, {
        lang: locale,
        categoryId: categoryFilter === "all" ? undefined : categoryFilter,
        priceType: priceFilter === "all" ? undefined : priceFilter,
      });

      if (!cancelled) {
        setCourses(data);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [categoryFilter, isDefaultFilter, locale, priceFilter]);

  const displayedCourses = isDefaultFilter ? initialCourses : courses;

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title={t("coursesPage.title")}
        subtitle={t("coursesPage.subtitle")}
        bgImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
      />

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="mb-12 flex flex-col gap-6">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <div className="flex w-full flex-col items-center gap-2 lg:w-auto lg:items-start">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {t("coursesPage.filterByCategory")}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {categoryOptions.map((category) => (
                  <Button
                    key={category.id}
                    variant={categoryFilter === category.id ? "default" : "outline"}
                    onClick={() => setCategoryFilter(category.id)}
                    className={`h-9 rounded-full px-5 text-sm ${
                      categoryFilter === category.id
                        ? "border-primary bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col items-center gap-2 lg:w-auto lg:items-start">
              <span className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                {t("coursesPage.filterByPrice")}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {priceOptions.map((price) => (
                  <Button
                    key={price.value}
                    variant={priceFilter === price.value ? "default" : "outline"}
                    onClick={() => setPriceFilter(price.value)}
                    className={`h-9 rounded-full px-5 text-sm ${
                      priceFilter === price.value
                        ? "border-secondary bg-secondary text-white shadow-lg shadow-secondary/25 hover:bg-secondary/90"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {price.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-lg text-slate-500">{t("coursesPage.loadingCourses")}</p>
            </div>
          ) : displayedCourses.length > 0 ? (
            displayedCourses.map((course) => <CourseCard key={course.id} course={course} />)
          ) : (
            <div className="col-span-full py-16 text-center">
              <p className="text-lg text-slate-500">{t("coursesPage.noCoursesFound")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
