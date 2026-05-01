"use client";

import { useState } from "react";
import { PlayCircle, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CourseVideoModalProps {
  introVideoUrl?: string;
  thumbnail?: string;
  title: string;
  watchIntroText: string;
}

function getEmbedUrl(url: string) {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtube.com/watch")) {
    videoId = new URL(url).searchParams.get("v") || "";
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
}

export function CourseVideoModal({ introVideoUrl, thumbnail, title, watchIntroText }: CourseVideoModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasIntroVideo = Boolean(introVideoUrl);

  const thumbnailContent = (
    <div className="group relative aspect-video overflow-hidden bg-slate-100 cursor-pointer">
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-slate-400 bg-slate-50">
          <BookOpen className="w-12 h-12 text-slate-300" />
        </div>
      )}
      {hasIntroVideo ? (
        <div
          className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors duration-300 backdrop-blur-[2px]"
        >
          <div className="flex flex-col items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white shadow-lg border border-white/40 cursor-pointer backdrop-blur-md hover:bg-white hover:text-primary transition-all">
              <PlayCircle className="h-8 w-8 ml-1" />
            </div>
            <span className="mt-4 rounded-full bg-black/70 px-4 py-1.5 text-sm font-semibold tracking-wide text-white backdrop-blur-md shadow-sm">
              {watchIntroText}
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );

  if (!hasIntroVideo) {
    return thumbnailContent;
  }

  const embedUrl = introVideoUrl ? getEmbedUrl(introVideoUrl) : "";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {thumbnailContent}
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black border-none">
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
