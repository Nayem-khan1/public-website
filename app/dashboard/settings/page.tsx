"use client";

import { FormEvent, useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getStudentAccessToken,
  getStudentProfile,
  updateStudentProfile,
} from "@/lib/student-api";
import { useAppTranslation } from "@/contexts/LanguageContext";

export default function SettingsPage() {
  const { t } = useAppTranslation();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [bio, setBio] = useState("");
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
        const data = await getStudentProfile(token);
        setProfile({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : t("dashboard.loadProfileFailed"));
      } finally {
        setLoading(false);
      }
    })();
  }, [t]);

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
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : t("dashboard.saveProfileFailed"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-2xl font-bold text-slate-900">{t("dashboard.profileSettings")}</h2>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-2xl font-bold text-primary">
            {(profile.name || "S").charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {profile.name || t("common.student")}
            </h3>
            <p className="text-sm text-slate-500">{profile.email || t("common.notAvailable")}</p>
          </div>
        </div>

        {saved ? (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 font-medium text-green-700">
            {t("dashboard.profileUpdated")}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t("login.fullName")}
              </label>
              <input
                required
                disabled={loading}
                value={profile.name}
                onChange={(event) =>
                  setProfile((current) => ({ ...current, name: event.target.value }))
                }
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                {t("login.email")}
              </label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-100 px-4 text-sm text-slate-500 outline-none"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("login.phoneOptional")}
            </label>
            <input
              disabled={loading}
              value={profile.phone}
              onChange={(event) =>
                setProfile((current) => ({ ...current, phone: event.target.value }))
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              {t("dashboard.bio")}
            </label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={3}
              placeholder={t("dashboard.bioPlaceholder")}
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <Button
            type="submit"
            disabled={saving || loading}
            className="h-12 rounded-xl bg-primary px-8 text-white shadow-lg shadow-primary/25 hover:bg-primary/90"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? t("dashboard.saving") : t("dashboard.saveChanges")}
          </Button>
        </form>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <h3 className="mb-6 text-lg font-bold text-slate-900">
          {t("dashboard.notificationPreferences")}
        </h3>
        <div className="space-y-4">
          {[
            { label: t("dashboard.emailNotifications"), checked: true },
            { label: t("dashboard.smsReminders"), checked: false },
            { label: t("dashboard.weeklyNewsletter"), checked: true },
          ].map((preference) => (
            <label key={preference.label} className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                defaultChecked={preference.checked}
                className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary/20"
              />
              <span className="text-sm text-slate-700">{preference.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
