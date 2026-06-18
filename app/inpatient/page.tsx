import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Beds | Care Sync",
};

export default function InpatientPage() {
  return (
    <PlaceholderPage
      activeHref="/inpatient"
      description="Bed allocation, ward management, admissions, and discharge tracking will live here."
      eyebrow="Inpatient Care"
      primaryAction="Allocate bed"
      title="Beds"
    />
  );
}
