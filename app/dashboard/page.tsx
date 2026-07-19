"use client";

import Link from "next/link";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Button } from "@/components/ui/button";
import { Activity, Calendar } from "lucide-react";
import { AddPatientButton } from "@/components/layout/add-patient-button";
import { Users, UserPlus, Bed } from "lucide-react";
import { usePatientStore } from "@/lib/stores";
import { useDoctorStore } from "@/lib/stores";
import { useAppointmentStore } from "@/lib/stores";
import { useAdmissionStore } from "@/lib/stores";
import { useEffect, useMemo, useState } from "react";
import { calculateBedStatistics, validateBedCalculations } from "@/lib/utils/bed-calculations";

export default function DashboardPage() {
  const [isClient, setIsClient] = useState(false);
  
  const patients = usePatientStore((state) => state.patients);
  const doctors = useDoctorStore((state) => state.doctors);
  const appointments = useAppointmentStore((state) => state.appointments);
  const admissions = useAdmissionStore((state) => state.admissions);

  useEffect(() => {
    // Data is auto-initialized via store-initializer component in layout
    setIsClient(true);
  }, []);

  const bedStats = useMemo(() => calculateBedStatistics(admissions), [admissions]);
  const { availableBeds, occupancyRate, icuStats } = bedStats;

  useEffect(() => {
    if (!isClient) return;
    const isValid = validateBedCalculations(admissions);
    if (!isValid) {
      console.error("Bed calculation validation failed");
    }
  }, [admissions, isClient]);

  const stats = useMemo(() => {
    const activePatients = patients.filter((p) => p.status === "Active").length;
    const doctorsOnDuty = doctors.filter((d) => d.status === "On duty").length;
    const pendingAppointments = appointments.filter((a) => a.status === "Waiting" || a.status === "Confirmed").length;
    const completedCheckins = appointments.filter((a) => a.status === "Checked in").length;

    return [
    {
      label: "Total Patients",
      value: patients.length.toLocaleString(),
      delta: "+8.2%",
      detail: `${activePatients} active today`,
      icon: Users,
      href: "/patients",
    },
    {
      label: "Total Doctors",
      value: doctors.length.toString(),
      delta: `${doctorsOnDuty} on duty`,
      detail: "14 departments covered",
      icon: UserPlus,
      href: "/doctors",
    },
    {
      label: "Today's Appointments",
      value: appointments.length.toString(),
      delta: `${pendingAppointments} pending`,
      detail: `${completedCheckins} completed check-ins`,
      icon: Calendar,
      href: "/appointments",
    },
    {
      label: "Available Beds",
      value: availableBeds.toString(),
      delta: `${icuStats.available} ICU`,
      detail: `${occupancyRate}% occupancy`,
      icon: Bed,
      href: "/inpatient",
    },
  ];
  }, [appointments, availableBeds, doctors, icuStats.available, occupancyRate, patients]);

  // Get today's appointments (first 4)
  const todayAppts = useMemo(() => appointments.slice(0, 4), [appointments]);

  // Recent activities based on data
  const activities = [
    `Ward B discharged 6 patients and released 4 beds.`,
    `Pharmacy flagged low insulin and saline inventory.`,
    `Insurance desk approved 18 of 24 pending claims.`,
    `Laboratory uploaded 37 reports for physician review.`,
  ];

  // Critical alerts based on data
  const criticalInventory = 9; // This would come from pharmacy store
  const pendingLabReports = 31; // This would come from lab store

  const alerts = [
    { label: "Pending payments", value: "$28.4k", tone: "amber" as const },
    { label: "Critical stock alerts", value: `${criticalInventory} items`, tone: "red" as const },
    { label: "Lab reports pending", value: pendingLabReports.toString(), tone: "blue" as const },
  ];

  if (!isClient) {
    return (
      <PageShell activeHref="/dashboard">
        <PageHeader
          eyebrow="Hospital Command Center"
          title="Dashboard"
          description="Track patient flow, clinical capacity, billing, inventory, and laboratory work from one operational view."
          actions={
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
              <Link href="/appointments">
                <Button variant="secondary" size="sm" type="button" className="w-full sm:w-auto">
                  <Calendar className="size-4" />
                  Book appointment
                </Button>
              </Link>
              <AddPatientButton />
            </div>
          }
        />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[var(--care-surface)] animate-pulse rounded-lg" />
          ))}
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell activeHref="/dashboard">
      <PageHeader
        eyebrow="Hospital Command Center"
        title="Dashboard"
        description="Track patient flow, clinical capacity, billing, inventory, and laboratory work from one operational view."
        actions={
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center w-full sm:w-auto">
            <Link href="/appointments">
              <Button variant="secondary" size="sm" type="button" className="w-full sm:w-auto">
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
            <div className="rounded-md m-3 bg-[var(--care-mint)]/20 px-3 py-2 text-sm font-semibold text-[var(--care-secondary-dark)]">
              $378k this week
            </div>
            <div className="mt-6 flex h-64 items-end gap-3 px-6 pb-4 sm:gap-5">
              {[
                { label: "Mon", value: "$42k", height: "48%" },
                { label: "Tue", value: "$58k", height: "66%" },
                { label: "Wed", value: "$51k", height: "58%" },
                { label: "Thu", value: "$73k", height: "84%" },
                { label: "Fri", value: "$67k", height: "76%" },
                { label: "Sat", value: "$49k", height: "56%" },
                { label: "Sun", value: "$38k", height: "43%" },
              ].map((day) => (
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
          title="Today's Appointments"
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
                {todayAppts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">
                      No appointments scheduled for today
                    </td>
                  </tr>
                ) : (
                  todayAppts.map((appointment, idx) => (
                    <tr className="hover:bg-[var(--hover-bg)]" key={idx}>
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
                        <StatusBadge
                          variant={
                            appointment.status === "Waiting" || appointment.status === "Sample due"
                              ? "warning"
                              : appointment.status === "Checked in"
                              ? "info"
                              : "default"
                          }
                        >
                          {appointment.status}
                        </StatusBadge>
                      </td>
                    </tr>
                  ))
                )}
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
            {activities.map((activity, idx) => (
              <div className="flex gap-3" key={idx}>
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
