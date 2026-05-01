"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/i18n/format";
import { ArrowRight } from "lucide-react";

interface CourseEnrollButtonProps {
  courseId: string;
  courseSlug: string;
  isFree?: boolean;
  price?: number;
  discountPrice?: number;
}

export function CourseEnrollButton({
  courseSlug,
  isFree,
  price,
  discountPrice,
}: CourseEnrollButtonProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const { t } = useAppTranslation();

  const displayPrice = discountPrice && discountPrice < (price ?? 0) ? discountPrice : price;

  const priceLabel = useMemo(() => {
    if (isFree) return t("common.free");
    return formatCurrency(displayPrice ?? 0, locale);
  }, [isFree, displayPrice, locale, t]);

  return (
    <Button
      onClick={() => router.push(`/checkout/${courseSlug}`)}
      className="w-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 h-14 text-lg font-bold rounded-2xl group transition-all"
    >
      <span className="flex items-center justify-center gap-2">
        {t("courseDetails.enrollNow")}
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </span>
    </Button>
  );
}
