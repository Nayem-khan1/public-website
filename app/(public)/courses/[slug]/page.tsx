import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Clock,
  Globe,
  Lock,
  PlayCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CourseEnrollButton } from "@/components/course-enroll-button";
import { getCourseLanguageLabel, getCourseLevelLabel } from "@/lib/i18n/course";
import { formatCurrency } from "@/lib/i18n/format";
import {
  getLocalizedCourseText,
  getPublicCourseBySlug,
} from "@/lib/public-api";
import {
  getLocaleAndTranslations,
  getLocalizedMetadataLocale,
  getRequestLocale,
} from "@/lib/i18n/server";
import {
  buildMetadataAlternates,
  getLocalizedAbsoluteUrl,
} from "@/lib/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { slug } = await params;
  const course = await getPublicCourseBySlug(slug, locale);
  const { t } = await getLocaleAndTranslations(locale);

  if (!course) {
    return {
      title: t("courseCard.untitled"),
      alternates: buildMetadataAlternates(`/courses/${slug}`, locale),
    };
  }

  const localized = getLocalizedCourseText(course, locale);
  const title = localized.title || t("courseCard.untitled");
  const description = localized.subtitle || localized.description;

  return {
    title,
    description,
    alternates: buildMetadataAlternates(`/courses/${slug}`, locale),
    openGraph: {
      title,
      description,
      locale: getLocalizedMetadataLocale(locale),
      url: getLocalizedAbsoluteUrl(`/courses/${slug}`, locale),
      images: course.thumbnail ? [{ url: course.thumbnail }] : undefined,
    },
  };
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getRequestLocale();
  const { t } = await getLocaleAndTranslations(locale);
  const { slug } = await params;
  const course = await getPublicCourseBySlug(slug, locale);

  if (!course) {
    notFound();
  }

  const localized = getLocalizedCourseText(course, locale);
  const title = localized.title || t("courseCard.untitled");
  const subtitle = localized.subtitle;
  const description = localized.description;
  const thumbnail =
    course.thumbnail ||
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200";

  const hasDiscount =
    typeof course.discount_price === "number" &&
    typeof course.price === "number" &&
    course.discount_price > 0 &&
    course.discount_price < course.price;
  const displayPrice = hasDiscount ? course.discount_price ?? 0 : course.price ?? 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-20">
      <div className="relative overflow-hidden bg-slate-900 pb-16 pt-28 md:pb-24 md:pt-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-90" />
        <div className="container relative mx-auto px-4 md:px-6">
          <Link
            href="/courses"
            className="mb-8 inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("courseDetails.backToCourses")}
          </Link>

          <div className="mb-5 flex flex-wrap items-center gap-3">
            <Badge className="border-white/20 bg-white/10 text-white">
              {localized.categoryTitle || t("common.astronomy")}
            </Badge>
            <Badge className="border-primary/30 bg-primary/20 text-white">
              {getCourseLevelLabel(course.level, t)}
            </Badge>
          </div>

          <h1 className="text-3xl font-bold leading-tight text-white md:text-5xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-4 max-w-3xl text-lg text-slate-300">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="container relative z-10 mx-auto -mt-8 px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
              <h2 className="mb-4 text-2xl font-bold text-slate-900">
                {t("courseDetails.aboutCourse")}
              </h2>
              <p className="whitespace-pre-line leading-relaxed text-slate-600">
                {description}
              </p>
            </div>

            {localized.learningObjectives.length > 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <h3 className="mb-6 text-2xl font-bold text-slate-900">
                  {t("courseDetails.whatYouWillLearn")}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {localized.learningObjectives.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                      <span className="text-sm font-medium text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {localized.requirements.length > 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <h3 className="mb-6 text-2xl font-bold text-slate-900">
                  {t("courseDetails.courseRequirements")}
                </h3>
                <ul className="space-y-3">
                  {localized.requirements.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      className="flex items-center gap-3 text-slate-700"
                    >
                      <Lock className="h-4 w-4 text-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {localized.targetedAudience.length > 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <h3 className="mb-6 text-2xl font-bold text-slate-900">
                  {t("courseDetails.whoIsThisFor")}
                </h3>
                <ul className="space-y-3">
                  {localized.targetedAudience.map((item, index) => (
                    <li key={`${item}-${index}`} className="text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {localized.faqs.length > 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                <h3 className="mb-6 text-xl font-bold text-slate-900">
                  {t("courseDetails.frequentlyAskedQuestions")}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {localized.faqs.map((faq, index) => (
                    <AccordionItem
                      key={`${faq.question}-${index}`}
                      value={`faq-${index}`}
                      className="last:border-0 border-slate-100"
                    >
                      <AccordionTrigger className="py-4 text-left font-semibold text-slate-900 hover:text-primary hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 leading-relaxed text-slate-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50">
              <div className="group relative mb-6 aspect-video overflow-hidden rounded-xl">
                <img
                  src={thumbnail}
                  alt={title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                    <PlayCircle className="h-8 w-8 fill-white/20 text-white" />
                  </div>
                </div>
              </div>

              <div className="mb-6 flex items-end gap-3">
                <span className="text-4xl font-bold tracking-tight text-slate-900">
                  {course.is_free ? t("common.free") : formatCurrency(displayPrice, locale)}
                </span>
                {!course.is_free && hasDiscount ? (
                  <span className="mb-1 text-lg text-slate-400 line-through">
                    {formatCurrency(course.price ?? 0, locale)}
                  </span>
                ) : null}
              </div>

              <CourseEnrollButton courseId={course.id} courseSlug={course.slug} />

              <div className="mt-6 space-y-4 border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold uppercase tracking-wide text-slate-900">
                  {t("courseDetails.thisCourseIncludes")}
                </h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                    <span>
                      {course.total_lessons ?? 0} {t("common.lessons")}
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="h-4 w-4 shrink-0 text-primary" />
                    <span>{course.duration || t("common.selfPaced")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Globe className="h-4 w-4 shrink-0 text-primary" />
                    <span>{getCourseLanguageLabel(course.language, t)}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
