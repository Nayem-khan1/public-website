"use client";

import { useEffect, useMemo, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import type { Course } from "@/data/types";
import {
  getCourseCards,
  listPublicCourseCategories,
  type PublicCourseCategoryRecord,
} from "@/lib/public-api";
import { useLocale, useTranslations } from "next-intl";
import { normalizeLocale, pickLocalizedText } from "@/lib/i18n";

export default function CoursesPage() {
  const t = useTranslations("common");
  const locale = normalizeLocale(useLocale());

  const priceOptions = [
    { value: "all", label: t("labels.all") },
    { value: "free", label: t("labels.free") },
    { value: "paid", label: t("labels.paid") },
  ] as const;

  type PriceFilterValue = (typeof priceOptions)[number]["value"];

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<PublicCourseCategoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilterValue>("all");

  const categoryOptions = useMemo(() => {
    const base = [{ id: "all", label: t("labels.all") }];
    const dynamic = categories.map((category) => ({
      id: category.id,
      label:
        pickLocalizedText({
          locale,
          primary: category.title,
          en: category.title_en,
          bn: category.title_bn,
        }) ||
        category.slug ||
        category.id,
    }));

    return [...base, ...dynamic];
  }, [categories, locale, t]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const data = await listPublicCourseCategories(locale);
      if (!cancelled) {
        setCategories(data);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
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
  }, [categoryFilter, priceFilter, locale]);

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title={t("courses.page_title")}
        subtitle={t("courses.page_subtitle")}
        bgImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=2000"
      />

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="flex flex-col gap-6 mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center lg:items-start gap-2 w-full lg:w-auto">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {t("labels.filter_by_category")}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {categoryOptions.map((category) => (
                  <Button
                    key={category.id}
                    variant={categoryFilter === category.id ? "default" : "outline"}
                    onClick={() => setCategoryFilter(category.id)}
                    className={`rounded-full px-5 h-9 text-sm ${
                      categoryFilter === category.id
                        ? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 border-primary text-white"
                        : "hover:bg-slate-100 bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-2 w-full lg:w-auto">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                {t("labels.filter_by_price")}
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {priceOptions.map((price) => (
                  <Button
                    key={price.value}
                    variant={priceFilter === price.value ? "default" : "outline"}
                    onClick={() => setPriceFilter(price.value)}
                    className={`rounded-full px-5 h-9 text-sm ${
                      priceFilter === price.value
                        ? "bg-secondary hover:bg-secondary/90 shadow-lg shadow-secondary/25 border-secondary text-white"
                        : "hover:bg-slate-100 bg-white text-slate-600 border-slate-200"
                    }`}
                  >
                    {price.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full text-center py-16">
              <p className="text-slate-500 text-lg">{t("labels.loading_courses")}</p>
            </div>
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-slate-500 text-lg">
                {t("labels.no_courses")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
