import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Users, Ticket } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { getPublicEventBySlug } from "@/lib/public-api";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getPublicEventBySlug(slug, "en");

  if (!event) {
    notFound();
  }

  const title = event.title ?? event.title_en ?? "Untitled Event";
  const description = event.description ?? event.description_en ?? "";
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
            Back to Events
          </Link>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-6 text-slate-200">
            <span className="inline-flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(eventDate, "MMMM dd, yyyy")}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {format(eventDate, "h:mm a")}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
            <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">
              About This Event
            </h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm h-fit">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Event Details</h3>
            <div className="space-y-3 text-sm text-slate-600">
              <p className="inline-flex items-center gap-2">
                <Ticket className="w-4 h-4 text-primary" />
                Registration Fee:{" "}
                {event.registration_fee && event.registration_fee > 0
                  ? `BDT ${event.registration_fee.toLocaleString("en-US")}`
                  : "Free"}
              </p>
              <p className="inline-flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary" />
                Max Participants: {event.max_participants ?? "N/A"}
              </p>
              <p className="inline-flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Registered: {event.registered_count ?? 0}
              </p>
            </div>
            <Button className="w-full mt-6 bg-primary hover:bg-primary/90 text-white rounded-full">
              Register Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
