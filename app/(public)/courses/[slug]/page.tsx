import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Globe, PlayCircle, CheckCircle, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPublicCourseBySlug } from "@/lib/public-api";
import { CourseEnrollButton } from "@/components/course-enroll-button";
import { formatCurrency, formatNumber, localizeLanguage, localizeLevel, pickLocalizedText } from "@/lib/i18n";
import { getServerLocale, getServerTranslator } from "@/lib/i18n-server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = getServerLocale();
  const course = await getPublicCourseBySlug(slug, locale);
  if (!course) {
    return {};
  }

  const title = pickLocalizedText({
    locale,
    primary: course.title,
    en: course.title_en,
    bn: course.title_bn,
    fallback: "Untitled Course",
  });
  const description = pickLocalizedText({
    locale,
    primary: course.description,
    en: course.description_en,
    bn: course.description_bn,
    fallback: "",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = getServerLocale();
  const t = getServerTranslator(locale);
  const course = await getPublicCourseBySlug(slug, locale);

  if (!course) {
    notFound();
  }

  const title = pickLocalizedText({
    locale,
    primary: course.title,
    en: course.title_en,
    bn: course.title_bn,
    fallback: "Untitled Course",
  });
  const subtitle = pickLocalizedText({
    locale,
    primary: course.subtitle,
    en: course.subtitle_en,
    bn: course.subtitle_bn,
    fallback: "",
  });
  const description = pickLocalizedText({
    locale,
    primary: course.description,
    en: course.description_en,
    bn: course.description_bn,
    fallback: "",
  });
  const thumbnail =
    course.thumbnail ||
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200";

  const requirements =
    (locale === "bn" ? course.requirements_bn : course.requirements_en) ??
    course.requirements ??
    [];
  const learningObjectives =
    (locale === "bn" ? course.learning_objectives_bn : course.learning_objectives_en) ??
    course.learning_objectives ??
    [];
  const targetedAudience =
    (locale === "bn" ? course.targeted_audience_bn : course.targeted_audience_en) ??
    course.targeted_audience ??
    [];
  const faqs = course.faqs ?? [];
  const categoryLabel =
    pickLocalizedText({
      locale,
      primary: course.category_title,
      en: course.category_title_en,
      bn: course.category_title_bn,
    }) ||
    course.category_id ||
    (locale === "bn" ? "জ্যোতির্বিজ্ঞান" : "Astronomy");

  const hasDiscount =
    typeof course.discount_price === "number" &&
    typeof course.price === "number" &&
    course.discount_price > 0 &&
    course.discount_price < course.price;
  const displayPrice = hasDiscount ? course.discount_price ?? 0 : course.price ?? 0;
  const localeNumber = (value: number) => formatNumber(value, locale);
  const currencyLabel = (value: number) => formatCurrency(value, locale);

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-20">
      <div className="bg-slate-900 pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black opacity-90" />
        <div className="container relative mx-auto px-4 md:px-6">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.labels.back_to_courses")}
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge className="bg-white/10 text-white border-white/20">
              {categoryLabel}
            </Badge>
            <Badge className="bg-primary/20 text-white border-primary/30">
              {localizeLevel(course.level, locale)}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="text-slate-300 text-lg mt-4 max-w-3xl">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 -mt-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-2xl font-bold font-display text-slate-900 mb-4">
                {t("common.labels.about_course")}
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {learningObjectives.length > 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-6">
                  {t("common.labels.what_you_learn")}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {learningObjectives.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-slate-700 text-sm font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {requirements.length > 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-6">
                  {t("common.labels.course_requirements")}
                </h3>
                <ul className="space-y-3">
                  {requirements.map((item, index) => (
                    <li key={`${item}-${index}`} className="flex items-center gap-3 text-slate-700">
                      <Lock className="w-4 h-4 text-slate-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {targetedAudience.length > 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-6">
                  {t("common.labels.course_audience")}
                </h3>
                <ul className="space-y-3">
                  {targetedAudience.map((item, index) => (
                    <li key={`${item}-${index}`} className="text-slate-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {faqs.length > 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-xl font-bold font-display text-slate-900 mb-6">
                  {t("common.labels.faq")}
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={`${faq.question_en}-${index}`}
                      value={`faq-${index}`}
                      className="border-slate-100 last:border-0"
                    >
                      <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-primary hover:no-underline py-4">
                        {locale === "bn" ? faq.question_bn || faq.question_en : faq.question_en}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 leading-relaxed pb-4">
                        {locale === "bn" ? faq.answer_bn || faq.answer_en : faq.answer_en}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : null}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 sticky top-24">
              <div className="aspect-video rounded-xl overflow-hidden mb-6 relative group">
                <img
                  src={thumbnail}
                  alt={title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <PlayCircle className="w-8 h-8 text-white fill-white/20" />
                  </div>
                </div>
              </div>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-bold text-slate-900 tracking-tight">
                  {course.is_free ? t("common.labels.free") : currencyLabel(displayPrice)}
                </span>
                {!course.is_free && hasDiscount ? (
                  <span className="text-lg text-slate-400 line-through mb-1">
                    {currencyLabel(course.price ?? 0)}
                  </span>
                ) : null}
              </div>

              <CourseEnrollButton courseId={course.id} courseSlug={course.slug} />

              <div className="space-y-4 pt-6 border-t border-slate-100 mt-6">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                  {t("common.labels.course_includes")}
                </h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-primary shrink-0" />
                    <span>
                      {t("common.courses.lessons", {
                        count: localeNumber(course.total_lessons ?? 0),
                      })}
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>{course.duration || t("common.courses.self_paced")}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-primary shrink-0" />
                    <span>{localizeLanguage(course.language, locale)}</span>
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
