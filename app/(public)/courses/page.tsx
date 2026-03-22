import type { Metadata } from "next";
import CoursesPageClient from "./courses-page-client";
import { getCourseCards, listPublicCourseCategories } from "@/lib/public-api";
import {
  getLocaleAndTranslations,
  getLocalizedMetadataLocale,
  getRequestLocale,
} from "@/lib/i18n/server";
import {
  buildMetadataAlternates,
  getLocalizedAbsoluteUrl,
} from "@/lib/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getLocaleAndTranslations();

  return {
    title: t("coursesPage.title"),
    description: t("coursesPage.subtitle"),
    alternates: buildMetadataAlternates("/courses", locale),
    openGraph: {
      title: t("coursesPage.title"),
      description: t("coursesPage.subtitle"),
      locale: getLocalizedMetadataLocale(locale),
      url: getLocalizedAbsoluteUrl("/courses", locale),
    },
  };
}

export default async function CoursesPage() {
  const locale = await getRequestLocale();
  const [initialCourses, initialCategories] = await Promise.all([
    getCourseCards(undefined, { lang: locale }),
    listPublicCourseCategories(locale),
  ]);

  return (
    <CoursesPageClient
      key={locale}
      initialCourses={initialCourses}
      initialCategories={initialCategories}
    />
  );
}
