"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import { StudentAccountMenu, studentAccountLinks } from "@/components/navigation/student-account-menu";
import { useAppTranslation } from "@/contexts/LanguageContext";
import { useStudentSession } from "@/hooks/use-student-session";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
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
  const { profile, isLoading, isAuthenticated, logout } = useStudentSession();

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
          "fixed top-0 z-50 w-full border-b transition-all duration-300",
          isScrolled
            ? "border-white/10 bg-slate-950/80 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
            : "border-transparent bg-transparent py-5",
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary via-purple-600 to-secondary text-xl font-bold text-white shadow-lg shadow-primary/20 transition-all duration-300 group-hover:scale-105">
              AP
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm font-bold text-white">
                {t("brand.line1")}
              </span>
              <span className="font-display text-sm font-bold text-primary">
                {t("brand.line2")}
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-primary",
                  isActive(link.href) ? "text-primary" : "text-white/80",
                )}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <LanguageSwitcher className="shadow-[0_0_15px_rgba(0,0,0,0.2)]" />
            <div className="mx-2 h-6 w-px bg-white/15" />

            {isAuthenticated && profile ? (
              <StudentAccountMenu
                profile={{
                  name: profile.name,
                  email: profile.email,
                  avatar: profile.avatar,
                }}
                onLogout={logout}
              />
            ) : isLoading ? (
              <div className="h-11 w-[176px] rounded-full border border-white/10 bg-white/10" />
            ) : (
              <Button
                asChild
                variant="outline"
                className="h-10 rounded-full border border-white/20 bg-transparent px-6 font-semibold text-white/90 backdrop-blur-md transition-all duration-300 hover:border-white/30 hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">{t("nav.logIn")}</Link>
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-white transition-colors hover:bg-white/10 lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="h-7 w-7" />
          </Button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[85%] border-l border-white/10 bg-[#0d101b]/95 shadow-2xl backdrop-blur-2xl animate-in slide-in-from-right duration-300 sm:w-[380px]">
            <div className="p-6">
              <div className="mb-8 flex items-center justify-between">
                <Link href="/" className="group flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white shadow-lg transition-transform group-hover:scale-105">
                    AP
                  </div>
                  <span className="font-display text-lg font-bold text-white">
                    {t("brand.line1")}{" "}
                    <span className="text-primary">{t("brand.line2")}</span>
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full text-white/70 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "rounded-[1rem] px-5 py-3 text-lg font-semibold transition-colors",
                      isActive(link.href)
                        ? "border border-primary/30 bg-primary/20 text-white shadow-[0_0_15px_rgba(241,2,76,0.1)]"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                    )}
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </div>

              <div className="my-8 h-px bg-white/10" />

              <div className="space-y-4">
                <LanguageSwitcher className="w-full justify-center" />

                {isAuthenticated && profile ? (
                  <>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
                      <p className="text-base font-semibold text-white">{profile.name}</p>
                      <p className="mt-1 text-sm text-white/60">{profile.email}</p>
                    </div>

                    <div className="space-y-2">
                      {studentAccountLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMobileOpen(false)}
                          className="flex items-center gap-3 rounded-[1rem] border border-white/8 bg-white/5 px-4 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <link.icon className="h-4 w-4" />
                          {t(link.labelKey)}
                        </Link>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-[1rem] border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition-colors hover:bg-rose-500/15"
                      >
                        <LogOut className="h-4 w-4" />
                        {t("dashboard.logOut")}
                      </button>
                    </div>
                  </>
                ) : (
                  <Button
                    asChild
                    className="group relative h-12 w-full overflow-hidden rounded-full border border-primary/40 bg-gradient-to-r from-primary to-rose-500 text-white shadow-[0_0_20px_rgba(241,2,76,0.4)]"
                  >
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      <span className="relative z-10 text-base font-bold tracking-wide">
                        {t("nav.logIn")}
                      </span>
                      <span className="absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
