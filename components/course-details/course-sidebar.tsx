import { PlayCircle, BookOpen, Globe, Video } from "lucide-react";
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
    <div className="lg:col-span-1 z-20">
      <div className="sticky top-28 rounded-3xl border border-slate-100 bg-white/70 backdrop-blur-3xl p-6 md:p-8 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.8)_inset] flex flex-col md:-mt-48 xl:-mt-64 lg:-mt-64 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white/80 to-slate-50/20 z-0"/>
        
        <div className="relative z-10">
          <div className="group relative mb-8 aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-900/10">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-slate-800 bg-gradient-to-tr from-slate-800 to-slate-600">
                <BookOpen className="w-12 h-12 text-white/20" />
              </div>
            )}
            {hasIntroVideo ? (
              <a
                href={introVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center group-hover:from-black/60 transition-all duration-300"
              >
                <div className="flex flex-col items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/90 text-white shadow-[0_0_30px_rgba(var(--primary),0.6)] border border-white/20 cursor-pointer backdrop-blur-md hover:bg-primary transition-colors">
                    <PlayCircle className="h-8 w-8 ml-1" />
                  </div>
                  <span className="mt-4 rounded-full bg-black/60 px-4 py-1.5 text-sm font-semibold tracking-wide text-white backdrop-blur-md">
                    {t("courseDetails.watchIntro")}
                  </span>
                </div>
              </a>
            ) : null}
          </div>

          <div className="mb-6 flex flex-col justify-start relative">
            <div className="flex items-baseline gap-3 mb-1">
              <span className="text-4xl lg:text-5xl font-black tracking-tighter text-slate-900 drop-shadow-sm">
                {isFree ? t("common.free") : formatCurrency(displayPrice, locale)}
              </span>
              {!isFree && hasDiscount ? (
                <span className="text-xl text-slate-400 line-through font-medium">
                  {formatCurrency(price ?? 0, locale)}
                </span>
              ) : null}
            </div>
            {hasDiscount ? (
              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-md bg-orange-100 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-orange-600">
                  {Math.round(((price! - discountPrice!) / price!) * 100)}% Off
                </span>
              </div>
            ) : null}
          </div>

          <div className="shadow-lg shadow-primary/20 rounded-xl overflow-hidden mb-1">
            <CourseEnrollButton courseId={courseId} courseSlug={courseSlug} />
          </div>

          <div className="space-y-5 border-t border-slate-200/60 pt-6">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              {t("courseDetails.thisCourseIncludes")}
            </h4>
            <ul className="space-y-4 text-sm font-medium text-slate-700">
              <li className="flex items-center gap-3">
                <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600 ring-1 ring-indigo-100">
                  <Video className="h-4 w-4 shrink-0" />
                </div>
                <span>
                  {duration || t("common.selfPaced")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 ring-1 ring-blue-100">
                  <BookOpen className="h-4 w-4 shrink-0" />
                </div>
                <span>
                  {totalLessons ?? 0} {t("common.lessons")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600 ring-1 ring-purple-100">
                  <Globe className="h-4 w-4 shrink-0" />
                </div>
                <span>{languageLabel}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
