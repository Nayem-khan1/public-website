"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next, useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { resources } from "@/locales/resources";
import {
  defaultLocale,
  isLocale,
  localeCookieName,
  localeStorageKey,
  type Locale,
} from "@/lib/i18n/config";

type Language = "EN" | "BN";

interface LanguageContextType {
  locale: Locale;
  language: Language;
  isPending: boolean;
  setLocale: (locale: Locale) => void;
  setLanguage: (language: Language | Locale) => void;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function normalizeLanguage(value: Language | Locale): Locale {
  if (value === "EN") return "en";
  if (value === "BN") return "bn";
  return value;
}

function persistLocale(locale: Locale) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(localeStorageKey, locale);
  document.cookie = `${localeCookieName}=${locale}; Path=/; Max-Age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  document.documentElement.lang = locale;
}

function createI18nInstance(locale: Locale) {
  const instance = createInstance();

  void instance.use(initReactI18next).init({
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
    react: {
      useSuspense: false,
    },
  });

  return instance;
}

export function LanguageProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: Locale;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [isPending, startTransition] = useTransition();
  const [i18n] = useState(() => createI18nInstance(initialLocale));

  useEffect(() => {
    persistLocale(locale);
    void i18n.changeLanguage(locale);
  }, [i18n, locale]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedLocale = window.localStorage.getItem(localeStorageKey);
    if (!isLocale(storedLocale) || storedLocale === locale) {
      persistLocale(locale);
      return;
    }

    persistLocale(storedLocale);
    void i18n.changeLanguage(storedLocale);
    startTransition(() => {
      setLocaleState(storedLocale);
      router.refresh();
    });
  }, [i18n, locale, router]);

  function updateLocale(value: Language | Locale) {
    const nextLocale = normalizeLanguage(value);
    if (nextLocale === locale) {
      persistLocale(nextLocale);
      return;
    }

    setLocaleState(nextLocale);
    persistLocale(nextLocale);
    void i18n.changeLanguage(nextLocale);
    startTransition(() => {
      router.refresh();
    });
  }

  function toggleLanguage() {
    updateLocale(locale === "en" ? "bn" : "en");
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        language: locale === "bn" ? "BN" : "EN",
        isPending,
        setLocale: updateLocale,
        setLanguage: updateLocale,
        toggleLanguage,
      }}
    >
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export function useAppTranslation() {
  return useTranslation("common");
}
