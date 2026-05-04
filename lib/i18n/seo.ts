import type { Metadata } from "next";
import { getSiteUrl as getConfiguredSiteUrl } from "@/lib/env";
import type { Locale } from "./config";

function normalizePathname(pathname: string): string {
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function getSiteUrl(): string {
  return getConfiguredSiteUrl();
}

export function getLocalizedPath(pathname: string, locale: Locale): string {
  const url = new URL(normalizePathname(pathname), "http://localhost");
  url.searchParams.set("lang", locale);
  return `${url.pathname}${url.search}`;
}

export function getLocalizedAbsoluteUrl(pathname: string, locale: Locale): string {
  return new URL(getLocalizedPath(pathname, locale), getSiteUrl()).toString();
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
