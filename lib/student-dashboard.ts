import type { Locale } from "@/lib/i18n/config";
import type { StudentActivityDay, StudentCourse } from "@/lib/student-api";

export type StudentCourseFilter = "all" | "active" | "completed" | "locked";
export type StudentCourseSort = "recent" | "progress" | "title";

const UNITS: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: "second" },
  { amount: 60, unit: "minute" },
  { amount: 24, unit: "hour" },
  { amount: 7, unit: "day" },
  { amount: 4.34524, unit: "week" },
  { amount: 12, unit: "month" },
  { amount: Number.POSITIVE_INFINITY, unit: "year" },
];

function getLocaleTag(locale: Locale): string {
  return locale === "bn" ? "bn-BD" : "en-US";
}

export function formatActivityDayLabel(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "--";
  }

  return new Intl.DateTimeFormat(getLocaleTag(locale), {
    weekday: "short",
  }).format(date);
}

export function formatRelativeDate(value: string, locale: Locale): string {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) {
    return "Date unavailable";
  }

  const diffInSeconds = Math.round((timestamp - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat(getLocaleTag(locale), {
    numeric: "auto",
  });

  let current = diffInSeconds;
  for (const { amount, unit } of UNITS) {
    if (Math.abs(current) < amount) {
      return formatter.format(current, unit);
    }
    current = Math.round(current / amount);
  }

  return formatter.format(current, "year");
}

export function formatShortDate(value: string, locale: Locale): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(getLocaleTag(locale), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function filterAndSortStudentCourses(
  courses: StudentCourse[],
  options: {
    searchTerm: string;
    filter: StudentCourseFilter;
    sort: StudentCourseSort;
  },
): StudentCourse[] {
  const normalizedSearch = options.searchTerm.trim().toLowerCase();

  return courses
    .filter((course) => {
      if (options.filter === "locked" && course.access_status !== "locked") {
        return false;
      }

      if (
        options.filter === "active" &&
        !(course.status === "active" && course.access_status === "active")
      ) {
        return false;
      }

      if (options.filter === "completed" && course.status !== "completed") {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return course.title.toLowerCase().includes(normalizedSearch);
    })
    .sort((left, right) => {
      if (options.sort === "title") {
        return left.title.localeCompare(right.title);
      }

      if (options.sort === "progress") {
        if (right.progress_percent !== left.progress_percent) {
          return right.progress_percent - left.progress_percent;
        }
        return right.completed_lessons_count - left.completed_lessons_count;
      }

      return new Date(right.last_activity_at).getTime() - new Date(left.last_activity_at).getTime();
    });
}

export function getCourseActivityCounts(courses: StudentCourse[]) {
  return {
    active: courses.filter(
      (course) => course.status === "active" && course.access_status === "active",
    ).length,
    completed: courses.filter((course) => course.status === "completed").length,
    locked: courses.filter((course) => course.access_status === "locked").length,
    remainingLessons: courses.reduce((sum, course) => sum + course.remaining_lessons, 0),
  };
}

export function getActivityTotals(days: StudentActivityDay[]) {
  return days.reduce(
    (totals, day) => ({
      activeDays: totals.activeDays + (day.is_active ? 1 : 0),
      logins: totals.logins + day.login_count,
      lessonCompletions: totals.lessonCompletions + day.lesson_completion_count,
    }),
    {
      activeDays: 0,
      logins: 0,
      lessonCompletions: 0,
    },
  );
}
