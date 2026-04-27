"use client";

import { Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslation } from "@/contexts/LanguageContext";
import type { StudentLessonContent } from "@/lib/student-api";

export function NotesTab({
  note,
  isLocked,
  isUpdating,
  disabled,
  onComplete,
}: {
  note: StudentLessonContent | null;
  isLocked: boolean;
  isUpdating: boolean;
  disabled: boolean;
  onComplete: () => void;
}) {
  const { t } = useAppTranslation();

  if (isLocked) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
        {t("dashboard.notesStepHint")}
      </div>
    );
  }

  if (!note?.pdf) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
        {t("dashboard.noSmartNotes")}
      </div>
    );
  }

  const isCompleted = note.is_completed;

  return (
    <div className="space-y-5">
      <article className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {t("dashboard.smartNotes")}
            </p>
            <h4 className="mt-2 text-lg font-semibold text-slate-950">
              {note.pdf.title}
            </h4>
          </div>
          <FileText className="h-5 w-5 text-primary" />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {note.pdf.file_url ? (
            <Button
              asChild
              className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
            >
              <a href={note.pdf.file_url} target="_blank" rel="noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                {t("dashboard.openNote")}
              </a>
            </Button>
          ) : null}

          {note.pdf.downloadable ? (
            <Button asChild variant="outline" className="rounded-full border-slate-200">
              <a href={note.pdf.file_url} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" />
                {t("dashboard.previewNote")}
              </a>
            </Button>
          ) : null}
        </div>
      </article>

      {note.pdf.file_url ? (
        <div className="overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white">
          <iframe
            src={note.pdf.file_url}
            title={note.pdf.title}
            className="h-[560px] w-full"
          />
        </div>
      ) : null}

      <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-slate-500">{t("dashboard.notesStepHint")}</p>

          <Button
            type="button"
            onClick={onComplete}
            disabled={disabled || isCompleted || isUpdating}
            className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
          >
            {isCompleted
              ? t("dashboard.notesCompleted")
              : isUpdating
                ? t("dashboard.updating")
                : t("dashboard.markNotesComplete")}
          </Button>
        </div>
      </div>
    </div>
  );
}
