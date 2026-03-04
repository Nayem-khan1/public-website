"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Rocket,
    Trophy,
    Users,
    Play,
    Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarBackground } from "@/components/StarBackground";

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 bg-gradient-to-b from-slate-900 via-[#0B0F19] to-black">
            <StarBackground />

            <div className="container relative z-10 mx-auto px-4 md:px-6 py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-white font-semibold text-sm mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-primary" />
                            Bangladesh&apos;s #1 Astronomy Platform
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-[1.1] mb-6">
                            Explore the Universe.{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-400 to-secondary">
                                Learn Beyond Earth.
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-xl leading-relaxed">
                            Online astronomy &amp; astrophysics courses for students, Olympiad
                            learners, and space enthusiasts.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-12">
                            <Button
                                asChild
                                size="lg"
                                className="rounded-full text-base px-8 h-14 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 hover:scale-105"
                            >
                                <Link href="/courses">
                                    <Rocket className="w-5 h-5 mr-2" />
                                    Explore Courses
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="rounded-full text-base px-8 h-14 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover:border-white/50 transition-all duration-300"
                            >
                                <Link href="/events">
                                    <Play className="w-5 h-5 mr-2" />
                                    Join Live Classes
                                </Link>
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-white">5000+</h4>
                                    <p className="text-sm text-slate-400">Students Taught</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-secondary/20 backdrop-blur-sm flex items-center justify-center">
                                    <Trophy className="w-6 h-6 text-secondary" />
                                </div>
                                <div>
                                    <h4 className="text-2xl font-bold text-white">50+</h4>
                                    <p className="text-sm text-slate-400">Olympiad Winners</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Animated Galaxy */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="relative hidden lg:block"
                    >
                        <div className="relative w-full aspect-square max-w-lg mx-auto">
                            <div className="absolute inset-0 animate-bounce-slow">
                                <img
                                    src="/header-img.svg"
                                    alt="Space illustration"
                                    className="w-full h-full object-contain drop-shadow-2xl animate-pulse-slow"
                                />
                            </div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(241,2,76,0.3)_0%,transparent_70%)] blur-3xl animate-pulse-slow" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                    <motion.div
                        className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={{ y: [0, 16, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </section>
    );
}
