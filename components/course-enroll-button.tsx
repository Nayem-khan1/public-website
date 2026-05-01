"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/i18n/format";
import {
  enrollInCourse,
  getStudentAccessToken,
  previewCoursePricing,
  type StudentPricingSummary,
} from "@/lib/student-api";

interface CourseEnrollButtonProps {
  courseId: string;
  courseSlug: string;
  isFree?: boolean;
  price?: number;
  discountPrice?: number;
}

function normalizeCouponCode(value: string) {
  const normalized = value.trim().toUpperCase();
  return normalized || undefined;
}

function buildInitialPricingSummary(input: {
  isFree?: boolean;
  price?: number;
  discountPrice?: number;
}): StudentPricingSummary {
  const originalAmount = input.isFree ? 0 : Math.max(0, Math.round(input.price ?? 0));
  const discountedAmount =
    input.isFree || originalAmount <= 0
      ? 0
      : typeof input.discountPrice === "number" &&
          input.discountPrice > 0 &&
          input.discountPrice < originalAmount
        ? Math.round(input.discountPrice)
        : originalAmount;

  return {
    currency: "BDT",
    original_amount: originalAmount,
    course_discount_amount: Math.max(0, originalAmount - discountedAmount),
    subtotal_amount: discountedAmount,
    coupon_discount_amount: 0,
    manual_discount_amount: 0,
    final_amount: discountedAmount,
    applied_coupon: null,
  };
}

export function CourseEnrollButton({
  courseId,
  courseSlug,
  isFree,
  price,
  discountPrice,
}: CourseEnrollButtonProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const [loading, setLoading] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [pricing, setPricing] = useState<StudentPricingSummary>(
    buildInitialPricingSummary({ isFree, price, discountPrice }),
  );

  useEffect(() => {
    let cancelled = false;

    async function loadBasePricing() {
      if (isFree) {
        setPricing(buildInitialPricingSummary({ isFree, price, discountPrice }));
        setPricingError(null);
        return;
      }

      setPricingLoading(true);

      try {
        const result = await previewCoursePricing(courseId);
        if (!cancelled) {
          setPricing(result.pricing);
          setPricingError(null);
        }
      } catch {
        if (!cancelled) {
          setPricing(buildInitialPricingSummary({ isFree, price, discountPrice }));
        }
      } finally {
        if (!cancelled) {
          setPricingLoading(false);
        }
      }
    }

    void loadBasePricing();

    return () => {
      cancelled = true;
    };
  }, [courseId, discountPrice, isFree, price]);

  const hasCourseDiscount = pricing.course_discount_amount > 0;
  const normalizedCouponCode = normalizeCouponCode(couponInput);
  const priceLabel = useMemo(
    () => formatCurrency(pricing.final_amount, locale),
    [locale, pricing.final_amount],
  );

  async function refreshPricing(couponCode?: string) {
    if (isFree) {
      setPricing(buildInitialPricingSummary({ isFree, price, discountPrice }));
      setPricingError(null);
      return;
    }

    setPricingLoading(true);
    setPricingError(null);

    try {
      const result = await previewCoursePricing(courseId, {
        coupon_code: couponCode,
      });
      setPricing(result.pricing);
    } catch (previewError) {
      setPricingError(
        previewError instanceof Error
          ? previewError.message
          : t("courseDetails.pricingUnavailable"),
      );
    } finally {
      setPricingLoading(false);
    }
  }

  async function handleApplyCoupon() {
    setNotice(null);
    setError(null);

    if (!normalizedCouponCode) {
      await refreshPricing(undefined);
      return;
    }

    await refreshPricing(normalizedCouponCode);
  }

  async function handleEnroll() {
    const token = getStudentAccessToken();

    if (!token) {
      router.push(`/login?next=/courses/${courseSlug}`);
      return;
    }

    setLoading(true);
    setNotice(null);
    setError(null);

    try {
      const result = await enrollInCourse(
        courseId,
        { coupon_code: normalizedCouponCode },
        token,
      );

      if (result.pricing) {
        setPricing(result.pricing);
      }

      if (result.payment_required && result.payment?.bkash_url) {
        window.location.href = result.payment.bkash_url;
        return;
      }

      if (result.already_enrolled) {
        setNotice(t("courseDetails.alreadyEnrolled"));
      } else {
        setNotice(t("courseDetails.enrollmentSuccessful"));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("courseDetails.enrollmentFailed");
      setError(message);
      setPricingError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {!isFree ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-4">
          <div className="flex items-center gap-2">
            <Input
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
              placeholder={t("courseDetails.couponPlaceholder")}
              className="h-11 bg-white"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleApplyCoupon()}
              disabled={pricingLoading}
              className="h-11 shrink-0"
            >
              {t("courseDetails.applyCoupon")}
            </Button>
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>{t("courseDetails.originalPrice")}</span>
              <span>{formatCurrency(pricing.original_amount, locale)}</span>
            </div>

            {hasCourseDiscount ? (
              <div className="flex items-center justify-between text-emerald-600">
                <span>{t("courseDetails.courseDiscount")}</span>
                <span>-{formatCurrency(pricing.course_discount_amount, locale)}</span>
              </div>
            ) : null}

            <div className="flex items-center justify-between text-emerald-600">
              <span>{t("courseDetails.couponDiscount")}</span>
              <span>-{formatCurrency(pricing.coupon_discount_amount, locale)}</span>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-3">
              <span className="font-semibold text-slate-900">
                {t("courseDetails.finalAmount")}
              </span>
              <span className="text-lg font-bold text-slate-950">{priceLabel}</span>
            </div>
          </div>

          {pricing.applied_coupon ? (
            <p className="mt-3 text-xs text-emerald-700">
              {pricing.applied_coupon.code} {t("courseDetails.couponApplied")}
            </p>
          ) : null}

          {pricingLoading ? (
            <p className="mt-3 text-xs text-slate-500">
              {t("courseDetails.pricingUpdating")}
            </p>
          ) : null}

          {pricingError ? (
            <p className="mt-3 text-xs text-rose-600">{pricingError}</p>
          ) : null}
        </div>
      ) : null}

      <Button
        onClick={() => void handleEnroll()}
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 h-12 text-lg font-bold rounded-xl"
      >
        {loading ? t("courseDetails.processing") : t("courseDetails.enrollNow")}
      </Button>

      {notice ? (
        <p className="text-xs text-emerald-600">{notice}</p>
      ) : null}

      {error ? <p className="text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
