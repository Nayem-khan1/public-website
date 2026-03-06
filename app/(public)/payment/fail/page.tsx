import { PaymentStatusPage } from "@/components/payment-status-page";

export default async function PaymentFailPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <PaymentStatusPage
      variant="failed"
      searchParams={resolvedSearchParams}
    />
  );
}
