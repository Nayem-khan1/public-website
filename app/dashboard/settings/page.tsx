"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import {
  getStudentAccessToken,
  getStudentProfile,
  updateStudentProfile,
} from "@/lib/student-api";

export default function SettingsPage() {
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
      setError("Please log in to edit your settings.");
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
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getStudentAccessToken();
    if (!token) {
      setError("Please log in to save profile changes.");
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
      setError(err instanceof Error ? err.message : "Failed to save profile");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      <h2 className="text-2xl font-display font-bold text-slate-900">Profile Settings</h2>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-primary">
            {(profile.name || "S").charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{profile.name || "Student"}</h3>
            <p className="text-sm text-slate-500">{profile.email || "student@example.com"}</p>
          </div>
        </div>

        {saved ? (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 font-medium">
            Profile updated successfully.
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                required
                disabled={loading}
                value={profile.name}
                onChange={(event) =>
                  setProfile((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full h-12 px-4 rounded-xl bg-slate-100 border border-slate-200 outline-none text-sm text-slate-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            <input
              disabled={loading}
              value={profile.phone}
              onChange={(event) =>
                setProfile((current) => ({ ...current, phone: event.target.value }))
              }
              className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              rows={3}
              placeholder="Optional personal note (saved locally in this browser)."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={saving || loading}
            className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-xl shadow-lg shadow-primary/25"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="font-bold text-slate-900 text-lg mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { label: "Email notifications for new courses", checked: true },
            { label: "SMS reminders for live classes", checked: false },
            { label: "Weekly newsletter", checked: true },
          ].map((pref) => (
            <label key={pref.label} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={pref.checked}
                className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20"
              />
              <span className="text-sm text-slate-700">{pref.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
