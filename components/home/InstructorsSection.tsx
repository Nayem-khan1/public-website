"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface HomeInstructor {
  id: string | number;
  name: string;
  role: string;
  credential: string;
}

interface InstructorsSectionProps {
  instructors: HomeInstructor[];
}

export function InstructorsSection({ instructors }: InstructorsSectionProps) {
    const visibleInstructors = instructors.slice(0, 3);
    const t = useTranslations("common");

    return (
        <section className="py-24 bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
                        {t("home.team_label")}
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                        {t("home.team_title")}
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {t("home.team_subtitle")}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto"
                >
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                        alt="Our Instructors"
                        className="w-full h-auto"
                    />
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-4xl mx-auto">
                    {visibleInstructors.map((instructor, i) => (
                        <motion.div
                            key={instructor.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center p-6 rounded-2xl bg-white border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <h4 className="text-xl font-bold text-slate-900 mb-1">
                                {instructor.name}
                            </h4>
                            <p className="text-primary font-semibold mb-2">
                                {instructor.role}
                            </p>
                            <p className="text-sm text-slate-600">{instructor.credential}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="rounded-full border-2"
                    >
                        <Link href="/team">{t("actions.view_full_team")}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
