"use client";

import { useEffect, useState } from "react";
import { Award, Download, FileBadge2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import { formatShortDate } from "@/lib/student-dashboard";
import {
  downloadStudentCertificate,
  getStudentAccessToken,
  getStudentCertificates,
  type StudentCertificate,
} from "@/lib/student-api";

function downloadPdf(fileName: string, base64: string) {
  const bytes = Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  window.URL.revokeObjectURL(url);
}

export default function CertificatesPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const [certificates, setCertificates] = useState<StudentCertificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCertificates() {
      const token = getStudentAccessToken();
      if (!token) {
        if (!cancelled) {
          setError(t("dashboard.dashboardAuthRequired"));
          setLoading(false);
        }
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getStudentCertificates(token, locale);
        if (!cancelled) {
          setCertificates(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : t("dashboard.loadDashboardFailed"),
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadCertificates();

    return () => {
      cancelled = true;
    };
  }, [locale, t]);

  async function handleDownload(certificateId: string) {
    const token = getStudentAccessToken();
    if (!token) {
      setError(t("dashboard.dashboardAuthRequired"));
      return;
    }

    setDownloadingId(certificateId);
    setError(null);

    try {
      const certificate = await downloadStudentCertificate(certificateId, token);
      downloadPdf(certificate.file_name, certificate.pdf_base64);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : t("dashboard.loadDashboardFailed"),
      );
    } finally {
      setDownloadingId(null);
    }
  }

  const verifiedCount = certificates.filter(
    (certificate) => certificate.verification_status === "verified",
  ).length;
  const latestIssuedAt = certificates[0]?.issued_at ?? null;

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-slate-200 bg-white px-6 py-7 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.28)] md:px-8 md:py-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-slate-400">
              {t("dashboard.certificates")}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-950">
              {t("dashboard.certificateLibraryTitle")}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-500">
              {t("dashboard.certificateLibrarySubtitle")}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {t("dashboard.earnedCertificates")}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {loading ? "-" : certificates.length}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {t("dashboard.verificationStatus")}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-950">
                {loading ? "-" : verifiedCount}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-5 py-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                {t("dashboard.latestIssueDate")}
              </p>
              <p className="mt-2 text-lg font-bold text-slate-950">
                {loading
                  ? "-"
                  : latestIssuedAt
                    ? formatShortDate(latestIssuedAt, locale)
                    : t("common.notAvailable")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-[1.8rem] border border-slate-200 bg-white px-5 py-16 text-center text-sm text-slate-500 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]">
          {t("dashboard.loadingCertificates")}
        </div>
      ) : certificates.length === 0 ? (
        <div className="rounded-[1.8rem] border border-dashed border-slate-200 bg-white px-5 py-16 text-center shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <Award className="h-6 w-6" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-950">
            {t("dashboard.noCertificatesTitle")}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {t("dashboard.noCertificatesBody")}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className="rounded-[1.8rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.24)]"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="mb-4 inline-flex rounded-2xl bg-amber-100 p-3 text-amber-700">
                    <FileBadge2 className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950">
                    {certificate.course_title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {certificate.certificate_no}
                  </p>
                </div>

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    certificate.verification_status === "verified"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {certificate.verification_status === "verified"
                    ? t("dashboard.verifiedStatus")
                    : t("dashboard.unverifiedStatus")}
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">
                    {t("dashboard.issuedOn")}
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {formatShortDate(certificate.issued_at, locale)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">
                    {t("dashboard.verificationStatus")}
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {certificate.verification_status === "verified"
                      ? t("dashboard.verifiedStatus")
                      : t("dashboard.unverifiedStatus")}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => void handleDownload(certificate.id)}
                  disabled={downloadingId === certificate.id || !certificate.downloadable}
                  className="rounded-full bg-slate-950 text-white hover:bg-slate-800"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {downloadingId === certificate.id
                    ? t("dashboard.downloading")
                    : t("dashboard.downloadCertificate")}
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
