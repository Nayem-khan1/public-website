import Link from "next/link";
import { AlertCircle, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLocaleAndTranslations } from "@/lib/i18n/server";

type PaymentStatusVariant = "success" | "failed" | "cancelled";
type PaymentSearchParams = Record<string, string | string[] | undefined>;

function pickQueryValue(
  searchParams: PaymentSearchParams,
  keys: string[],
): string | null {
  for (const key of keys) {
    const value = searchParams[key];
    const normalized = Array.isArray(value) ? value[0] : value;
    if (normalized && normalized.trim()) {
      return normalized.trim();
    }
  }

  return null;
}

export async function PaymentStatusPage({
  variant,
  searchParams,
}: {
  variant: PaymentStatusVariant;
  searchParams: PaymentSearchParams;
}) {
  const { t } = await getLocaleAndTranslations();

  const variantContent = {
    success: {
      title: t("payment.completedTitle"),
      subtitle: t("payment.completedSubtitle"),
      iconClassName: "text-emerald-600",
      icon: CheckCircle2,
    },
    failed: {
      title: t("payment.failedTitle"),
      subtitle: t("payment.failedSubtitle"),
      iconClassName: "text-rose-600",
      icon: AlertCircle,
    },
    cancelled: {
      title: t("payment.cancelledTitle"),
      subtitle: t("payment.cancelledSubtitle"),
      iconClassName: "text-amber-600",
      icon: RotateCcw,
    },
  } satisfies Record<
    PaymentStatusVariant,
    {
      title: string;
      subtitle: string;
      iconClassName: string;
      icon: typeof CheckCircle2;
    }
  >;

  const content = variantContent[variant];
  const Icon = content.icon;

  const statusMessage = pickQueryValue(searchParams, ["statusMessage", "message"]);
  const reason = pickQueryValue(searchParams, ["reason"]);
  const invoice = pickQueryValue(searchParams, ["invoice"]);
  const paymentId = pickQueryValue(searchParams, ["payment_id"]);
  const gatewayPaymentId = pickQueryValue(searchParams, ["paymentID"]);
  const transactionId = pickQueryValue(searchParams, ["trx_id", "trxID"]);
  const effectiveMessage = statusMessage || reason || content.subtitle;

  return (
    <section className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <Icon className={`h-14 w-14 ${content.iconClassName}`} />
            <h1 className="mt-4 text-3xl font-display font-bold text-slate-900">
              {content.title}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{effectiveMessage}</p>
          </div>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-700">
              {t("payment.paymentDetails")}
            </h2>
            <dl className="mt-3 space-y-2 text-sm text-slate-600">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{t("payment.invoice")}</dt>
                <dd className="text-right break-all">{invoice || "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{t("payment.paymentId")}</dt>
                <dd className="text-right break-all">{paymentId || "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{t("payment.gatewayRef")}</dt>
                <dd className="text-right break-all">{gatewayPaymentId || "-"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">{t("payment.transactionId")}</dt>
                <dd className="text-right break-all">{transactionId || "-"}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl">
              <Link href="/dashboard">{t("payment.goToDashboard")}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link href="/courses">{t("payment.browseCourses")}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
