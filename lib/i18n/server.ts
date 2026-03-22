import { cache } from "react";
import { cookies, headers } from "next/headers";
import { createInstance, type TFunction } from "i18next";
import { resources } from "@/locales/resources";
import {
  defaultLocale,
  getOpenGraphLocale,
  isLocale,
  localeCookieName,
  localeHeaderName,
  type Locale,
} from "./config";

const initTranslations = cache(async (locale: Locale) => {
  const instance = createInstance();

  await instance.init({
    resources,
    lng: locale,
    fallbackLng: defaultLocale,
    supportedLngs: ["en", "bn"],
    ns: ["common"],
    defaultNS: "common",
    interpolation: {
      escapeValue: false,
    },
    returnNull: false,
  });

  return instance;
});

export async function getRequestLocale(): Promise<Locale> {
  const requestHeaders = await headers();
  const headerLocale = requestHeaders.get(localeHeaderName);

  if (isLocale(headerLocale)) {
    return headerLocale;
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;

  if (isLocale(cookieLocale)) {
    return cookieLocale;
  }

  return defaultLocale;
}

export async function getTranslations(
  locale?: Locale,
): Promise<TFunction<"common", undefined>> {
  const activeLocale = locale ?? (await getRequestLocale());
  const instance = await initTranslations(activeLocale);
  return instance.getFixedT(activeLocale, "common");
}

export async function getLocaleAndTranslations(locale?: Locale) {
  const activeLocale = locale ?? (await getRequestLocale());
  const t = await getTranslations(activeLocale);

  return {
    locale: activeLocale,
    t,
  };
}

export function getLocalizedMetadataLocale(locale: Locale): string {
  return getOpenGraphLocale(locale);
}
