export const supportedLocales = ["en", "bn"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";
export const localeCookieName = "ap_locale";
export const localeStorageKey = "ap_locale";
export const localeHeaderName = "x-ap-locale";

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "bn";
}

export function getIntlLocale(locale: Locale): string {
  return locale === "bn" ? "bn-BD" : "en-US";
}

export function getOpenGraphLocale(locale: Locale): string {
  return locale === "bn" ? "bn_BD" : "en_US";
}
