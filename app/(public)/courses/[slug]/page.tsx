import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckCircle, Lock } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getCourseLanguageLabel, getCourseLevelLabel } from "@/lib/i18n/course";
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

// Components
import { CourseHeader } from "@/components/course-details/course-header";
import { CourseCurriculum } from "@/components/course-details/course-curriculum";
import { CourseSidebar } from "@/components/course-details/course-sidebar";
import { CourseInstructor } from "@/components/course-details/course-instructor";

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

  // Data mapping
  const categoryLabel = localized.categoryTitle || t("common.astronomy");
  const levelLabel = getCourseLevelLabel(course.level, t);
  const languageLabel = getCourseLanguageLabel(course.language, t);
  const curriculum = course.curriculum ?? [];
  const instructors = course.instructors ?? [];
  const curriculumLessonCount = curriculum.reduce(
    (sum, section) => sum + (section.lessons?.length ?? section.total_lessons ?? 0),
    0,
  );
  const resolvedTotalLessons = curriculumLessonCount || course.total_lessons || 0;

  return (
    <div className="min-h-screen bg-slate-50 pb-24 md:pb-20 scroll-smooth">
      <CourseHeader
        title={title}
        subtitle={subtitle}
        category={categoryLabel}
        level={levelLabel}
        backText={t("courseDetails.backToCourses")}
        mode={t("common.recorded")}
        lessonsText={resolvedTotalLessons > 0 ? `${resolvedTotalLessons} ${t("common.lessons")}` : undefined}
        durationText={course.duration || undefined}
        languageText={languageLabel}
      />

      {/* Sticky Tab Navigation (Desktop) — glassmorphism style, avoids slicing sidebar */}
      <div className="sticky top-16 md:top-[72px] z-30 hidden md:block">
        <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <div className="container mx-auto px-4 md:px-6">
            <ul className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              <li>
                <a href="#description" className="block px-5 py-4 font-semibold text-sm text-slate-500 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary whitespace-nowrap">
                  {t("courseDetails.aboutCourse")}
                </a>
              </li>
              <li>
                <a href="#curriculum" className="block px-5 py-4 font-semibold text-sm text-slate-500 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary whitespace-nowrap">
                  {t("courseDetails.curriculum")}
                </a>
              </li>
              {instructors.length > 0 ? (
                <li>
                  <a href="#instructors" className="block px-5 py-4 font-semibold text-sm text-slate-500 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary whitespace-nowrap">
                    {instructors.length > 1 ? t("courseDetails.instructors") : t("courseDetails.instructor")}
                  </a>
                </li>
              ) : null}
              {localized.faqs.length > 0 && (
                <li>
                  <a href="#faq" className="block px-5 py-4 font-semibold text-sm text-slate-500 hover:text-primary transition-colors border-b-2 border-transparent hover:border-primary whitespace-nowrap">
                    {t("courseDetails.frequentlyAskedQuestions")}
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto mt-8 md:mt-12 px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">

          {/* ── LEFT COLUMN: Main Content ── */}
          <div className="space-y-10 lg:col-span-2">

            {/* What You'll Learn */}
            {localized.learningObjectives.length > 0 ? (
              <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50/50 via-white to-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <h3 className="mb-8 text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600">
                    <CheckCircle className="w-5 h-5" />
                  </span>
                  {t("courseDetails.whatYouWillLearn")}
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {localized.learningObjectives.map((item, index) => (
                    <div key={`${item}-${index}`} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all group">
                      <div className="mt-0.5 flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 group-hover:bg-emerald-500 transition-colors shrink-0">
                        <CheckCircle className="h-4 w-4 text-emerald-600 group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {/* Course Description */}
            <div className="rounded-3xl border border-slate-100 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" id="description">
              <h2 className="mb-6 text-2xl font-extrabold text-slate-900 tracking-tight">
                {t("courseDetails.aboutCourse")}
              </h2>
              <div className="prose prose-slate max-w-none prose-p:leading-relaxed prose-p:text-slate-600">
                 <p className="whitespace-pre-line text-[15px] leading-relaxed text-slate-600">{description}</p>
              </div>
            </div>

            {/* Curriculum */}
            <CourseCurriculum sections={curriculum} t={t} />

            {/* Instructor */}
            <CourseInstructor instructors={instructors} t={t} />

            {/* Requirements & Target Audience */}
            <div className="grid gap-8 sm:grid-cols-2">
              {localized.requirements.length > 0 && (
                <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="mb-6 text-xl font-extrabold text-slate-900 tracking-tight">
                    {t("courseDetails.courseRequirements")}
                  </h3>
                  <ul className="space-y-4">
                    {localized.requirements.map((item, index) => (
                      <li
                        key={`${item}-${index}`}
                        className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed font-medium"
                      >
                        <Lock className="mt-0.5 h-4 w-4 text-slate-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {localized.targetedAudience.length > 0 && (
                <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <h3 className="mb-6 text-xl font-extrabold text-slate-900 tracking-tight">
                    {t("courseDetails.whoIsThisFor")}
                  </h3>
                  <ul className="space-y-4">
                    {localized.targetedAudience.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed">
                        <div className="mt-1.5 w-2 h-2 rounded-full bg-primary shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* FAQs */}
            {localized.faqs.length > 0 ? (
              <div className="rounded-3xl border border-slate-100 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" id="faq">
                <h3 className="mb-8 text-2xl font-extrabold text-slate-900 tracking-tight">
                  {t("courseDetails.frequentlyAskedQuestions")}
                </h3>
                <Accordion type="single" collapsible className="w-full space-y-3">
                  {localized.faqs.map((faq, index) => (
                    <AccordionItem
                      key={`${faq.question}-${index}`}
                      value={`faq-${index}`}
                      className="border border-slate-100 rounded-2xl px-2 data-[state=open]:bg-slate-50 transition-colors"
                    >
                      <AccordionTrigger className="py-5 text-left font-semibold text-slate-800 hover:text-primary hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 leading-relaxed text-slate-600">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : null}

          </div>

          {/* ── RIGHT COLUMN: Sidebar ── */}
          <CourseSidebar
            courseId={course.id}
            courseSlug={course.slug}
            title={title}
            thumbnail={thumbnail}
            introVideoUrl={course.intro_video_url}
            isFree={course.is_free}
            price={course.price}
            discountPrice={course.discount_price}
            locale={locale}
            languageLabel={languageLabel}
            totalLessons={resolvedTotalLessons}
            duration={course.duration}
            t={t}
          />

        </div>
      </div>
    </div>
  );
}
