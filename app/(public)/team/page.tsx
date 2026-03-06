import { PageHeader } from "@/components/PageHeader";
import { Linkedin, Twitter } from "lucide-react";
import { getTeamMembers } from "@/lib/public-api";
import type { TeamMember } from "@/data/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Our Team",
    description:
        "Meet the astronomers, educators, and visionaries behind Astronomy Pathshala.",
};

export default async function TeamPage() {
    const teamMembers = await getTeamMembers();

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            <PageHeader
                title="Meet Our Crew"
                subtitle="The astronomers, educators, and visionaries guiding your journey to the stars."
                bgImage="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000"
            />

            <div className="container mx-auto px-4 md:px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-display font-bold text-slate-900">
                        Expert Instructors
                    </h2>
                    <div className="w-16 h-1 bg-primary mx-auto mt-4 rounded-full" />
                </div>

                {teamMembers.length > 0 ? (
                    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <TeamCard
                                key={member.id}
                                member={member}
                                variant={index % 2 === 0 ? "primary" : "secondary"}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-500 py-16">
                        No instructors are available right now.
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
    member: TeamMember;
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
