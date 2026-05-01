import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { getPublicCourseBySlug, getLocalizedCourseText } from "@/lib/public-api";
import { getLocaleAndTranslations, getRequestLocale } from "@/lib/i18n/server";
import { CheckoutClient } from "./checkout-client";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getRequestLocale();
  const { slug } = await params;
  const course = await getPublicCourseBySlug(slug, locale);
  const { t } = await getLocaleAndTranslations(locale);

  if (!course) {
    notFound();
  }

  const localized = getLocalizedCourseText(course, locale);
  const title = localized.title || t("courseCard.untitled");
  const thumbnail = course.thumbnail || "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1200";

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link
          href={`/courses/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("courseDetails.backToCourses")}
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-slate-500 mt-2">Complete your purchase to access the course.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Order Summary (Left side on desktop) */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
              
              <div className="flex gap-4 md:gap-6 items-start pb-6 border-b border-slate-100">
                <div className="relative w-28 h-20 md:w-40 md:h-28 rounded-xl overflow-hidden shrink-0">
                  <img src={thumbnail} alt={title} className="object-cover w-full h-full" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg md:text-xl line-clamp-2">{title}</h3>
                  <p className="text-sm text-slate-500 mt-2 line-clamp-1">{localized.categoryTitle}</p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  What you will get:
                </h4>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    Full lifetime access to {course.total_lessons || 0} lessons
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    Access on mobile and web
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment & Coupon details (Right side on desktop) */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <CheckoutClient 
                courseId={course.id}
                courseSlug={course.slug}
                isFree={course.is_free}
                price={course.price}
                discountPrice={course.discount_price}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
