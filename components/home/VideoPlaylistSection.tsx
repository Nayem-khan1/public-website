"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, MonitorPlay, X } from "lucide-react";

const VIDEOS = [
  { id: "M-RWlFUwAp4", title: "Introduction to Our Programs", duration: "Featured", category: "Overview" },
  { id: "9RcwxCcjALA", title: "Learning the Basics of Astronomy", duration: "Educational", category: "Science" },
  { id: "K2TfOemkrUg", title: "A Journey Through the Cosmos", duration: "Documentary", category: "Space" },
  { id: "D-6-fnVGyW4", title: "Student Experience and Reviews", duration: "Testimonial", category: "Community" },
  { id: "y8pjXDFspw0", title: "Practical Sessions and Workshops", duration: "Workshop", category: "Hands-on" },
  { id: "YE15DQknURA", title: "Upcoming Events and Camps", duration: "Updates", category: "News" }
];

export function VideoPlaylistSection() {
  const { locale } = useLanguage();
  const [playingVideo, setPlayingVideo] = useState<typeof VIDEOS[0] | null>(null);

  useEffect(() => {
    if (playingVideo) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [playingVideo]);

  const eyebrow = locale === "bn" ? "ভিডিও গ্যালারি" : "Video Gallery";
  const title = locale === "bn" ? "আমাদের বিশেষ ভিডিওসমূহ" : "Our Featured Videos";
  const subtitle = locale === "bn"
    ? "আমাদের শিক্ষামূলক এবং অনুপ্রেরণাদায়ক ভিডিওগুলো দেখুন।"
    : "Watch our educational and inspiring video content from our experts.";

  return (
    <>
      <section className="py-16 md:py-28 relative overflow-hidden flex flex-col items-center z-10 w-full bg-[#000000]">
        
        {/* Background ambient glows for the section itself */}
        <div className="absolute left-[-10%] top-0 w-[500px] h-[500px] opacity-20 bg-blue-600 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
        <div className="absolute right-[-10%] bottom-0 w-[500px] h-[500px] opacity-20 bg-red-600 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

        <div className="container px-4 md:px-6 relative z-10 w-full max-w-[1400px] mx-auto">
          
          {/* Glossy Card Wrapper */}
          <div className="relative rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 lg:p-16 overflow-hidden border border-white/20 shadow-2xl w-full">
            
            {/* Multiple Color Gradient Background inside the Glass Card */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30 -z-20 mix-blend-screen" />
            <div className="absolute -top-[25%] -left-[25%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent -z-20" />
            <div className="absolute -bottom-[25%] -right-[25%] w-[150%] h-[150%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-orange-500/20 via-transparent to-transparent -z-20" />
            
            {/* Glassmorphism Effect */}
            <div className="absolute inset-0 bg-[#0A0A0A]/60 backdrop-blur-[40px] -z-10" />

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-3xl mx-auto flex flex-col items-center mb-16"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  <MonitorPlay className="w-4 h-4" />
                  <span>{eyebrow}</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  {title}
                </h2>
                <p className="text-lg md:text-xl text-white/80 max-w-2xl font-medium">
                  {subtitle}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {VIDEOS.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: -100 }} // Drops from top
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: index * 0.15, type: "spring", bounce: 0.4 }}
                    viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                    onClick={() => setPlayingVideo(video)}
                    className="rounded-3xl bg-white/5 border border-white/20 hover:border-white/40 hover:bg-white/10 backdrop-blur-md overflow-hidden hover:-translate-y-2 transition-all duration-300 cursor-pointer shadow-xl group flex flex-col relative"
                  >
                    {/* Glowing effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="aspect-video relative overflow-hidden bg-black/50">
                      <img 
                        src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
                        alt={video.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        onError={(e) => { e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/mqdefault.jpg` }} 
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                          <Play className="w-6 h-6 text-white ml-1.5 fill-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/10 text-white border border-white/20 shadow-sm">
                          {video.category}
                        </span>
                        <span className="text-xs text-white/80 flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-full border border-white/5">
                          <Clock className="w-3.5 h-3.5" />
                          {video.duration}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-3 line-clamp-2 md:leading-snug">
                        {video.title}
                      </h3>
                      <p className="text-white/60 text-sm md:text-base line-clamp-2 mt-auto">
                        {locale === "bn" 
                          ? "এই ভিডিওটিতে আমাদের অসাধারণ কার্যক্রম এবং শিক্ষণ পদ্ধতি সম্পর্কে বিস্তারিতভাবে আলোচনা করা হয়েছে।" 
                          : "Explore this video to gain deeper insights into our educational approach and discover how it can benefit you."}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl"
            onClick={() => setPlayingVideo(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
              onClick={() => setPlayingVideo(null)}
            >
              <X className="w-6 h-6" />
            </motion.button>
            
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-6xl aspect-video bg-black rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo.id}?autoplay=1&rel=0&modestbranding=1`}
                title={playingVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full absolute inset-0 border-0"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
