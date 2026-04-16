"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useAppTranslation } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

const navLinks = [
  { href: "/", labelKey: "nav.home" },
  { href: "/courses", labelKey: "nav.courses" },
  { href: "/events", labelKey: "nav.events" },
  { href: "/blog", labelKey: "nav.blog" },
  { href: "/team", labelKey: "nav.team" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/contact", labelKey: "nav.contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useAppTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b",
          isScrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-white/10 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent border-transparent py-5",
        )}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-purple-600 to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-all duration-300">
              AP
            </div>
            <div className="flex flex-col leading-tight">
              <span
                className={cn(
                  "text-sm font-bold font-display transition-colors",
                  isScrolled ? "text-slate-900" : "text-white",
                )}
              >
                {t("brand.line1")}
              </span>
              <span className="text-sm font-bold font-display text-primary">
                {t("brand.line2")}
              </span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-primary",
                  isActive(link.href)
                    ? "text-primary"
                    : "text-white/80"
                )}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher
              className="border-white/15 bg-white/10 text-white/90 hover:bg-white/20 transition-all"
              activeClassName="bg-primary text-white font-semibold"
              inactiveClassName="text-white/70 hover:text-white"
            />

            <Button
              asChild
              variant="ghost"
              className={cn(
                "font-semibold transition-colors text-white/90 hover:bg-white/10 hover:text-white"
              )}
            >
              <Link href="/login">{t("nav.logIn")}</Link>
            </Button>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 rounded-full px-6"
            >
              <Link href="/dashboard">{t("nav.getStarted")}</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden transition-colors text-white/90 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 w-[300px] sm:w-[380px] h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">
                    AP
                  </div>
                  <span className="font-display font-bold text-lg text-slate-900">
                    {t("brand.line1")}
                    <span className="text-primary">{t("brand.line2")}</span>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  className="text-slate-500"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "text-lg font-semibold py-3 px-4 rounded-xl transition-colors",
                      isActive(link.href)
                        ? "text-primary bg-primary/5"
                        : "text-slate-600 hover:bg-slate-50",
                    )}
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-slate-100 my-6" />

              <div className="flex flex-col gap-3">
                <LanguageSwitcher
                  className="w-fit border-slate-200 bg-slate-100 text-slate-700"
                  inactiveClassName="text-slate-600 hover:text-slate-900"
                />
                <Button
                  asChild
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-full"
                >
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    {t("nav.getStarted")}
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full rounded-full">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    {t("nav.logIn")}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
