import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Users, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPublicEventBySlug } from "@/lib/public-api";
import { formatCurrency, formatDate, pickLocalizedText } from "@/lib/i18n";
import { getServerLocale, getServerTranslator } from "@/lib/i18n-server";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = getServerLocale();
  const event = await getPublicEventBySlug(slug, locale);
  if (!event) return {};

  const title = pickLocalizedText({
    locale,
    primary: event.title,
    en: event.title_en,
    bn: event.title_bn,
    fallback: "Untitled Event",
  });
  const description = pickLocalizedText({
    locale,
    primary: event.description,
    en: event.description_en,
    bn: event.description_bn,
    fallback: "",
  });

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = getServerLocale();
  const t = getServerTranslator(locale);
  const event = await getPublicEventBySlug(slug, locale);

  if (!event) {
    notFound();
  }

  const title = pickLocalizedText({
    locale,
    primary: event.title,
    en: event.title_en,
    bn: event.title_bn,
    fallback: "Untitled Event",
  });
  const description = pickLocalizedText({
    locale,
    primary: event.description,
    en: event.description_en,
    bn: event.description_bn,
    fallback: "",
  });
  const eventDate = event.event_date ? new Date(event.event_date) : new Date();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="relative pt-28 pb-20 md:pt-36 md:pb-28 bg-slate-900">
        <img
          src={
            event.banner ||
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000"
          }
          alt={title}
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900" />
        <div className="container relative mx-auto px-4 md:px-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("common.labels.back_to_events")}
          </Link>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-200">
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(eventDate, locale, { year: "numeric", month: "long", day: "2-digit" })}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatDate(eventDate, locale, { hour: "numeric", minute: "2-digit" })}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">
              {t("common.events.about")}
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-900 mb-4">{t("common.events.details")}</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="inline-flex items-center gap-2">
                <Ticket className="w-4 h-4 text-primary" />
                {t("common.events.registration_fee")}:{" "}
                {event.registration_fee && event.registration_fee > 0
                  ? formatCurrency(event.registration_fee, locale)
                  : t("common.labels.free")}
              </p>
              <p className="inline-flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary" />
                {t("common.events.max_participants")}: {event.max_participants ?? "N/A"}
              </p>
              <p className="inline-flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                {t("common.events.registered")}: {event.registered_count ?? 0}
              </p>
            </div>
            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white rounded-full">
              {t("common.actions.register_now")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
