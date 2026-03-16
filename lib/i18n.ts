import enCommon from "@/locales/en/common.json";
import bnCommon from "@/locales/bn/common.json";

export const SUPPORTED_LOCALES = ["en", "bn"] as const;
export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "en";
export const LOCALE_COOKIE = "ap_locale";
export const LOCALE_STORAGE_KEY = "ap_locale";

export function normalizeLocale(value?: string | null): AppLocale {
  if (value === "bn") return "bn";
  return "en";
}

export function getMessages(locale: AppLocale) {
  return {
    common: locale === "bn" ? bnCommon : enCommon,
  };
}

export function formatNumber(value: number, locale: AppLocale): string {
  const language = locale === "bn" ? "bn-BD" : "en-US";
  return value.toLocaleString(language);
}

export function formatCurrency(value: number, locale: AppLocale): string {
  return `BDT ${formatNumber(value, locale)}`;
}

export function formatDate(
  value: Date,
  locale: AppLocale,
  options: Intl.DateTimeFormatOptions,
): string {
  const language = locale === "bn" ? "bn-BD" : "en-US";
  return new Intl.DateTimeFormat(language, options).format(value);
}

export function pickLocalizedText(options: {
  locale: AppLocale;
  primary?: string;
  en?: string;
  bn?: string;
  fallback?: string;
}): string {
  const { locale, primary, en, bn, fallback } = options;
  if (locale === "bn") {
    return bn || primary || en || fallback || "";
  }
  return en || primary || bn || fallback || "";
}

const LEVEL_LABELS: Record<AppLocale, Record<string, string>> = {
  en: {
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    all_levels: "All Levels",
  },
  bn: {
    beginner: "শুরুর স্তর",
    intermediate: "মধ্যবর্তী",
    advanced: "উচ্চ স্তর",
    all_levels: "সব স্তর",
  },
};

export function localizeLevel(value: string | undefined, locale: AppLocale): string {
  if (!value) return LEVEL_LABELS[locale].beginner;
  const key = value.toLowerCase();
  return LEVEL_LABELS[locale][key] || value;
}

export function localizeCourseMode(value: string | undefined, locale: AppLocale): string {
  if (!value) return locale === "bn" ? "রেকর্ডেড" : "Recorded";
  const key = value.toLowerCase();
  if (key === "live") return locale === "bn" ? "লাইভ" : "Live";
  if (key === "recorded") return locale === "bn" ? "রেকর্ডেড" : "Recorded";
  return value;
}

export function localizeLanguage(value: string | undefined, locale: AppLocale): string {
  if (!value) return locale === "bn" ? "বাংলা" : "Bangla";
  const key = value.toLowerCase();
  if (key === "bn" || key === "bangla") return locale === "bn" ? "বাংলা" : "Bangla";
  if (key === "en" || key === "english") return locale === "bn" ? "ইংরেজি" : "English";
  return value;
}
