import type { Metadata } from "next";
import type { Locale } from "./config";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

function normalizePathname(pathname: string): string {
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getSiteUrl(): string {
  return siteUrl;
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
  const url = new URL(normalizePathname(pathname), "http://localhost");
  url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}`;
}

export function getLocalizedAbsoluteUrl(pathname: string, locale: Locale): string {
  return new URL(getLocalizedPath(pathname, locale), siteUrl).toString();
}

export function buildMetadataAlternates(
  pathname: string,
  locale: Locale,
): Metadata["alternates"] {
  return {
    canonical: getLocalizedPath(pathname, locale),
    languages: {
      en: getLocalizedPath(pathname, "en"),
      bn: getLocalizedPath(pathname, "bn"),
    },
  };
}
