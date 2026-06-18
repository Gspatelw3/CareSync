import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Doctors | Care Sync",
};

export default function DoctorsPage() {
  return (
    <PlaceholderPage
      activeHref="/doctors"
      description="Doctor directory, profiles, department coverage, and schedule management will live here."
      eyebrow="Care Team"
      primaryAction="Add doctor"
      title="Doctors"
    />
  );
}
