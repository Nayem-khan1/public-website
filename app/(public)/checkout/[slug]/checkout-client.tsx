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
import { Tag, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";

interface CheckoutClientProps {
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

export function CheckoutClient({
  courseId,
  courseSlug,
  isFree,
  price,
  discountPrice,
}: CheckoutClientProps) {
  const router = useRouter();
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pricingError, setPricingError] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [pricing, setPricing] = useState<StudentPricingSummary>(
    buildInitialPricingSummary({ isFree, price, discountPrice }),
  );

  useEffect(() => {
    // Check auth on mount
    const token = getStudentAccessToken();
    if (!token) {
      router.replace(`/login?next=/checkout/${courseSlug}`);
      return;
    }
    setIsCheckingAuth(false);
  }, [router, courseSlug]);

  useEffect(() => {
    let cancelled = false;

    async function loadBasePricing() {
      if (isFree) return;
      setPricingLoading(true);

      try {
        const result = await previewCoursePricing(courseId);
        if (!cancelled) {
          setPricing(result.pricing);
          setPricingError(null);
        }
      } catch {
        if (!cancelled) {
          // Fallback to initial build
          setPricing(buildInitialPricingSummary({ isFree, price, discountPrice }));
        }
      } finally {
        if (!cancelled) {
          setPricingLoading(false);
        }
      }
    }

    if (!isCheckingAuth) {
      void loadBasePricing();
    }

    return () => {
      cancelled = true;
    };
  }, [courseId, discountPrice, isFree, price, isCheckingAuth]);

  const hasCourseDiscount = pricing.course_discount_amount > 0;
  const normalizedCouponCode = normalizeCouponCode(couponInput);
  const priceLabel = useMemo(
    () => formatCurrency(pricing.final_amount, locale),
    [locale, pricing.final_amount],
  );

  async function refreshPricing(couponCode?: string) {
    if (isFree) return;

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
      router.push(`/login?next=/checkout/${courseSlug}`);
      return;
    }

    setLoading(true);
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
        router.push(`/dashboard/courses/${courseSlug}`);
      } else {
        router.push(`/payment/success?enrollment_id=${result.enrollment?.id || ""}`);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : t("courseDetails.enrollmentFailed");
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm animate-pulse h-64 flex items-center justify-center text-slate-400">
        Authenticating...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!isFree && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary/80 to-secondary/80" />
          
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-primary" />
            Have a Coupon?
          </h3>
          
          <div className="flex items-center gap-2">
            <Input
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
              placeholder={t("courseDetails.couponPlaceholder")}
              className="h-12 bg-slate-50 border-slate-200 focus-visible:ring-primary/20"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => void handleApplyCoupon()}
              disabled={pricingLoading}
              className="h-12 shrink-0 border-slate-200 hover:bg-slate-50 hover:text-primary font-semibold"
            >
              {t("courseDetails.applyCoupon")}
            </Button>
          </div>
          {pricing.applied_coupon && (
            <p className="mt-3 text-sm text-emerald-600 flex items-center gap-1 font-medium bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-4 h-4" />
              {pricing.applied_coupon.code} applied!
            </p>
          )}
          {pricingError && (
            <p className="mt-3 text-sm text-rose-600 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
              {pricingError}
            </p>
          )}
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-bold text-lg text-slate-900 mb-4 pb-4 border-b border-slate-100">Payment Summary</h3>
        
        {!isFree ? (
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-600">
              <span>{t("courseDetails.originalPrice")}</span>
              <span className="font-medium">{formatCurrency(pricing.original_amount, locale)}</span>
            </div>

            {hasCourseDiscount && (
              <div className="flex items-center justify-between text-slate-600">
                <span>{t("courseDetails.courseDiscount")}</span>
                <span className="text-primary font-medium">-{formatCurrency(pricing.course_discount_amount, locale)}</span>
              </div>
            )}

            {pricing.coupon_discount_amount > 0 && (
              <div className="flex items-center justify-between text-emerald-600 font-medium">
                <span>{t("courseDetails.couponDiscount")}</span>
                <span>-{formatCurrency(pricing.coupon_discount_amount, locale)}</span>
              </div>
            )}

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-900 text-base">
                {t("courseDetails.finalAmount")}
              </span>
              <span className="text-2xl font-black text-slate-900">{priceLabel}</span>
            </div>
          </div>
        ) : (
          <div className="py-4 text-center">
            <span className="text-2xl font-black text-emerald-600 uppercase tracking-wide">Free Course</span>
          </div>
        )}

        <Button
          onClick={() => void handleEnroll()}
          disabled={loading || pricingLoading}
          className="w-full bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 h-14 text-lg font-bold rounded-2xl mt-6 group transition-all"
        >
          {loading ? t("courseDetails.processing") : (
            <span className="flex items-center justify-center gap-2">
              {t("courseDetails.enrollNow")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          )}
        </Button>
        
        <p className="mt-4 text-xs text-slate-500 text-center flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Secure encrypted payment
        </p>

        {error && <p className="mt-4 text-sm text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-100">{error}</p>}
      </div>
    </div>
  );
}
