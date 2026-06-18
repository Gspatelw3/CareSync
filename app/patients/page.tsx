import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Patients | Care Sync",
};

export default function PatientsPage() {
  return (
    <PlaceholderPage
      activeHref="/patients"
      description="Patient lists, intake, profiles, and medical history workflows will live here."
      eyebrow="Patient Management"
      primaryAction="Add patient"
      title="Patients"
    />
  );
}
