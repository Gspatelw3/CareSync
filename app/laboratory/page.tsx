import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Laboratory | Care Sync",
};

export default function LaboratoryPage() {
  return (
    <PlaceholderPage
      activeHref="/laboratory"
      description="Test requests, sample collection, report uploads, and review queues will live here."
      eyebrow="Diagnostics"
      primaryAction="Create test request"
      title="Laboratory"
    />
  );
}
