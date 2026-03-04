"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

export default function SettingsPage() {
    const [profile, setProfile] = useState({
        name: "Arian Rahman",
        email: "arian@example.com",
        phone: "+880 1712 000000",
        bio: "Astronomy enthusiast and Olympiad aspirant from Dhaka.",
    });
    const [saved, setSaved] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-2xl space-y-8">
            <h2 className="text-2xl font-display font-bold text-slate-900">Profile Settings</h2>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl font-bold text-primary">
                        {profile.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-lg">{profile.name}</h3>
                        <p className="text-sm text-slate-500">{profile.email}</p>
                        <button className="text-sm text-primary font-semibold mt-1 hover:underline">Change photo</button>
                    </div>
                </div>

                {saved && (
                    <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 font-medium">
                        ✓ Profile updated successfully!
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                            <input
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={profile.email}
                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
                        <input
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm resize-none"
                        />
                    </div>
                    <Button type="submit" className="bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-xl shadow-lg shadow-primary/25">
                        <Save className="w-4 h-4 mr-2" /> Save Changes
                    </Button>
                </form>
            </div>

            {/* Notification preferences */}
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-slate-900 text-lg mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                    {[
                        { label: "Email notifications for new courses", checked: true },
                        { label: "SMS reminders for live classes", checked: false },
                        { label: "Weekly newsletter", checked: true },
                    ].map((pref, i) => (
                        <label key={i} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked={pref.checked} className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary/20" />
                            <span className="text-sm text-slate-700">{pref.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
