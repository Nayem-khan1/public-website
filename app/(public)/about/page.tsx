import { PageHeader } from "@/components/PageHeader";
import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About Us",
    description:
        "Learn about Astronomy Pathshala — Bangladesh's pioneering astronomy education platform. Our mission, vision, and story.",
};

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white pb-20">
            <PageHeader
                title="About Astronomy Pathshala"
                subtitle="Pioneering astronomy education in Bangladesh since 2018."
                bgImage="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=2000"
            />

            <div className="container mx-auto px-4 md:px-6 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <span className="text-primary font-bold uppercase tracking-wider text-sm">
                            Our Story
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mt-2 mb-6">
                            Pioneering Astronomy Education in Bangladesh
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                            Founded in 2018, Astronomy Pathshala started with a simple yet
                            ambitious goal: to make the wonders of the universe accessible to
                            every student in Bangladesh. We noticed that while students were
                            curious about space, there were few resources to guide them
                            systematically.
                        </p>
                        <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                            Today, we are the country&apos;s leading platform for astronomy
                            education, training students for International Olympiads and
                            cultivating the next generation of astrophysicists.
                        </p>

                        <div className="space-y-4">
                            {[
                                "National Olympiad Training Partner",
                                "Research-based Curriculum",
                                "Workshops with International Astronomers",
                                "Largest Astronomy Community in BD",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    <span className="text-slate-800 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&q=80&w=1000"
                                alt="Astronomy Workshop"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-100 rounded-full -z-10" />
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full -z-10" />
                    </div>
                </div>

                {/* Impact Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">
                    {[
                        { value: "5000+", label: "Students Taught" },
                        { value: "120+", label: "Courses Conducted" },
                        { value: "50+", label: "Olympiad Winners" },
                        { value: "6+", label: "Years of Impact" },
                    ].map((stat, i) => (
                        <div
                            key={i}
                            className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100"
                        >
                            <h3 className="text-3xl md:text-4xl font-bold text-primary mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100">
                        <h3 className="text-2xl font-display font-bold text-slate-900 mb-4">
                            Our Mission
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            To ignite curiosity about the cosmos in young minds and provide
                            world-class astronomy education that empowers Bangladeshi students
                            to compete on the global stage.
                        </p>
                    </div>
                    <div className="bg-slate-900 p-10 rounded-3xl text-white">
                        <h3 className="text-2xl font-display font-bold mb-4 text-white">
                            Our Vision
                        </h3>
                        <p className="text-slate-300 leading-relaxed">
                            To build a scientifically literate society where every child can
                            look up at the stars and understand the universe, fostering a
                            culture of research and exploration.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
