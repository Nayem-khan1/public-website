import { PaymentStatusPage } from "@/components/payment-status-page";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  return (
    <PaymentStatusPage
      variant="success"
      searchParams={resolvedSearchParams}
    />
  );
}
