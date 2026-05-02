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
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import { useStudentSession } from "@/hooks/use-student-session";
import { formatNumber } from "@/lib/i18n/format";
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
  const { locale } = useLanguage();
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
    <div className="relative min-h-screen bg-slate-50/50 text-slate-900 selection:bg-primary/10 selection:text-primary">
      {/* Background Decorative Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 -left-1/4 w-1/2 h-1/2 bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] overflow-hidden border-r border-slate-800 bg-slate-950 text-slate-300 lg:flex lg:flex-col">
        <div className="flex h-16 shrink-0 items-center border-b border-slate-800 px-6">
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-white shadow-sm">
              AP
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-white">
                {t("brand.line1")} <span className="text-primary">{t("brand.line2")}</span>
              </p>
            </div>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-4 pb-6">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                  {profile?.name?.charAt(0) || "S"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-white">
                    {profile?.name || t("common.student")}
                  </p>
                  <p className="truncate text-xs text-slate-400">{profile?.email || t("common.notAvailable")}</p>
                </div>
              </div>
            </div>
          </div>

          <nav className="space-y-1 px-3">
            {sidebarLinks.map((link) => {
              const active = isLinkActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
                  )}
                >
                  <link.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-slate-400")} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-1 border-t border-slate-800 p-3">
          <div className="mb-2 px-3">
            <LanguageSwitcher
              className="h-8 w-fit border-slate-800 bg-slate-900 text-xs text-slate-400"
              activeClassName="bg-slate-800 text-white"
              inactiveClassName="text-slate-500 hover:text-slate-300"
            />
          </div>
          <Button asChild variant="ghost" className="w-full justify-start rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
            <Link href="/">
              <Globe className="mr-3 h-4 w-4" />
              {t("common.backToWebsite")}
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
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
          <div className="absolute inset-y-0 left-0 w-[280px] overflow-hidden bg-slate-950 text-slate-300 shadow-2xl flex flex-col">
            <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-6">
              <Link href="/dashboard" className="text-sm font-bold text-white tracking-tight" onClick={() => setSidebarOpen(false)}>
                {t("dashboard.dashboardTitle")}
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:bg-slate-800 hover:text-white">
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-6">
              <div className="px-4 pb-6">
                <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
                  <p className="text-sm font-medium text-white">{profile?.name || t("common.student")}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{profile?.email || t("common.notAvailable")}</p>
                </div>
              </div>
              
              <nav className="space-y-1 px-3">
                {sidebarLinks.map((link) => {
                  const active = isLinkActive(pathname, link.href);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active ? "bg-slate-800 text-white" : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200",
                      )}
                    >
                      <link.icon className={cn("h-4 w-4 shrink-0", active ? "text-primary" : "text-slate-400")} />
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
            
            <div className="space-y-1 border-t border-slate-800 p-3">
              <div className="mb-2 px-3">
                <LanguageSwitcher
                  className="h-8 w-fit border-slate-800 bg-slate-900 text-xs text-slate-400"
                  activeClassName="bg-slate-800 text-white"
                  inactiveClassName="text-slate-500 hover:text-slate-300"
                />
              </div>
              <Button asChild variant="ghost" className="w-full justify-start rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200">
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
                className="w-full justify-start rounded-lg px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              >
                <LogOut className="mr-3 h-4 w-4" />
                {t("dashboard.logOut")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold text-slate-900">{currentLink.label}</h1>
            </div>
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm" className="hidden border-slate-200 bg-slate-50 text-slate-600 sm:inline-flex hover:bg-slate-100 hover:text-slate-900">
                <Link href="/courses">{t("dashboard.browseCatalog")}</Link>
              </Button>
              <div className="hidden items-center gap-3 sm:flex">
                <div className="h-8 w-px bg-slate-200" />
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white">
                  {profile?.name?.charAt(0) || "S"}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      </div>
    </div>
  );
}
