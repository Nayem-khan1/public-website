"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, ReceiptText, XCircle } from "lucide-react";
import { useAppTranslation, useLanguage } from "@/contexts/LanguageContext";
import { formatShortDate } from "@/lib/student-dashboard";
import {
  getStudentAccessToken,
  getStudentOrders,
  type StudentOrder,
} from "@/lib/student-api";

function getCurrencyFormatter(locale: "en" | "bn") {
  return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  });
}

function getOrderStatusClasses(status: StudentOrder["status"]) {
  if (status === "verified") {
    return "bg-emerald-100 text-emerald-700";
  }

  if (status === "failed") {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-amber-100 text-amber-700";
}

export default function OrdersPage() {
  const { locale } = useLanguage();
  const { t } = useAppTranslation();
  const [orders, setOrders] = useState<StudentOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOrders() {
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
        const data = await getStudentOrders(token);
        if (!cancelled) {
          setOrders(data);
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

    void loadOrders();

    return () => {
      cancelled = true;
    };
  }, [t]);

  const formatter = getCurrencyFormatter(locale);
  const verifiedOrders = orders.filter((order) => order.status === "verified").length;
  const pendingOrders = orders.filter((order) => order.status === "pending").length;
  const failedOrders = orders.filter((order) => order.status === "failed").length;

  const totalSpent = orders
    .filter((o) => o.status === "verified")
    .reduce((sum, o) => sum + o.amount, 0);
  const pendingAmount = orders
    .filter((o) => o.status === "pending")
    .reduce((sum, o) => sum + o.amount, 0);
  const successRate = orders.length
    ? Math.round((verifiedOrders / orders.length) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white px-8 py-10 shadow-sm">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-500/5 blur-[80px]" />
        
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-amber-600">
            {t("dashboard.paymentOrders")}
          </p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 md:text-5xl">
            {t("dashboard.orderHistoryTitle")}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
            {t("dashboard.orderHistorySubtitle")}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="group rounded-[1.8rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">{t("dashboard.totalSpent")}</p>
              <p className="mt-2 text-3xl font-black text-emerald-950">{loading ? "-" : formatter.format(totalSpent)}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 w-full rounded-full bg-emerald-100">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: "100%" }} />
                </div>
              </div>
            </div>

            <div className="group rounded-[1.8rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">{t("dashboard.successRate")}</p>
              <p className="mt-2 text-3xl font-black text-blue-950">{loading ? "-" : `${successRate}%`}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="h-1.5 w-full rounded-full bg-blue-100">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: `${successRate}%` }} />
                </div>
              </div>
            </div>

            <div className="group rounded-[1.8rem] border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-600">{t("dashboard.pendingAmount")}</p>
              <p className="mt-2 text-3xl font-black text-amber-950">{loading ? "-" : formatter.format(pendingAmount)}</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-amber-600 uppercase">
                {pendingOrders} {t("dashboard.pendingOrders")}
              </div>
            </div>

            <div className="group rounded-[1.8rem] border border-slate-100 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition-all hover:shadow-md">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("dashboard.totalOrders")}</p>
              <p className="mt-2 text-3xl font-black text-slate-950">{loading ? "-" : orders.length}</p>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                {verifiedOrders} {t("dashboard.verifiedStatus")}
              </div>
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
          {t("dashboard.loadingOrders")}
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-[1.8rem] border border-dashed border-slate-200 bg-white px-5 py-16 text-center shadow-[0_24px_60px_-40px_rgba(15,23,42,0.18)]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <ReceiptText className="h-6 w-6" />
          </div>
          <p className="mt-4 text-lg font-semibold text-slate-950">
            {t("dashboard.noOrdersTitle")}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {t("dashboard.noOrdersBody")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-[1.7rem] border border-slate-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.22)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="mb-4 inline-flex rounded-2xl bg-slate-100 p-3 text-slate-700">
                    <ReceiptText className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-950">
                    {order.course_name}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {t("dashboard.invoiceLabel")}: {order.invoice}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getOrderStatusClasses(order.status)}`}
                  >
                    {order.status === "verified" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : order.status === "failed" ? (
                      <XCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Clock3 className="h-3.5 w-3.5" />
                    )}
                    {order.status}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {formatter.format(order.amount)}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">
                    {t("dashboard.transactionLabel")}
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {order.trx_id || t("common.notAvailable")}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">
                    {t("dashboard.gatewayLabel")}
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {order.gateway}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">
                    {t("dashboard.amountLabel")}
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {formatter.format(order.amount)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">
                    {t("dashboard.submittedAtLabel")}
                  </p>
                  <p className="mt-1 font-semibold text-slate-950">
                    {formatShortDate(order.submitted_at, locale)}
                  </p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-4">
                  <p className="text-sm text-slate-500">
                    {t("dashboard.statusLabel")}
                  </p>
                  <p className="mt-1 font-semibold capitalize text-slate-950">
                    {order.status}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {!loading && failedOrders > 0 ? (
        <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {failedOrders} {t("dashboard.failedOrders")}
        </div>
      ) : null}
    </div>
  );
}
