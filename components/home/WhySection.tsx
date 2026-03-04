"use client";

import { motion } from "framer-motion";
import { Globe2, Award, Trophy, Rocket } from "lucide-react";

const features = [
    {
        icon: Globe2,
        title: "First in Bangladesh",
        desc: "Bangladesh's pioneering dedicated astronomy education platform",
        gradient: "from-primary/10 to-pink-50",
        iconColor: "text-primary",
    },
    {
        icon: Award,
        title: "Trusted Authority",
        desc: "Trusted by students, parents & educational institutions nationwide",
        gradient: "from-secondary/10 to-purple-50",
        iconColor: "text-secondary",
    },
    {
        icon: Trophy,
        title: "Olympiad Focused",
        desc: "Specialized training for astronomy Olympiads & research programs",
        gradient: "from-primary/10 to-pink-50",
        iconColor: "text-primary",
    },
    {
        icon: Rocket,
        title: "Expert Instructors",
        desc: "Learn from experienced astronomers and astrophysics researchers",
        gradient: "from-secondary/10 to-purple-50",
        iconColor: "text-secondary",
    },
];

export function WhySection() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center max-w-3xl mx-auto mb-16"
                >
                    <span className="text-primary font-semibold tracking-wider text-sm uppercase mb-3 block">
                        Why Choose Us
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                        Why Astronomy Pathshala?
                    </h2>
                    <p className="text-lg text-slate-600">
                        Bangladesh&apos;s first dedicated astronomy education platform, trusted
                        by students, parents &amp; institutions
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2"
                        >
                            <div
                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                            >
                                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
