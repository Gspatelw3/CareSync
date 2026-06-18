import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Billing | Care Sync",
};

export default function BillingPage() {
  return (
    <PlaceholderPage
      activeHref="/billing"
      description="Invoices, payment history, insurance claims, and pending balances will live here."
      eyebrow="Revenue Cycle"
      primaryAction="Create invoice"
      title="Billing"
    />
  );
}
