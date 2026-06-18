import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Pharmacy | Care Sync",
};

export default function PharmacyPage() {
  return (
    <PlaceholderPage
      activeHref="/pharmacy"
      description="Medication inventory, dispensing queues, reorder levels, and stock alerts will live here."
      eyebrow="Medication Stock"
      primaryAction="Update inventory"
      title="Pharmacy"
    />
  );
}
