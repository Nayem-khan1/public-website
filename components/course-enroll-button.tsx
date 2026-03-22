"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { enrollInCourse, getStudentAccessToken } from "@/lib/student-api";
import { useAppTranslation } from "@/contexts/LanguageContext";

interface CourseEnrollButtonProps {
  courseId: string;
  courseSlug: string;
}

export function CourseEnrollButton({
  courseId,
  courseSlug,
}: CourseEnrollButtonProps) {
  const router = useRouter();
  const { t } = useAppTranslation();
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const result = await enrollInCourse(courseId, token);

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
      setError(err instanceof Error ? err.message : t("courseDetails.enrollmentFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        onClick={handleEnroll}
        disabled={loading}
        className="w-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 h-12 text-lg font-bold rounded-xl"
      >
        {loading ? t("courseDetails.processing") : t("courseDetails.enrollNow")}
      </Button>

      {notice ? (
        <p className="mt-3 text-xs text-emerald-600">{notice}</p>
      ) : null}

      {error ? <p className="mt-3 text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
