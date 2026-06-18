import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Appointments | Care Sync",
};

export default function AppointmentsPage() {
  return (
    <PlaceholderPage
      activeHref="/appointments"
      description="Calendar views, appointment lists, booking, check-ins, and rescheduling will live here."
      eyebrow="Scheduling"
      primaryAction="Book appointment"
      title="Appointments"
    />
  );
}
