import { getIntlLocale, type Locale } from "./config";

export function formatNumber(value: number, locale: Locale): string {
  return value.toLocaleString(getIntlLocale(locale));
}

export function formatCurrency(value: number, locale: Locale): string {
  const prefix = locale === "bn" ? "৳" : "BDT";
  return `${prefix} ${formatNumber(value, locale)}`;
}

export function formatDate(
  value: Date | string | number,
  locale: Locale,
  options: Intl.DateTimeFormatOptions,
): string {
  return new Intl.DateTimeFormat(getIntlLocale(locale), options).format(
    new Date(value),
  );
}

export function formatShortMonth(value: Date | string | number, locale: Locale): string {
  return formatDate(value, locale, {
    month: "short",
  });
}

export function formatDayOfMonth(
  value: Date | string | number,
  locale: Locale,
): string {
  return formatDate(value, locale, {
    day: "2-digit",
  });
}
