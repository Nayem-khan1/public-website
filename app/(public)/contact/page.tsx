"use client";

import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useAppTranslation } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { t } = useAppTranslation();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PageHeader
        title={t("contact.headerTitle")}
        subtitle={t("contact.headerSubtitle")}
        bgImage="https://images.unsplash.com/photo-1423666639041-f142fcb93461?auto=format&fit=crop&q=80&w=2000"
      />

      <div className="container mx-auto px-4 md:px-6 py-10 md:py-16 md:-mt-20 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="bg-slate-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold font-display mb-8">
                {t("contact.contactInformation")}
              </h3>
              <ul className="space-y-8">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">{t("contact.ourLocation")}</h5>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {t("footer.addressLine1")}
                      <br />
                      {t("footer.addressLine2")}
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">{t("contact.phoneNumber")}</h5>
                    <p className="text-slate-300 text-sm">+880 1712 345678</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold mb-1">{t("contact.emailAddress")}</h5>
                    <p className="text-slate-300 text-sm">info@astronomypathshala.com</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="mt-12">
              <div className="w-full h-48 rounded-xl bg-slate-800 overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.262!2d90.3742!3d23.7461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ0JzQ2LjAiTiA5MMKwMjInMjIuMCJF!5e0!3m2!1sen!2sbd!4v1234567890"
                  className="w-full h-full border-0 opacity-70"
                  loading="lazy"
                  title={t("contact.locationMapTitle")}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold font-display text-slate-900 mb-6">
              {t("contact.sendUsMessage")}
            </h3>

            {submitted && (
              <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 font-medium">
                {t("contact.messageSent")}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("contact.yourName")}
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder={t("contact.namePlaceholder")}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("contact.emailAddress")}
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm({ ...form, email: event.target.value })}
                    placeholder={t("contact.emailPlaceholder")}
                    className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("contact.subject")}
                </label>
                <input
                  required
                  value={form.subject}
                  onChange={(event) => setForm({ ...form, subject: event.target.value })}
                  placeholder={t("contact.subjectPlaceholder")}
                  className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("contact.message")}
                </label>
                <textarea
                  required
                  value={form.message}
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder={t("contact.messagePlaceholder")}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/10 outline-none text-sm resize-none"
                />
              </div>
              <Button className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 h-12 rounded-xl shadow-lg shadow-primary/25">
                <Send className="w-4 h-4 mr-2" /> {t("contact.sendMessage")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
