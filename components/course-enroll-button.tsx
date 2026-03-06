"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { enrollInCourse, getStudentAccessToken } from "@/lib/student-api";

interface CourseEnrollButtonProps {
  courseId: string;
  courseSlug: string;
}

export function CourseEnrollButton({
  courseId,
  courseSlug,
}: CourseEnrollButtonProps) {
  const router = useRouter();
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
        setNotice("You are already enrolled in this course.");
      } else {
        setNotice("Enrollment successful. Continue from your dashboard.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enrollment failed");
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
        {loading ? "Processing..." : "Enroll Now"}
      </Button>

      {notice ? (
        <p className="mt-3 text-xs text-emerald-600">{notice}</p>
      ) : null}

      {error ? (
        <p className="mt-3 text-xs text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}
