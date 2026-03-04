import { PageHeader } from "@/components/PageHeader";
import { Linkedin, Twitter } from "lucide-react";
import { teamMembers } from "@/data/dummy";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Team",
    description:
        "Meet the astronomers, educators, and visionaries behind Astronomy Pathshala.",
};

export default function TeamPage() {
    const leadership =
        teamMembers.filter((m) => m.category === "Leadership") || [];
    const instructors =
        teamMembers.filter((m) => m.category === "Instructor") || [];
    const advisors =
        teamMembers.filter((m) => m.category === "Advisor") || [];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <PageHeader
                title="Meet Our Crew"
                subtitle="The astronomers, educators, and visionaries guiding your journey to the stars."
                bgImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000"
            />

            <div className="container mx-auto px-4 md:px-6 py-16">
                {/* Leadership */}
                {leadership.length > 0 && (
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold text-slate-900">
                                Leadership
                            </h2>
                            <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 justify-center max-w-4xl mx-auto">
                            {leadership.map((member) => (
                                <TeamCard key={member.id} member={member} variant="primary" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Instructors */}
                {instructors.length > 0 && (
                    <div className="mb-20">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold text-slate-900">
                                Expert Instructors
                            </h2>
                            <div className="w-16 h-1 bg-secondary mx-auto mt-4 rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {instructors.map((member) => (
                                <TeamCard key={member.id} member={member} variant="secondary" />
                            ))}
                        </div>
                    </div>
                )}

                {/* Advisors */}
                {advisors.length > 0 && (
                    <div>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold text-slate-900">
                                Advisory Board
                            </h2>
                            <div className="w-16 h-1 bg-slate-400 mx-auto mt-4 rounded-full" />
                        </div>

                        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {advisors.map((member) => (
                                <TeamCard key={member.id} member={member} variant="slate" />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function TeamCard({
    member,
    variant = "primary",
}: {
    member: (typeof teamMembers)[0];
    variant?: "primary" | "secondary" | "slate";
}) {
    const borderHoverColor = {
        primary: "group-hover:border-primary/20",
        secondary: "group-hover:border-secondary/20",
        slate: "group-hover:border-slate-300",
    };

    const roleColor = {
        primary: "text-primary",
        secondary: "text-secondary",
        slate: "text-slate-600",
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 border border-slate-100 group text-center p-8">
            <div
                className={`w-28 h-28 mx-auto rounded-full overflow-hidden mb-6 border-4 border-slate-50 ${borderHoverColor[variant]} transition-colors`}
            >
                <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{member.name}</h3>
            <p className={`${roleColor[variant]} font-medium text-sm mb-3`}>
                {member.role}
            </p>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">{member.bio}</p>
            <div className="flex justify-center gap-4">
                {member.socialLinks?.twitter && (
                    <a
                        href={member.socialLinks.twitter}
                        className="text-slate-400 hover:text-primary transition-colors"
                    >
                        <Twitter className="w-5 h-5" />
                    </a>
                )}
                {member.socialLinks?.linkedin && (
                    <a
                        href={member.socialLinks.linkedin}
                        className="text-slate-400 hover:text-primary transition-colors"
                    >
                        <Linkedin className="w-5 h-5" />
                    </a>
                )}
            </div>
        </div>
    );
}
