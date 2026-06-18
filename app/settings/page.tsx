import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/layout/placeholder-page";

export const metadata: Metadata = {
  title: "Settings | Care Sync",
};

export default function SettingsPage() {
  return (
    <PlaceholderPage
      activeHref="/settings"
      description="Role access, hospital profile, departments, notification rules, and account preferences will live here."
      eyebrow="Administration"
      primaryAction="Manage settings"
      title="Settings"
    />
  );
}
