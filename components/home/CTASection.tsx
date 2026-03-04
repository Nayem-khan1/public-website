"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="py-32 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 relative overflow-hidden">
            <div className="absolute inset-0">
                <motion.div
                    className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
                    transition={{ duration: 8, repeat: Infinity }}
                />
            </div>

            <div className="container relative mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-20 mx-auto mb-8"
                    >
                        <Rocket className="w-full h-full text-primary" />
                    </motion.div>

                    <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6 leading-tight">
                        Start Your Journey <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-400 to-secondary">
                            Into Space
                        </span>
                    </h2>

                    <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
                        Join thousands of students exploring the cosmos. Your adventure
                        begins today.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="rounded-full text-lg px-12 h-16 bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/50 hover:shadow-primary/70 transition-all duration-300 hover:scale-105"
                        >
                            <Link href="/courses">
                                <Rocket className="w-6 h-6 mr-2" />
                                Explore All Courses
                            </Link>
                        </Button>
                        <Button
                            asChild
                            size="lg"
                            variant="outline"
                            className="rounded-full text-lg px-12 h-16 border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover:border-white/50 transition-all duration-300"
                        >
                            <Link href="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
