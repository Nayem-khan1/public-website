import { PlayCircle, BookOpen, Globe, Video } from "lucide-react";
import { CourseVideoModal } from "./course-video-modal";
import { CourseEnrollButton } from "@/components/course-enroll-button";
import { formatCurrency } from "@/lib/i18n/format";
import type { Locale } from "@/lib/i18n/config";

interface CourseSidebarProps {
  courseId: string;
  courseSlug: string;
  title: string;
  thumbnail: string;
  introVideoUrl?: string;
  isFree?: boolean;
  price?: number;
  discountPrice?: number;
  locale: Locale;
  totalLessons?: number;
  duration?: string;
  languageLabel: string;
  t: (key: string) => string;
}

export function CourseSidebar({
  courseId,
  courseSlug,
  title,
  thumbnail,
  introVideoUrl,
  isFree,
  price,
  discountPrice,
  locale,
  totalLessons,
  duration,
  languageLabel,
  t,
}: CourseSidebarProps) {
  const hasDiscount =
    typeof discountPrice === "number" &&
    typeof price === "number" &&
    discountPrice > 0 &&
    discountPrice < price;

  const displayPrice = hasDiscount ? discountPrice ?? 0 : price ?? 0;
  const hasIntroVideo = Boolean(introVideoUrl);

  return (
    <div className="lg:col-span-1 z-40">
      <div className="sticky top-28 rounded-2xl border border-slate-200 bg-white shadow-xl flex flex-col md:-mt-24 xl:-mt-32 lg:-mt-32 overflow-hidden relative z-40">

        <div className="relative z-10">
          <CourseVideoModal
            introVideoUrl={introVideoUrl}
            thumbnail={thumbnail}
            title={title}
            watchIntroText={t("courseDetails.watchIntro")}
          />

          <div className="p-6 flex flex-col justify-start relative">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-3xl font-black tracking-tighter text-slate-900">
                {isFree ? t("common.free") : formatCurrency(displayPrice, locale)}
              </span>
              {!isFree && hasDiscount ? (
                <span className="text-lg text-slate-400 line-through font-medium">
                  {formatCurrency(price ?? 0, locale)}
                </span>
              ) : null}
            </div>
            {hasDiscount ? (
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded-md bg-orange-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-orange-600">
                  {Math.round(((price! - discountPrice!) / price!) * 100)}% Off
                </span>
              </div>
            ) : null}

            <div className="mt-6 mb-6">
              <CourseEnrollButton
                courseId={courseId}
                courseSlug={courseSlug}
                isFree={Boolean(isFree)}
                price={price}
                discountPrice={discountPrice}
              />
            </div>

            <div className="space-y-4 pt-2">
              <h4 className="text-base font-bold text-slate-900">
                {t("courseDetails.thisCourseIncludes")}
              </h4>
              <ul className="space-y-3 text-sm font-medium text-slate-700">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 text-primary">
                    <Video className="h-4 w-4 shrink-0" />
                  </div>
                  <span>
                    {duration || t("common.selfPaced")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 text-primary">
                    <BookOpen className="h-4 w-4 shrink-0" />
                  </div>
                  <span>
                    {totalLessons ?? 0} {t("common.lessons")}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 text-primary">
                    <Globe className="h-4 w-4 shrink-0" />
                  </div>
                  <span>{languageLabel}</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">{t("courseDetails.callForHelp")}</p>
                <p className="text-sm font-bold text-slate-900">16910</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
