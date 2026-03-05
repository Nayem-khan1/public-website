import { PageHeader } from "@/components/PageHeader";
import { Calendar, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { getEventCards } from "@/lib/public-api";
import type { Event } from "@/data/types";

export default async function EventsPage() {
    const events = await getEventCards();
    const now = new Date();
    const upcomingEvents = events.filter((e) => new Date(e.date) >= now);
    const pastEvents = events.filter((e) => new Date(e.date) < now);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <PageHeader
                title="Cosmic Events & Olympiads"
                subtitle="Join our star parties, workshops, and national astronomy competitions."
                bgImage="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=2000"
            />

            <div className="container mx-auto px-4 md:px-6 py-16">
                {/* Upcoming Events */}
                {upcomingEvents.length > 0 && (
                    <div className="mb-16">
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">
                            Upcoming Events
                        </h2>
                        <div className="space-y-8">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Past Events */}
                {pastEvents.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-display font-bold text-slate-900 mb-8">
                            Past Events
                        </h2>
                        <div className="space-y-8 opacity-75">
                            {pastEvents.map((event) => (
                                <EventCard key={event.id} event={event} isPast />
                            ))}
                        </div>
                    </div>
                )}

                {events.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-slate-500 text-lg">
                            No events scheduled at the moment. Check back soon!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function EventCard({
    event,
    isPast,
}: {
    event: Event;
    isPast?: boolean;
}) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col md:flex-row md:min-h-[280px]">
            {/* Image */}
            <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden shrink-0">
                <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-lg text-center shadow-lg">
                    <div className="text-sm font-bold text-primary uppercase">
                        {format(new Date(event.date), "MMM")}
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                        {format(new Date(event.date), "dd")}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 md:w-2/3 flex flex-col justify-center">
                <div className="flex flex-wrap gap-4 text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        {format(new Date(event.date), "h:mm a")}
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-secondary" />
                        {event.location}
                    </div>
                </div>

                <h3 className="text-2xl font-bold font-display text-slate-900 mb-3 group-hover:text-primary transition-colors">
                    {event.title}
                </h3>

                <p className="text-slate-600 mb-6 leading-relaxed">
                    {event.description}
                </p>

                <div className="flex items-center gap-4">
                    {!isPast ? (
                        <>
                            <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8">
                                Register Now
                            </Button>
                            <Button asChild variant="outline" className="rounded-full px-8">
                                <Link href={`/events/${event.slug}`}>View Details</Link>
                            </Button>
                        </>
                    ) : (
                        <Button variant="outline" className="rounded-full px-8" disabled>
                            Event Ended
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
