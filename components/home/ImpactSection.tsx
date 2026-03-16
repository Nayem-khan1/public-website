"use client";

import { motion, useInView } from "framer-motion";
import { Users, BookOpen, Play, Trophy } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useTranslations } from "next-intl";

function AnimatedCounter({ end, suffix = "+" }: { end: number; suffix?: string }) {
    const ref = useRef<HTMLSpanElement>(null);
    const isInView = useInView(ref, { once: true });
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!isInView) return;

        let startTime: number;
        let animationFrame: number;
        const duration = 2000;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = (currentTime - startTime) / duration;

            if (progress < 1) {
                setCount(Math.floor(end * progress));
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(end);
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [isInView, end]);

    return (
        <span ref={ref}>
            {count}
            {suffix}
        </span>
    );
}

export function ImpactSection() {
    const t = useTranslations("common");
    const stats = [
        { end: 5000, label: t("home.impact_stats.students"), icon: Users, suffix: "+" },
        { end: 120, label: t("home.impact_stats.courses"), icon: BookOpen, suffix: "+" },
        { end: 500, label: t("home.impact_stats.live_classes"), icon: Play, suffix: "+" },
        { end: 50, label: t("home.impact_stats.winners"), icon: Trophy, suffix: "+" },
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 mb-4">
                        {t("home.impact_title")}
                    </h2>
                    <p className="text-lg text-slate-600">
                        {t("home.impact_subtitle")}
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, type: "spring" }}
                            className="text-center p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-white border border-slate-100 hover:shadow-xl transition-all duration-300"
                        >
                            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <stat.icon className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-5xl font-bold text-slate-900 mb-2">
                                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                            </h3>
                            <p className="text-slate-600 font-medium">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Recognitions */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center"
                >
                    <p className="text-sm text-slate-500 uppercase tracking-wider mb-8">
                        {t("home.recognized_by")}
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-60">
                        {[
                            t("home.recognized_orgs.gob"),
                            t("home.recognized_orgs.stem"),
                            t("home.recognized_orgs.board"),
                            t("home.recognized_orgs.academy"),
                        ].map((org, i) => (
                            <div key={i} className="text-slate-400 font-semibold text-lg">
                                {org}
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
