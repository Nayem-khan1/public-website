import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Ticket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/i18n/format";
import {
  getLocalizedEventText,
  getPublicEventBySlug,
} from "@/lib/public-api";
import {
  getLocaleAndTranslations,
  getLocalizedMetadataLocale,
  getRequestLocale,
} from "@/lib/i18n/server";
import {
  buildMetadataAlternates,
  getLocalizedAbsoluteUrl,
} from "@/lib/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const locale = await getRequestLocale();
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug, locale);
  const { t } = await getLocaleAndTranslations(locale);

  if (!event) {
    return {
      title: t("events.untitled"),
      alternates: buildMetadataAlternates(`/events/${slug}`, locale),
    };
  }

  const localized = getLocalizedEventText(event, locale);
  const title = localized.title || t("events.untitled");
  const description = localized.description;

  return {
    title,
    description,
    alternates: buildMetadataAlternates(`/events/${slug}`, locale),
    openGraph: {
      title,
      description,
      locale: getLocalizedMetadataLocale(locale),
      url: getLocalizedAbsoluteUrl(`/events/${slug}`, locale),
      images: event.banner ? [{ url: event.banner }] : undefined,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getRequestLocale();
  const { t } = await getLocaleAndTranslations(locale);
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug, locale);

  if (!event) {
    notFound();
  }

  const localized = getLocalizedEventText(event, locale);
  const title = localized.title || t("events.untitled");
  const description = localized.description;
  const eventDate = event.event_date ? new Date(event.event_date) : new Date();

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="relative bg-slate-900 pb-20 pt-28 md:pb-28 md:pt-36">
        <img
          src={
            event.banner ||
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000"
          }
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 to-slate-900" />
        <div className="container relative mx-auto px-4 md:px-6">
          <Link
            href="/events"
            className="mb-8 inline-flex items-center gap-2 text-slate-300 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("events.backToEvents")}
          </Link>
          <h1 className="mb-4 text-3xl font-bold text-white md:text-5xl">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-200">
            <span className="inline-flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {formatDate(eventDate, locale, {
                month: "long",
                day: "2-digit",
                year: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {formatDate(eventDate, locale, {
                hour: "numeric",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 md:px-6">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm lg:col-span-2">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              {t("events.aboutEvent")}
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-slate-600">
              {description}
            </p>
          </div>

          <div className="h-fit rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-slate-900">
              {t("events.eventDetails")}
            </h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="inline-flex items-center gap-2">
                <Ticket className="h-4 w-4 text-primary" />
                {t("events.registrationFee")}: {" "}
                {event.registration_fee && event.registration_fee > 0
                  ? formatCurrency(event.registration_fee, locale)
                  : t("common.free")}
              </p>
              <p className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                {t("events.maxParticipants")}: {" "}
                {event.max_participants ?? t("common.notAvailable")}
              </p>
              <p className="inline-flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-600" />
                {t("events.registered")}: {event.registered_count ?? 0}
              </p>
            </div>
            <Button className="mt-6 w-full rounded-full bg-primary text-white hover:bg-primary/90">
              {t("events.registerNow")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
