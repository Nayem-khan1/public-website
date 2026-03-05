import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock, Globe, PlayCircle, CheckCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getPublicCourseBySlug } from "@/lib/public-api";

export default async function CourseDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getPublicCourseBySlug(slug, "en");

  if (!course) {
    notFound();
  }

  const title = course.title ?? course.title_en ?? "Untitled Course";
  const subtitle = course.subtitle ?? course.subtitle_en ?? "";
  const description = course.description ?? course.description_en ?? "";
  const thumbnail =
    course.thumbnail ||
    "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200";

  const requirements = course.requirements ?? course.requirements_en ?? [];
  const learningObjectives =
    course.learning_objectives ?? course.learning_objectives_en ?? [];
  const targetedAudience =
    course.targeted_audience ?? course.targeted_audience_en ?? [];
  const faqs = course.faqs ?? [];
  const hasDiscount =
    typeof course.discount_price === "number" &&
    typeof course.price === "number" &&
    course.discount_price > 0 &&
    course.discount_price < course.price;
  const displayPrice = hasDiscount ? course.discount_price ?? 0 : course.price ?? 0;

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
            Back to Courses
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <Badge className="bg-white/10 text-white border-white/20">
              {course.category_id || "Astronomy"}
            </Badge>
            <Badge className="bg-primary/20 text-white border-primary/30">
              {course.level || "beginner"}
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
                About this Course
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                {description}
              </p>
            </div>

            {learningObjectives.length > 0 ? (
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-2xl font-bold font-display text-slate-900 mb-6">
                  What you&apos;ll learn
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
                  Course Requirements
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
                  Who this course is for
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
                  Frequently Asked Questions
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={`${faq.question_en}-${index}`}
                      value={`faq-${index}`}
                      className="border-slate-100 last:border-0"
                    >
                      <AccordionTrigger className="text-left font-semibold text-slate-900 hover:text-primary hover:no-underline py-4">
                        {faq.question_en}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 leading-relaxed pb-4">
                        {faq.answer_en}
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
                  {course.is_free ? "Free" : `BDT ${displayPrice.toLocaleString("en-US")}`}
                </span>
                {!course.is_free && hasDiscount ? (
                  <span className="text-lg text-slate-400 line-through mb-1">
                    BDT {(course.price ?? 0).toLocaleString("en-US")}
                  </span>
                ) : null}
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 h-12 text-lg font-bold rounded-xl">
                Enroll Now
              </Button>

              <div className="space-y-4 pt-6 border-t border-slate-100 mt-6">
                <h4 className="font-bold text-slate-900 text-sm uppercase tracking-wide">
                  This course includes:
                </h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-primary shrink-0" />
                    <span>{course.total_lessons ?? 0} lessons</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <span>{course.duration || "Self-paced"}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-primary shrink-0" />
                    <span>{course.language === "bn" ? "Bangla" : "English"}</span>
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
