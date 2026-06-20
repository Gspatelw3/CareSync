import type { Metadata } from "next";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Settings | Care Sync",
};

const settingsGroups = [
  {
    title: "Hospital Profile",
    description: "Hospital name, address, contact, and branding details.",
    fields: [
      { label: "Hospital Name", value: "Care Sync Medical Centre" },
      { label: "Registration No.", value: "HSM-42-1987-06" },
      { label: "Address", value: "42 Health Avenue, Medical District" },
      { label: "Phone", value: "+91 1800 420 4242" },
      { label: "Email", value: "contact@caresync.health" },
      { label: "License Type", value: "Multi-specialty (Level 3)" },
    ],
  },
  {
    title: "Departments",
    description: "Active clinical departments and their heads.",
    fields: [
      { label: "Cardiology", value: "Dr. Kavya Rao" },
      { label: "Orthopedics", value: "Dr. Neil Shah" },
      { label: "General Medicine", value: "Dr. Amina Khan" },
      { label: "Neurology", value: "Dr. Amit Verma" },
      { label: "Pediatrics", value: "Dr. Sneha Kapoor" },
      { label: "Obstetrics", value: "Dr. Priya Mehta" },
      { label: "Pulmonology", value: "Dr. Rajesh Gupta" },
      { label: "Dermatology", value: "Dr. Sunita Reddy" },
    ],
  },
  {
    title: "Notification Rules",
    description: "System alerts and notification preferences.",
    fields: [
      { label: "Low Stock Alerts", value: "Enabled · Threshold: 20% of reorder level" },
      { label: "Critical Lab Results", value: "Enabled · Push to attending + HOD" },
      { label: "Bed Occupancy Warning", value: "Enabled · Alert at 85% occupancy" },
      { label: "Pending Payments Reminder", value: "Enabled · Daily at 9 AM" },
      { label: "Appointment No-show Flag", value: "Enabled · After 15 min grace period" },
    ],
  },
  {
    title: "Access Control",
    description: "Role-based access levels and permissions.",
    fields: [
      { label: "Administrators", value: "3 users · Full system access" },
      { label: "Doctors", value: "186 users · Clinical + prescription access" },
      { label: "Nurses", value: "248 users · Ward + patient vitals access" },
      { label: "Laboratory Staff", value: "42 users · Lab module access" },
      { label: "Pharmacy Staff", value: "28 users · Pharmacy module access" },
      { label: "Billing Staff", value: "18 users · Billing + claims access" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <PageShell activeHref="/settings">
      <PageHeader
        eyebrow="Administration"
        title="Settings"
        description="Role access, hospital profile, departments, notification rules, and account preferences."
      />

      <div className="mt-6 grid gap-6">
        {settingsGroups.map((group) => (
          <Card key={group.title} title={group.title} description={group.description}>
            <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
              {group.fields.map((field) => (
                <div
                  className="flex items-center justify-between gap-4 bg-white px-5 py-4 sm:pl-6"
                  key={field.label}
                >
                  <span className="text-sm font-medium text-slate-700 min-w-[140px]">
                    {field.label}
                  </span>
                  <span className="text-sm text-slate-950 text-right">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}