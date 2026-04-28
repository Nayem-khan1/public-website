"use client";

import { useState } from "react";
import { Clock3, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/contexts/LanguageContext";
import { ProgressBar } from "./progress-bar";

function extractYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);
    const host = parsedUrl.hostname.toLowerCase();

    if (host.includes("youtu.be")) {
      return parsedUrl.pathname.split("/").filter(Boolean)[0] ?? null;
    }

    if (host.includes("youtube.com")) {
      const watchId = parsedUrl.searchParams.get("v");
      if (watchId) {
        return watchId;
      }

      const segments = parsedUrl.pathname.split("/").filter(Boolean);
      const embedIndex = segments.findIndex(
        (segment) => segment === "embed" || segment === "shorts",
      );

      if (embedIndex >= 0) {
        return segments[embedIndex + 1] ?? null;
      }
    }
  } catch {
    const fallbackMatch = url.match(
      /(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/i,
    );

    return fallbackMatch?.[1] ?? null;
  }

  return null;
}

function getVideoEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) {
    return null;
  }

  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1&showinfo=0&controls=1&iv_load_policy=3`;
}

export function VideoPlayer({
  title,
  video,
  progressPercent,
  isCompleted,
  isUpdating,
  disabled,
  onComplete,
}: {
  title: string;
  video: {
    url: string;
    duration: string;
    provider: string;
    thumbnail: string;
  } | null;
  progressPercent: number;
  isCompleted: boolean;
  isUpdating: boolean;
  disabled: boolean;
  onComplete: () => void;
}) {
  const { t } = useAppTranslation();
  const [isPlaying, setIsPlaying] = useState(false);

  if (!video) {
    return null;
  }

  const embedUrl = getVideoEmbedUrl(video.url);

  // Use the provided thumbnail or fallback to YouTube's default thumbnail if it's a YouTube video
  const youtubeId = extractYouTubeVideoId(video.url);
  const coverImage = video.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : "");

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200 bg-slate-950 aspect-video group shadow-md">
        {embedUrl ? (
          isPlaying ? (
            <iframe
              src={embedUrl}
              title={title}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center cursor-pointer" onClick={() => setIsPlaying(true)}>
              {coverImage && (
                <img src={coverImage} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-80 transition-opacity group-hover:opacity-70" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              
              <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-white shadow-[0_0_30px_rgba(var(--primary),0.5)] transition-transform group-hover:scale-110">
                <PlayCircle className="h-10 w-10 fill-white text-primary/90" />
              </div>

              <div className="absolute bottom-6 left-6 right-6 z-10">
                <h3 className="text-xl font-bold text-white line-clamp-2">{title}</h3>
              </div>
            </div>
          )
        ) : (
          <div className="flex aspect-video items-center justify-center p-8 text-center text-sm text-white/75">
            {t("dashboard.noVideoLesson")}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {video.duration ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
            <Clock3 className="h-4 w-4" />
            {video.duration}
          </div>
        ) : null}
      </div>

      <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5 shadow-sm">
        <ProgressBar
          value={progressPercent}
          label={t("dashboard.progress")}
          valueLabel={`${progressPercent}%`}
        />

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">{t("dashboard.videoWatchHint")}</p>

          <Button
            type="button"
            onClick={onComplete}
            disabled={disabled || isCompleted || isUpdating}
            className="rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800"
          >
            {isCompleted ? (
              t("dashboard.videoCompleted")
            ) : isUpdating ? (
              <>
                <Clock3 className="mr-2 h-4 w-4" />
                {t("dashboard.updating")}
              </>
            ) : (
              <>
                <PlayCircle className="mr-2 h-4 w-4" />
                {t("dashboard.markVideoComplete")}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
