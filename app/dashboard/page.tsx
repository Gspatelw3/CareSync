import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Button } from "@/components/ui/button";
import { Activity, Calendar } from "lucide-react";
import { AddPatientButton } from "@/components/layout/add-patient-button";
import { Users, UserPlus, Bed } from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | Care Sync",
  description: "Care Sync hospital operations dashboard",
};

const stats = [
  {
    label: "Total Patients",
    value: "12,486",
    delta: "+8.2%",
    detail: "358 active today",
    icon: Users,
    href: "/patients",
  },
  {
    label: "Total Doctors",
    value: "186",
    delta: "42 on duty",
    detail: "14 departments covered",
    icon: UserPlus,
    href: "/doctors",
  },
  {
    label: "Today's Appointments",
    value: "324",
    delta: "71 pending",
    detail: "89 completed check-ins",
    icon: Calendar,
    href: "/appointments",
  },
  {
    label: "Available Beds",
    value: "58",
    delta: "18 ICU",
    detail: "77% occupancy",
    icon: Bed,
    href: "/inpatient",
  },
];

const revenue = [
  { label: "Mon", value: "$42k", height: "48%" },
  { label: "Tue", value: "$58k", height: "66%" },
  { label: "Wed", value: "$51k", height: "58%" },
  { label: "Thu", value: "$73k", height: "84%" },
  { label: "Fri", value: "$67k", height: "76%" },
  { label: "Sat", value: "$49k", height: "56%" },
  { label: "Sun", value: "$38k", height: "43%" },
];

const appointments = [
  {
    time: "09:20",
    patient: "Meera Iyer",
    care: "Cardiology",
    doctor: "Dr. Kavya Rao",
    status: "Checked in",
    statusVariant: "default" as const,
  },
  {
    time: "10:05",
    patient: "Arjun Menon",
    care: "Orthopedics",
    doctor: "Dr. Neil Shah",
    status: "Waiting",
    statusVariant: "warning" as const,
  },
  {
    time: "10:45",
    patient: "Priya Nair",
    care: "Laboratory",
    doctor: "CBC panel",
    status: "Sample due",
    statusVariant: "warning" as const,
  },
  {
    time: "11:30",
    patient: "Rohan Das",
    care: "Neurology",
    doctor: "Dr. Amina Khan",
    status: "Confirmed",
    statusVariant: "default" as const,
  },
];

const activities = [
  "Ward B discharged 6 patients and released 4 beds.",
  "Pharmacy flagged low insulin and saline inventory.",
  "Insurance desk approved 18 of 24 pending claims.",
  "Laboratory uploaded 37 reports for physician review.",
];

const alerts = [
  { label: "Pending payments", value: "$28.4k", tone: "amber" },
  { label: "Critical stock alerts", value: "9 items", tone: "red" },
  { label: "Lab reports pending", value: "31", tone: "blue" },
];

export default function DashboardPage() {
  return (
    <PageShell activeHref="/dashboard">
      <PageHeader
        eyebrow="Hospital Command Center"
        title="Dashboard"
        description="Track patient flow, clinical capacity, billing, inventory, and laboratory work from one operational view."
        actions={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link href="/appointments">
              <Button variant="secondary" size="sm" type="button">
                <Calendar className="size-4" />
                Book appointment
              </Button>
            </Link>
            <AddPatientButton />
          </div>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const IconComponent = item.icon;
          return (
            <StatCard
              key={item.label}
              label={item.label}
              value={item.value}
              delta={item.delta}
              detail={item.detail}
              icon={<IconComponent className="size-5" />}
              href={item.href}
            />
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="Revenue Overview" description="Weekly collections across billing and claims.">
          <div>
            <div className="rounded-md bg-[var(--care-mint)]/20 px-3 py-2 text-sm font-semibold text-[var(--care-secondary-dark)]">
              $378k this week
            </div>
            <div className="mt-6 flex h-64 items-end gap-3 border-b border-l border-[var(--border-default)] px-2 pb-4 sm:gap-5">
              {revenue.map((day) => (
                <div
                  className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                  key={day.label}
                >
                  <span className="text-xs font-semibold text-[var(--text-muted)]">
                    {day.value}
                  </span>
                  <div
                    className="care-brand-gradient-vertical w-full rounded-t-md"
                    style={{ height: day.height }}
                  />
                  <span className="text-xs font-medium text-[var(--text-muted)]">
                    {day.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card
          title="Critical Alerts"
          description="Operational items that need attention."
          action={<Activity className="size-5 text-[var(--care-primary)]" />}
        >
          <div className="grid gap-3 p-5">
            {alerts.map((alert) => (
              <div
                className="flex items-center justify-between gap-4 rounded-md border border-[var(--border-default)] p-3"
                key={alert.label}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={[
                      "size-2.5 rounded-full",
                      alert.tone === "red" && "bg-red-500",
                      alert.tone === "amber" && "bg-amber-500",
                      alert.tone === "blue" && "bg-[var(--care-primary)]",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  />
                  <span className="text-sm font-medium text-[var(--text-secondary)]">
                    {alert.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {alert.value}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card
          title="Today&rsquo;s Appointments"
          description="Priority schedule and patient movement."
          action={
            <Link
              className="text-sm font-semibold text-[var(--care-primary)] hover:text-[var(--care-primary-dark)]"
              href="/appointments"
            >
              View calendar
            </Link>
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-[var(--care-surface)] text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Time</th>
                  <th className="px-5 py-3 font-semibold">Patient</th>
                  <th className="px-5 py-3 font-semibold">Care</th>
                  <th className="px-5 py-3 font-semibold">Assigned to</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--table-divide)]">
                {appointments.map((appointment) => (
                  <tr className="hover:bg-[var(--hover-bg)]" key={appointment.time}>
                    <td className="px-5 py-4 font-semibold text-[var(--text-primary)]">
                      {appointment.time}
                    </td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">
                      {appointment.patient}
                    </td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">
                      {appointment.care}
                    </td>
                    <td className="px-5 py-4 text-[var(--text-secondary)]">
                      {appointment.doctor}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge variant={appointment.statusVariant}>
                        {appointment.status}
                      </StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title="Recent Activities"
          description="Latest operational updates."
          action={
            <Link
              className="text-sm font-semibold text-[var(--care-primary)] hover:text-[var(--care-primary-dark)]"
              href="/reports"
            >
              Reports
            </Link>
          }
        >
          <div className="grid gap-4 p-5">
            {activities.map((activity) => (
              <div className="flex gap-3" key={activity}>
                <span className="mt-2 size-2 rounded-full bg-[var(--care-mint)]" />
                <p className="text-sm leading-6 text-[var(--text-secondary)]">
                  {activity}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}