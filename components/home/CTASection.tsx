"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";

export function CTASection() {
  const { t } = useAppTranslation();
  const { locale } = useLanguage();

  const appDownload = locale === "bn" ? "এখন মোবাইলে উপলব্ধ" : "Now Available on Mobile";
  const titleStart = locale === "bn" ? "যেকোনো জায়গায়" : "Learn Anytime,";
  const titleHighlight = locale === "bn" ? "যেকোনো সময় শিখুন" : "Anywhere You Go";
  const subtitleText = locale === "bn"
    ? "আজই অ্যাস্ট্রোনমি পাঠশালা অ্যাপ ডাউনলোড করুন। আপনার স্মার্টফোন থেকে সরাসরি ইন্টারেক্টিভ কোর্স ও লাইভ ক্লাসে অংশ নিন।"
    : "Download the official Astronomy Pathshala app today. Get unlimited access to interactive space modules, live sessions, and offline downloads directly from your smartphone.";

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-slate-900 via-[#130E26] to-[#0A0514]">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3], x: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[150px]"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3], y: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container relative mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
              <span className="text-sm font-semibold text-white tracking-wider uppercase">
                {appDownload}
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-[1.15]">
              {titleStart} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-pink-400 to-secondary relative inline-block mt-2 pb-2">
                {titleHighlight}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary rounded-full opacity-50 blur-sm"></div>
              </span>
            </h2>

            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-lg leading-relaxed">
              {subtitleText}
            </p>

            <div className="flex flex-wrap gap-4 items-center">
              <Link href="#" className="transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 rounded-xl overflow-hidden block border border-white/10 bg-black">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Get it on Google Play" 
                  className="h-14 md:h-16 w-auto"
                />
              </Link>
              <Link href="#" className="transform hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-300 rounded-xl overflow-hidden block border border-white/10 bg-black">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="Download on the App Store" 
                  className="h-14 md:h-16 w-auto"
                />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto float-slow">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[80px] animate-pulse"></div>
              <img 
                src="/header-img.svg" 
                alt="Space illustration" 
                className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              />
              {/* Floating decorative elements */}
              <motion.div 
                className="absolute top-[10%] right-[10%] w-16 h-16 bg-white/5 border border-white/20 rounded-2xl backdrop-blur-md glass-effect-dark z-20 flex items-center justify-center p-3"
                animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Rocket className="w-full h-full text-white/50" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
