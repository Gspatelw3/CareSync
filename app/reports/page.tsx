import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Reports | Care Sync",
};

export default function ReportsPage() {
  return (
    <PlaceholderPage
      activeHref="/reports"
      description="Operational reports, utilization trends, revenue summaries, and clinical performance views will live here."
      eyebrow="Insights"
      primaryAction="Generate report"
      title="Reports"
    />
  );
}
