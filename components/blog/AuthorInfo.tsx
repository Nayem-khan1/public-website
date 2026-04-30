import { User } from "lucide-react";
import { formatDate } from "@/lib/i18n/format";

interface AuthorInfoProps {
  authorName?: string | null;
  authorAvatar?: string | null;
  publishedAt: string;
  readTime?: string | null;
  locale: string;
  t: (key: string) => string;
}

export function AuthorInfo({ authorName, authorAvatar, publishedAt, readTime, locale, t }: AuthorInfoProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400 shrink-0 shadow-sm">
        {authorAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={authorAvatar} alt={authorName || "Author"} className="w-full h-full object-cover" />
        ) : (
          <User className="size-6" />
        )}
      </div>
      <div className="flex flex-col">
        <p className="text-base font-semibold text-slate-900">
          {authorName || t("common.editorialTeam")}
        </p>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <span>{formatDate(publishedAt, locale, { month: "short", day: "2-digit", year: "numeric" })}</span>
          {readTime && (
            <>
              <span className="w-1 h-1 rounded-full bg-slate-400"></span>
              <span>{readTime}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
