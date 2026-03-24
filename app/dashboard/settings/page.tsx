"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Save, ShieldCheck, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import {
  getStudentAccessToken,
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
} from "@/lib/student-api";

export default function SettingsPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    status: "active" as "active" | "inactive",
    enrolled_courses_count: 0,
  });
  const [learningStats, setLearningStats] = useState({
    lessonsCompleted: 0,
    certificates: 0,
    completionRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.settingsAuthRequired"));
      setLoading(false);
      return;
    }

    void (async () => {
      try {
        const [profileData, dashboardData] = await Promise.all([
          getStudentProfile(token),
          getStudentDashboard(token, locale),
        ]);

        setProfile({
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone || "",
          status: profileData.status,
          enrolled_courses_count: profileData.enrolled_courses_count,
        });
        setLearningStats({
          lessonsCompleted: dashboardData.stats.total_lessons_completed,
          certificates: dashboardData.stats.issued_certificates,
          completionRate: dashboardData.stats.completion_rate,
        });
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : t("dashboard.loadProfileFailed"));
      } finally {
        setLoading(false);
      }
    })();
  }, [locale, t]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.settingsSaveAuthRequired"));
      return;
    }

    setSaving(true);
    setSaved(false);
    setError(null);

    try {
      const data = await updateStudentProfile(
        {
          name: profile.name,
          phone: profile.phone,
        },
        token,
      );

      setProfile((current) => ({
        ...current,
        name: data.name,
        phone: data.phone,
      }));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : t("dashboard.saveProfileFailed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)] md:px-8 md:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">{t("dashboard.settings")}</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-950">{t("dashboard.profileSettings")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">{t("dashboard.settingsSubtitle")}</p>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-[1.85rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)] md:p-8">
          <div className="mb-8 flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-[linear-gradient(135deg,rgba(241,2,76,0.12),rgba(81,74,137,0.22))] text-2xl font-bold uppercase text-primary">
              {(profile.name || "S").charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-950">{profile.name || t("common.student")}</h3>
              <p className="mt-1 text-sm text-slate-500">{profile.email || t("common.notAvailable")}</p>
            </div>
          </div>

          {saved ? (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {t("dashboard.profileUpdated")}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">{t("login.fullName")}</label>
                <input
                  required
                  minLength={2}
                  disabled={loading}
                  value={profile.name}
                  onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">{t("login.email")}</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">{t("login.phoneOptional")}</label>
              <input
                disabled={loading}
                value={profile.phone}
                onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <Button
              type="submit"
              disabled={saving || loading}
              className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
            >
              <Save className="mr-2 h-4 w-4" />
              {saving ? t("dashboard.saving") : t("dashboard.saveChanges")}
            </Button>
          </form>
        </article>

        <div className="space-y-6">
          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <UserCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t("dashboard.accountStatus")}</p>
                <h3 className="text-xl font-bold text-slate-950">{t("dashboard.profileOverview")}</h3>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-slate-500">{t("dashboard.membershipStatus")}</p>
                <p className="mt-1 font-semibold text-slate-950">
                  {profile.status === "inactive" ? t("dashboard.accountInactive") : t("dashboard.accountActive")}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-slate-500">{t("dashboard.roleLabel")}</p>
                <p className="mt-1 font-semibold text-slate-950">{t("dashboard.roleStudent")}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-slate-500">{t("dashboard.enrolledCourses")}</p>
                <p className="mt-1 font-semibold text-slate-950">{profile.enrolled_courses_count}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t("dashboard.learningPortfolio")}</p>
                <h3 className="text-xl font-bold text-slate-950">{t("dashboard.learningSummary")}</h3>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">{t("dashboard.lessonsCompleted")}</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{loading ? "-" : learningStats.lessonsCompleted}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <p className="text-sm text-slate-500">{t("dashboard.certificates")}</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{loading ? "-" : learningStats.certificates}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4 sm:col-span-2">
                <p className="text-sm text-slate-500">{t("dashboard.completionRate")}</p>
                <p className="mt-1 text-2xl font-bold text-slate-950">{loading ? "-" : `${Math.round(learningStats.completionRate)}%`}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{t("dashboard.accountStatus")}</p>
                <h3 className="text-xl font-bold text-slate-950">{t("dashboard.quickActions")}</h3>
              </div>
            </div>
            <div className="space-y-3">
              <Button asChild variant="outline" className="w-full justify-between rounded-full border-slate-200">
                <Link href="/dashboard/courses">
                  {t("dashboard.viewRoadmap")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-between rounded-full border-slate-200">
                <Link href="/courses">
                  {t("dashboard.browseCatalog")}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
