"use client";

import { useEffect, useTransition } from "react";
import { Globe } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { getStoredLocale, setClientLocale } from "@/lib/i18n-client";
import { normalizeLocale, type AppLocale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  className,
  variant = "compact",
}: {
  className?: string;
  variant?: "compact" | "full";
}) {
  const t = useTranslations("common");
  const locale = normalizeLocale(useLocale());
  const router = useRouter();
  const [, startTransition] = useTransition();

  useEffect(() => {
    const stored = getStoredLocale();
    if (stored && stored !== locale) {
      setClientLocale(stored);
      startTransition(() => {
        router.refresh();
      });
    }
  }, [locale, router, startTransition]);

  function handleToggle() {
    const nextLocale: AppLocale = locale === "en" ? "bn" : "en";
    setClientLocale(nextLocale);
    startTransition(() => {
      router.refresh();
    });
  }

  if (variant === "full") {
    return (
      <button
        onClick={handleToggle}
        className={cn(
          "flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary py-2 px-4",
          className,
        )}
      >
        <Globe className="w-4 h-4" />
        {locale === "en" ? t("actions.switch_to_bn") : t("actions.switch_to_en")}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "flex items-center gap-1.5 text-sm font-medium transition-colors cursor-pointer hover:text-primary",
        className,
      )}
      aria-label={locale === "en" ? t("actions.switch_to_bn") : t("actions.switch_to_en")}
    >
      <Globe className="w-4 h-4" />
      {locale.toUpperCase()}
    </button>
  );
}
