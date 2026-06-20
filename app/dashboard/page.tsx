import type { Metadata } from "next";
import Link from "next/link";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { StatCard } from "@/components/layout/page-shell";
import { Activity, Bed, Calendar, UserPlus, Users } from "lucide-react";

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
] satisfies {
  label: string;
  value: string;
  delta: string;
  detail: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
}[];

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
  },
  {
    time: "10:05",
    patient: "Arjun Menon",
    care: "Orthopedics",
    doctor: "Dr. Neil Shah",
    status: "Waiting",
  },
  {
    time: "10:45",
    patient: "Priya Nair",
    care: "Laboratory",
    doctor: "CBC panel",
    status: "Sample due",
  },
  {
    time: "11:30",
    patient: "Rohan Das",
    care: "Neurology",
    doctor: "Dr. Amina Khan",
    status: "Confirmed",
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

function StatusBadge({ children }: { children: string }) {
  const isWaiting = children === "Waiting" || children === "Sample due";

  return (
    <span
      className={[
        "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
        isWaiting
          ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
          : "bg-[color:var(--care-mint)]/20 text-[var(--care-secondary-dark)] ring-1 ring-[color:var(--care-mint)]/60",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[var(--care-surface)] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AppSidebar activeHref="/dashboard" />

        <section className="px-4 py-5 sm:px-6 lg:px-8 lg:h-screen overflow-y-auto">
          <header className="flex flex-col gap-4 border-b border-[var(--care-border)] pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--care-primary)]">
                Hospital Command Center
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-slate-950">
                Dashboard
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Track patient flow, clinical capacity, billing, inventory, and
                laboratory work from one operational view.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Link
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--care-border)] bg-white px-3 text-sm font-semibold text-[var(--care-primary)] transition hover:bg-[var(--care-surface)]"
                href="/appointments"
              >
                <Calendar className="size-4" />
                Book appointment
              </Link>
              <Link
                className="care-brand-gradient inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition hover:brightness-95"
                href="/patients"
              >
                <Users className="size-4" />
                Add patient
              </Link>
            </div>
          </header>

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

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
            <section className="rounded-lg border border-[var(--care-border)] bg-white p-5 shadow-sm shadow-[var(--care-primary)]/5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Revenue Overview
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Weekly collections across billing and claims.
                  </p>
                </div>
                <div className="rounded-md bg-[color:var(--care-mint)]/20 px-3 py-2 text-sm font-semibold text-[var(--care-secondary-dark)]">
                  $378k this week
                </div>
              </div>

              <div className="mt-6 flex h-64 items-end gap-3 border-b border-l border-slate-200 px-2 pb-4 sm:gap-5">
                {revenue.map((day) => (
                  <div
                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                    key={day.label}
                  >
                    <span className="text-xs font-semibold text-slate-500">
                      {day.value}
                    </span>
                    <div
                      className="care-brand-gradient-vertical w-full rounded-t-md"
                      style={{ height: day.height }}
                    />
                    <span className="text-xs font-medium text-slate-500">
                      {day.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-[var(--care-border)] bg-white p-5 shadow-sm shadow-[var(--care-primary)]/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Critical Alerts
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Operational items that need attention.
                  </p>
                </div>
                <Activity className="size-5 text-[var(--care-primary)]" />
              </div>

              <div className="mt-5 grid gap-3">
                {alerts.map((alert) => (
                  <div
                    className="flex items-center justify-between gap-4 rounded-md border border-slate-200 p-3"
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
                      <span className="text-sm font-medium text-slate-700">
                        {alert.label}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-950">
                      {alert.value}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <section className="overflow-hidden rounded-lg border border-[var(--care-border)] bg-white shadow-sm shadow-[var(--care-primary)]/5">
              <div className="flex flex-col gap-3 border-b border-[var(--care-border)] p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Today's Appointments
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Priority schedule and patient movement.
                  </p>
                </div>
                <Link
                  className="text-sm font-semibold text-[var(--care-primary)] hover:text-[var(--care-primary-dark)]"
                  href="/appointments"
                >
                  View calendar
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-sm">
                  <thead className="bg-[var(--care-surface)] text-xs uppercase tracking-[0.12em] text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Time</th>
                      <th className="px-5 py-3 font-semibold">Patient</th>
                      <th className="px-5 py-3 font-semibold">Care</th>
                      <th className="px-5 py-3 font-semibold">Assigned to</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appointments.map((appointment) => (
                      <tr className="hover:bg-slate-50" key={appointment.time}>
                        <td className="px-5 py-4 font-semibold text-slate-950">
                          {appointment.time}
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {appointment.patient}
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {appointment.care}
                        </td>
                        <td className="px-5 py-4 text-slate-700">
                          {appointment.doctor}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge>{appointment.status}</StatusBadge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-lg border border-[var(--care-border)] bg-white p-5 shadow-sm shadow-[var(--care-primary)]/5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-950">
                    Recent Activities
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Latest operational updates.
                  </p>
                </div>
                <Link
                  className="text-sm font-semibold text-[var(--care-primary)] hover:text-[var(--care-primary-dark)]"
                  href="/reports"
                >
                  Reports
                </Link>
              </div>
              <div className="mt-5 grid gap-4">
                {activities.map((activity) => (
                  <div className="flex gap-3" key={activity}>
                    <span className="mt-2 size-2 rounded-full bg-[var(--care-mint)]" />
                    <p className="text-sm leading-6 text-slate-700">
                      {activity}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}