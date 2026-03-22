import { PageHeader } from "@/components/PageHeader";
import { MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getEventCards } from "@/lib/public-api";
import type { Event } from "@/data/types";
import type { Metadata } from "next";
import {
  getLocaleAndTranslations,
  getLocalizedMetadataLocale,
  getRequestLocale,
} from "@/lib/i18n/server";
import { formatDate, formatDayOfMonth, formatShortMonth } from "@/lib/i18n/format";
import {
  buildMetadataAlternates,
  getLocalizedAbsoluteUrl,
} from "@/lib/i18n/seo";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getLocaleAndTranslations();

  return {
    title: t("events.title"),
    description: t("events.subtitle"),
    alternates: buildMetadataAlternates("/events", locale),
    openGraph: {
      title: t("events.title"),
      description: t("events.subtitle"),
      locale: getLocalizedMetadataLocale(locale),
      url: getLocalizedAbsoluteUrl("/events", locale),
    },
  };
}

export default async function EventsPage() {
  const locale = await getRequestLocale();
  const { t } = await getLocaleAndTranslations(locale);
  const events = await getEventCards(locale);
  const now = new Date();
  const upcomingEvents = events.filter((eventItem) => new Date(eventItem.date) >= now);
  const pastEvents = events.filter((eventItem) => new Date(eventItem.date) < now);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <PageHeader
        title={t("events.title")}
        subtitle={t("events.subtitle")}
        bgImage="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000"
      />

      <div className="container mx-auto px-4 md:px-6 py-16">
        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">
              {t("events.upcomingEvents")}
            </h2>
            <div className="space-y-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} locale={locale} />
              ))}
            </div>
          </div>
        )}

        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">
              {t("events.pastEvents")}
            </h2>
            <div className="space-y-8 opacity-75">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} locale={locale} isPast />
              ))}
            </div>
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">{t("events.noEvents")}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

async function EventCard({
  event,
  locale,
  isPast,
}: {
  event: Event;
  locale: Awaited<ReturnType<typeof getRequestLocale>>;
  isPast?: boolean;
}) {
  const { t } = await getLocaleAndTranslations(locale);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col md:flex-row md:min-h-[280px]">
      <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden shrink-0">
        <img
          src={event.imageUrl}
          alt={event.title || t("events.untitled")}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-center shadow-lg">
          <div className="text-sm font-bold text-primary uppercase">
            {formatShortMonth(event.date, locale)}
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {formatDayOfMonth(event.date, locale)}
          </div>
        </div>
      </div>

      <div className="p-8 md:w-2/3 flex flex-col justify-center">
        <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            {formatDate(event.date, locale, {
              hour: "numeric",
              minute: "2-digit",
            })}
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary" />
            {event.location || t("common.onlineTba")}
          </div>
        </div>

        <h3 className="text-2xl font-bold font-display text-slate-900 mb-3 group-hover:text-primary transition-colors">
          {event.title || t("events.untitled")}
        </h3>

        <p className="text-slate-600 mb-6 leading-relaxed">{event.description}</p>

        <div className="flex items-center gap-4">
          {!isPast ? (
            <>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
                {t("events.registerNow")}
              </Button>
              <Button asChild variant="outline" className="rounded-full px-8">
                <Link href={`/events/${event.slug}`}>{t("common.viewDetails")}</Link>
              </Button>
            </>
          ) : (
            <Button variant="outline" className="rounded-full px-8" disabled>
              {t("events.eventEnded")}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
