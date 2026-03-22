"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { cn } from "@/lib/utils";
import {
  clearStudentSession,
  getStudentAccessToken,
  getStudentProfile,
  type StudentProfile,
} from "@/lib/student-api";
import { useAppTranslation } from "@/contexts/LanguageContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useAppTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const sidebarLinks = [
    { href: "/dashboard", label: t("dashboard.overview"), icon: LayoutDashboard },
    { href: "/dashboard/courses", label: t("dashboard.myCourses"), icon: BookOpen },
    { href: "/dashboard/settings", label: t("dashboard.settings"), icon: Settings },
  ];

  useEffect(() => {
    const token = getStudentAccessToken();
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`);
      return;
    }

    void (async () => {
      try {
        const data = await getStudentProfile(token);
        setProfile(data);
      } catch {
        clearStudentSession();
        router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`);
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [pathname, router]);

  function handleLogout() {
    clearStudentSession();
    router.replace("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="fixed z-40 hidden h-full w-64 flex-col border-r border-slate-100 bg-white lg:flex">
        <div className="border-b border-slate-100 p-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg font-bold text-white">
              AP
            </div>
            <span className="text-lg font-bold text-slate-900">
              {t("brand.line1")} <span className="text-primary">{t("brand.line2")}</span>
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-slate-600 hover:bg-slate-50",
              )}
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-100 p-4">
          <LanguageSwitcher
            className="mb-3 border-slate-200 bg-slate-100 text-slate-700"
            inactiveClassName="text-slate-600 hover:text-slate-900"
          />
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
          >
            <LogOut className="h-5 w-5" /> {t("dashboard.logOut")}
          </button>
          <Link
            href="/"
            className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50"
          >
            {t("common.backToWebsite")}
          </Link>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white shadow-2xl animate-in slide-in-from-left">
            <div className="flex items-center justify-between border-b border-slate-100 p-6">
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-bold text-white">
                  AP
                </div>
                <span className="text-sm font-bold">{t("dashboard.dashboardTitle")}</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-1 p-4">
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-slate-600 hover:bg-slate-50",
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-slate-100 p-4">
              <LanguageSwitcher
                className="mb-3 border-slate-200 bg-slate-100 text-slate-700"
                inactiveClassName="text-slate-600 hover:text-slate-900"
              />
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-4 backdrop-blur-md md:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-slate-900">{t("dashboard.dashboardTitle")}</h1>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher
              className="hidden border-slate-200 bg-slate-100 text-slate-700 md:inline-flex"
              inactiveClassName="text-slate-600 hover:text-slate-900"
            />
            <button className="relative rounded-full p-2 transition-colors hover:bg-slate-100">
              <Bell className="h-5 w-5 text-slate-500" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-bold text-primary">
                {profile?.name?.charAt(0).toUpperCase() || "S"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-semibold text-slate-900">
                  {loadingProfile ? t("dashboard.loadingProfile") : profile?.name || t("common.student")}
                </p>
                <p className="text-xs text-slate-500">
                  {loadingProfile
                    ? t("dashboard.fetchingProfile")
                    : profile?.email || t("common.notAvailable")}
                </p>
              </div>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
