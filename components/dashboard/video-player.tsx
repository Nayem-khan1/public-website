"use client";

import { Clock3, ExternalLink, PlayCircle } from "lucide-react";
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

  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
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

  if (!video) {
    return (
      <div className="rounded-[1.6rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
        {t("dashboard.noVideoLesson")}
      </div>
    );
  }

  const embedUrl = getVideoEmbedUrl(video.url);

  return (
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-slate-950">
        {embedUrl ? (
          <div className="aspect-video">
            <iframe
              src={embedUrl}
              title={title}
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center p-8 text-center text-sm text-white/75">
            {t("dashboard.noVideoLesson")}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {video.duration ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            <Clock3 className="h-4 w-4" />
            {video.duration}
          </div>
        ) : null}

        {video.url ? (
          <Button asChild variant="outline" className="rounded-full border-slate-200">
            <a href={video.url} target="_blank" rel="noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              {t("dashboard.openVideo")}
            </a>
          </Button>
        ) : null}
      </div>

      <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
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
            className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
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
