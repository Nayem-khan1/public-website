"use client";

import { Globe2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher({
  className,
  activeClassName,
  inactiveClassName,
}: {
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}) {
  const { locale, setLocale, isPending } = useLanguage();
  const { t } = useAppTranslation();

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-2 py-1 backdrop-blur-md",
        className,
      )}
      aria-label={t("language.label")}
    >
      <Globe2 className="h-4 w-4 shrink-0" />
      <button
        type="button"
        onClick={() => setLocale("en")}
        disabled={isPending}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
          locale === "en"
            ? activeClassName || "bg-white text-slate-900"
            : inactiveClassName || "text-white/80 hover:text-white",
        )}
      >
        {t("language.en")}
      </button>
      <button
        type="button"
        onClick={() => setLocale("bn")}
        disabled={isPending}
        className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold transition-colors",
          locale === "bn"
            ? activeClassName || "bg-white text-slate-900"
            : inactiveClassName || "text-white/80 hover:text-white",
        )}
      >
        {t("language.bn")}
      </button>
    </div>
  );
}
