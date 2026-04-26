"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Award,
  BarChart3,
  BookOpen,
  Globe,
  LayoutDashboard,
  LogOut,
  Menu,
  ReceiptText,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAppTranslation } from "@/contexts/LanguageContext";
import { useStudentSession } from "@/hooks/use-student-session";
import { cn } from "@/lib/utils";

const NAV_ICON_CLASS = "h-5 w-5 shrink-0";

function isLinkActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { t } = useAppTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { profile, isLoading, isAuthenticated, logout } = useStudentSession();

  const sidebarLinks = [
    { href: "/dashboard", label: t("dashboard.overview"), icon: LayoutDashboard },
    { href: "/dashboard/courses", label: t("dashboard.myCourses"), icon: BookOpen },
    { href: "/dashboard/certificates", label: t("dashboard.certificates"), icon: Award },
    { href: "/dashboard/report", label: t("dashboard.learningReport"), icon: BarChart3 },
    { href: "/dashboard/orders", label: t("dashboard.paymentOrders"), icon: ReceiptText },
    { href: "/dashboard/settings", label: t("dashboard.settings"), icon: Settings },
  ];

  const currentLink =
    sidebarLinks.find((link) => isLinkActive(pathname, link.href)) ?? sidebarLinks[0];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  function handleLogout() {
    logout();
    router.replace("/login");
  }

  if (isLoading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(81,74,137,0.22),transparent_45%),linear-gradient(180deg,#0f172a_0%,#111827_100%)] px-6 text-white">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold">{t("dashboard.dashboardTitle")}</h1>
          <p className="mt-3 text-sm text-white/70">{t("dashboard.loadingDashboard")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[296px] overflow-hidden border-r border-white/10 bg-[radial-gradient(circle_at_top,rgba(241,2,76,0.2),transparent_35%),radial-gradient(circle_at_bottom,rgba(81,74,137,0.3),transparent_40%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white lg:flex lg:flex-col">
        <div className="border-b border-white/10 px-7 py-7">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold shadow-lg shadow-black/20 backdrop-blur-md">
              AP
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-white/50">{t("dashboard.dashboardLabel")}</p>
              <p className="text-lg font-bold text-white">
                {t("brand.line1")} <span className="text-primary">{t("brand.line2")}</span>
              </p>
            </div>
          </Link>
        </div>

        <div className="px-6 pt-6">
          <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-5 backdrop-blur-xl">
            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold uppercase text-white">
                {profile?.name?.charAt(0) || "S"}
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-white">
                  {profile?.name || t("common.student")}
                </p>
                <p className="truncate text-sm text-white/60">{profile?.email || t("common.notAvailable")}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-white/8 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">{t("dashboard.enrolledCourses")}</p>
                <p className="mt-1 text-xl font-semibold text-white">{profile?.enrolled_courses_count ?? 0}</p>
              </div>
              <div className="rounded-2xl bg-white/8 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/45">{t("dashboard.accountStatus")}</p>
                <p className="mt-1 text-xl font-semibold text-white">
                  {profile?.status === "inactive" ? t("dashboard.accountInactive") : t("dashboard.accountActive")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-5 py-6">
          {sidebarLinks.map((link) => {
            const active = isLinkActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
                  active
                    ? "bg-white text-slate-950 shadow-[0_18px_40px_-24px_rgba(255,255,255,0.65)]"
                    : "text-white/70 hover:bg-white/8 hover:text-white",
                )}
              >
                <link.icon className={NAV_ICON_CLASS} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 border-t border-white/10 px-5 py-5">
          <LanguageSwitcher
            className="w-fit border-white/10 bg-white/10 text-white"
            activeClassName="bg-white text-slate-950"
            inactiveClassName="text-white/70 hover:text-white"
          />
          <Button asChild variant="ghost" className="w-full justify-start rounded-2xl px-4 text-white/70 hover:bg-white/8 hover:text-white">
            <Link href="/">
              <Globe className="mr-3 h-4 w-4" />
              {t("common.backToWebsite")}
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start rounded-2xl px-4 text-white/70 hover:bg-white/8 hover:text-white"
          >
            <LogOut className="mr-3 h-4 w-4" />
            {t("dashboard.logOut")}
          </Button>
        </div>
      </aside>

      {sidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-[300px] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(241,2,76,0.2),transparent_35%),radial-gradient(circle_at_bottom,rgba(81,74,137,0.3),transparent_40%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] p-5 text-white shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Link href="/dashboard" className="text-lg font-bold" onClick={() => setSidebarOpen(false)}>
                {t("dashboard.dashboardTitle")}
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-white hover:bg-white/10 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/8 p-4">
              <p className="text-base font-semibold text-white">{profile?.name || t("common.student")}</p>
              <p className="mt-1 text-sm text-white/60">{profile?.email || t("common.notAvailable")}</p>
            </div>
            <nav className="space-y-2">
              {sidebarLinks.map((link) => {
                const active = isLinkActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
                      active ? "bg-white text-slate-950" : "text-white/70 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <link.icon className={NAV_ICON_CLASS} />
                    {link.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-6 space-y-3 border-t border-white/10 pt-5">
              <LanguageSwitcher
                className="w-fit border-white/10 bg-white/10 text-white"
                activeClassName="bg-white text-slate-950"
                inactiveClassName="text-white/70 hover:text-white"
              />
              <Button asChild variant="ghost" className="w-full justify-start rounded-2xl px-4 text-white/70 hover:bg-white/8 hover:text-white">
                <Link href="/" onClick={() => setSidebarOpen(false)}>
                  <Globe className="mr-3 h-4 w-4" />
                  {t("common.backToWebsite")}
                </Link>
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  handleLogout();
                  setSidebarOpen(false);
                }}
                className="w-full justify-start rounded-2xl px-4 text-white/70 hover:bg-white/8 hover:text-white"
              >
                <LogOut className="mr-3 h-4 w-4" />
                {t("dashboard.logOut")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[296px]">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{t("dashboard.dashboardLabel")}</p>
                <h1 className="text-xl font-bold text-slate-950">{currentLink.label}</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild variant="outline" className="hidden rounded-full border-slate-200 sm:inline-flex">
                <Link href="/courses">{t("dashboard.browseCatalog")}</Link>
              </Button>
              <div className="hidden items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 sm:flex">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,rgba(241,2,76,0.12),rgba(81,74,137,0.22))] text-sm font-bold uppercase text-primary">
                  {profile?.name?.charAt(0) || "S"}
                </div>
                <div className="max-w-[180px]">
                  <p className="truncate text-sm font-semibold text-slate-900">{profile?.name || t("common.student")}</p>
                  <p className="truncate text-xs text-slate-500">{profile?.email || t("common.notAvailable")}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
