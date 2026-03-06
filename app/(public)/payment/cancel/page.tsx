import { PaymentStatusPage } from "@/components/payment-status-page";

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <PaymentStatusPage
      variant="cancelled"
      searchParams={resolvedSearchParams}
    />
  );
}
