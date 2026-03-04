"use client";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
}

export function PageHeader({ title, subtitle, bgImage }: PageHeaderProps) {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-900">
        {bgImage && (
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/60 to-slate-900" />
      </div>

      {/* Decorative */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4" />

      <div className="container relative mx-auto px-4 md:px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-4 leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
