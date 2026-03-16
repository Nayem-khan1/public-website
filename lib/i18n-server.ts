import { cookies } from "next/headers";
import { createTranslator } from "next-intl";
import { DEFAULT_LOCALE, LOCALE_COOKIE, getMessages, normalizeLocale, type AppLocale } from "@/lib/i18n";

export function getServerLocale(): AppLocale {
  const cookieStore = cookies();
  const stored =
    cookieStore.get(LOCALE_COOKIE)?.value ||
    cookieStore.get("NEXT_LOCALE")?.value ||
    DEFAULT_LOCALE;
  return normalizeLocale(stored);
}

export function getServerTranslator(locale: AppLocale) {
  return createTranslator({ locale, messages: getMessages(locale) });
}
