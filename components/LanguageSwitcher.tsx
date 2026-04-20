"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, isPending } = useLanguage();
  const { t } = useAppTranslation();
  const id = useId();

  return (
    <div
      className={cn(
        "relative flex w-fit items-center rounded-full border border-white/10 bg-black/20 p-1 backdrop-blur-xl shadow-inner transition-colors",
        className
      )}
      aria-label={t("language.label")}
    >
      <Globe className="h-4 w-4 shrink-0 text-white/50 ml-2 mr-1" />
      <div className="relative flex items-center z-0">
        {["en", "bn"].map((lang) => {
          const isActive = locale === lang;
          return (
            <button
              key={lang}
              type="button"
              onClick={() => setLocale(lang as "en" | "bn")}
              disabled={isPending}
              className={cn(
                "relative z-10 rounded-full px-4 py-1.5 text-xs font-bold tracking-wider transition-colors duration-300 focus:outline-none",
                isActive ? "text-black" : "text-white/60 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId={`lang-indicator-${id}`}
                  className="absolute inset-0 z-[-1] rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{t(`language.${lang}`)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
