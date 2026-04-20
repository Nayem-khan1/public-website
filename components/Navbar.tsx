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
                  isScrolled ? "text-white" : "text-white",
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

          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher className="shadow-[0_0_15px_rgba(0,0,0,0.2)]" />

            <div className="w-[1px] h-6 bg-white/15 mx-2"></div>

            <Button
              asChild
              variant="outline"
              className="bg-transparent border border-white/20 text-white/90 rounded-full px-6 h-10 hover:bg-white/10 hover:text-white hover:border-white/30 backdrop-blur-md transition-all duration-300 font-semibold"
            >
              <Link href="/login">{t("nav.logIn")}</Link>
            </Button>
            
            <Button
              asChild
              className="relative overflow-hidden bg-gradient-to-r from-primary to-rose-500 border border-primary/40 hover:bg-primary text-white shadow-[0_0_20px_rgba(241,2,76,0.4)] hover:shadow-[0_0_30px_rgba(241,2,76,0.6)] rounded-full px-8 h-10 transition-all duration-500 group"
            >
              <Link href="/dashboard">
                <span className="relative z-10 font-bold tracking-wide">{t("nav.getStarted")}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
              </Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "lg:hidden transition-colors text-white hover:bg-white/10"
            )}
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-7 h-7" />
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px] transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 w-[85%] sm:w-[380px] h-full bg-[#0d101b]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                    AP
                  </div>
                  <span className="font-display font-bold text-lg text-white">
                    {t("brand.line1")}{" "}
                    <span className="text-primary">{t("brand.line2")}</span>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  className="text-white/70 hover:bg-white/10 hover:text-white rounded-full"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "text-lg font-semibold py-3 px-5 rounded-[1rem] transition-colors",
                      isActive(link.href)
                        ? "text-white bg-primary/20 border border-primary/30 shadow-[0_0_15px_rgba(241,2,76,0.1)]"
                        : "text-white/70 hover:text-white hover:bg-white/5",
                    )}
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>

              <div className="h-px bg-white/10 my-8" />

              <div className="flex flex-col gap-4">
                <LanguageSwitcher className="w-full justify-center" />
                
                <Button
                  asChild
                  className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-rose-500 border border-primary/40 text-white h-12 rounded-full shadow-[0_0_20px_rgba(241,2,76,0.4)] group"
                >
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                    <span className="relative z-10 font-bold text-base tracking-wide">{t("nav.getStarted")}</span>
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out z-0" />
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full bg-transparent border-white/20 text-white h-12 rounded-full hover:bg-white/10 hover:text-white font-semibold text-base transition-colors"
                >
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
