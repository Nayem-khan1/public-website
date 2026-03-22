type TranslationFn = (
  key: string,
  options?: Record<string, string | number>,
) => string;

export function getCourseLevelLabel(
  level: string | undefined,
  t: TranslationFn,
): string {
  switch (level) {
    case "beginner":
      return t("course.level.beginner");
    case "intermediate":
      return t("course.level.intermediate");
    case "advanced":
      return t("course.level.advanced");
    case "all_levels":
      return t("course.level.allLevels");
    default:
      return level || t("courseCard.allGrades");
  }
}

export function getCourseLanguageLabel(
  language: string | undefined,
  t: TranslationFn,
): string {
  if (language === "bn") return t("common.bangla");
  if (language === "en") return t("common.english");
  return language || t("common.bangla");
}

export function getCourseModeLabel(
  mode: string | undefined,
  t: TranslationFn,
): string {
  return mode === "live" ? t("common.live") : t("common.recorded");
}
