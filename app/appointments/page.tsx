import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Calendar, Plus } from "lucide-react";
import { ActionButton, SecondaryButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { FormField, FormSection } from "@/components/ui/forms/form-field";

export const metadata: Metadata = {
  title: "Appointments | Care Sync",
};

const appointments = [
  { time: "09:00", patient: "Ravi Kumar", care: "Cardiology", doctor: "Dr. Kavya Rao", type: "Follow-up", status: "Checked in" },
  { time: "09:30", patient: "Neha Joshi", care: "Dermatology", doctor: "Dr. Sunita Reddy", type: "Consultation", status: "Waiting" },
  { time: "10:00", patient: "Mohan Das", care: "Orthopedics", doctor: "Dr. Neil Shah", type: "Surgery prep", status: "Confirmed" },
  { time: "10:30", patient: "Sita Verma", care: "General", doctor: "Dr. Amina Khan", type: "Check-up", status: "Checked in" },
  { time: "11:00", patient: "Aisha Patel", care: "Pediatrics", doctor: "Dr. Sneha Kapoor", type: "Vaccination", status: "Waiting" },
  { time: "11:30", patient: "Vikram Singh", care: "Neurology", doctor: "Dr. Amit Verma", type: "Follow-up", status: "Confirmed" },
  { time: "13:00", patient: "Lakshmi Nair", care: "Obstetrics", doctor: "Dr. Priya Mehta", type: "Check-up", status: "Confirmed" },
  { time: "14:00", patient: "Deepak Kumar", care: "Orthopedics", doctor: "Dr. Neil Shah", type: "Physiotherapy", status: "Sample due" },
  { time: "15:00", patient: "Priya Iyer", care: "Cardiology", doctor: "Dr. Kavya Rao", type: "ECG", status: "Confirmed" },
  { time: "16:00", patient: "Arun Mehta", care: "Pulmonology", doctor: "Dr. Rajesh Gupta", type: "Consultation", status: "Waiting" },
];

const stats = [
  { label: "Today's Appointments", value: "324", delta: "71 pending", detail: "89 completed check-ins" },
  { label: "Checked In", value: "42", delta: "12 in waiting", detail: "avg. 14 min wait" },
  { label: "Cancelled Today", value: "8", delta: "3 rescheduled", detail: "5 no-shows" },
  { label: "Next Week", value: "418", delta: "24 open slots", detail: "89% booked" },
];

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const weekSlots = [312, 298, 324, 287, 341, 156, 89];
const weekMax = 360;

export default function AppointmentsPage() {
  return (
    <PageShell activeHref="/appointments">
      <PageHeader
        eyebrow="Scheduling"
        title="Appointments"
        description="Calendar views, appointment lists, booking, and check-ins."
        actions={
          <>
            <ActionModal
              title="Calendar View"
              subtitle="Weekly appointment calendar — click a slot to view details."
              confirmLabel="Close"
              trigger={
                <SecondaryButton className="w-full sm:w-auto" icon={<Calendar className="size-4" />} message="">
                  Calendar view
                </SecondaryButton>
              }
            >
              <div className="rounded-lg border border-[var(--border-default)]">
                <div className="grid grid-cols-7 border-b border-[var(--border-default)] bg-[var(--care-surface)] text-center text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div className="border-r border-[var(--border-default)] px-2 py-3 last:border-r-0" key={d}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 text-center text-sm">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const day = i + 1;
                    const hasAppt = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29].includes(day);
                    const isToday = day === 19;
                    return (
                      <div
                        className={`border-b border-r border-[var(--border-light)] px-1 py-3 last:border-r-0 ${
                          isToday ? "bg-[var(--care-mint)]/10 ring-1 ring-inset ring-[var(--care-primary)] font-semibold" : ""
                        }`}
                        key={day}
                      >
                        <span className={isToday ? "text-[var(--care-primary)]" : "text-[var(--text-secondary)]"}>{day}</span>
                        {hasAppt && (
                          <div className="mt-1 mx-auto h-1.5 w-1.5 rounded-full bg-[var(--care-primary)]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="mt-3 text-xs text-[var(--text-muted)] text-center">
                Showing June 2026 · Dots indicate scheduled appointments · <span className="font-semibold text-[var(--care-primary)]">19 Jun</span> is today
              </p>
            </ActionModal>
            <ActionModal
              title="Book Appointment"
              subtitle="Schedule a new patient appointment."
              confirmLabel="Book appointment"
              trigger={
                <ActionButton icon={<Plus className="size-4" />} message="">
                  Book appointment
                </ActionButton>
              }
            >
              <FormSection title="Patient">
                <FormField
                  label="Patient name"
                  type="select"
                  options={[
                    { label: "Meera Iyer", value: "P-1024" },
                    { label: "Arjun Menon", value: "P-1023" },
                    { label: "Priya Nair", value: "P-1022" },
                    { label: "Rohan Das", value: "P-1021" },
                    { label: "Sneha Patel", value: "P-1020" },
                    { label: "Vikram Singh", value: "P-1019" },
                    { label: "Anita Sharma", value: "P-1018" },
                    { label: "Deepak Kumar", value: "P-1017" },
                  ]}
                />
              </FormSection>
              <FormSection title="Schedule">
                <FormField label="Date" type="date" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Time" type="text" placeholder="e.g. 10:00" />
                  <FormField
                    label="Type"
                    type="select"
                    options={[
                      { label: "Consultation", value: "consultation" },
                      { label: "Follow-up", value: "followup" },
                      { label: "Check-up", value: "checkup" },
                      { label: "Surgery prep", value: "surgery" },
                      { label: "Vaccination", value: "vaccination" },
                      { label: "ECG", value: "ecg" },
                      { label: "Physiotherapy", value: "physio" },
                    ]}
                  />
                </div>
              </FormSection>
              <FormSection title="Care Team">
                <FormField
                  label="Department"
                  type="select"
                  options={[
                    { label: "Cardiology", value: "cardiology" },
                    { label: "Orthopedics", value: "orthopedics" },
                    { label: "General", value: "general" },
                    { label: "Neurology", value: "neurology" },
                    { label: "Pediatrics", value: "pediatrics" },
                    { label: "Obstetrics", value: "obstetrics" },
                    { label: "Dermatology", value: "dermatology" },
                    { label: "Pulmonology", value: "pulmonology" },
                  ]}
                />
                <FormField
                  label="Doctor"
                  type="select"
                  options={[
                    { label: "Dr. Kavya Rao", value: "D-042" },
                    { label: "Dr. Neil Shah", value: "D-041" },
                    { label: "Dr. Amina Khan", value: "D-040" },
                    { label: "Dr. Amit Verma", value: "D-039" },
                    { label: "Dr. Sneha Kapoor", value: "D-038" },
                    { label: "Dr. Priya Mehta", value: "D-037" },
                    { label: "Dr. Rajesh Gupta", value: "D-036" },
                    { label: "Dr. Sunita Reddy", value: "D-035" },
                  ]}
                />
              </FormSection>
            </ActionModal>
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} detail={item.detail} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Today's Schedule" description="All appointments for today, 19 June 2026.">
          <DataTable headers={["Time", "Patient", "Care", "Doctor", "Type", "Status"]}>
            {appointments.map((a) => (
              <tr className="hover:bg-[var(--hover-bg)] cursor-pointer" key={`${a.time}-${a.patient}`}>
                <td className="px-5 py-4 font-semibold text-[var(--text-primary)]">{a.time}</td>
                <td className="px-5 py-4 text-[var(--text-secondary)] font-medium">{a.patient}</td>
                <td className="px-5 py-4 text-[var(--text-secondary)]">{a.care}</td>
                <td className="px-5 py-4 text-[var(--text-secondary)]">{a.doctor}</td>
                <td className="px-5 py-4 text-[var(--text-muted)] text-xs">{a.type}</td>
                <td className="px-5 py-4">
                  <StatusBadge
                    variant={a.status === "Waiting" || a.status === "Sample due" ? "warning" : "default"}
                  >
                    {a.status}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </DataTable>
        </Card>

        <div className="space-y-6">
          <section className="rounded-lg border border-[var(--care-border)] bg-[var(--card-bg)] p-5 shadow-sm shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Weekly Volume</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Appointments by day this week.</p>
            <div className="mt-5 flex h-48 items-end gap-2 border-b border-l border-[var(--border-default)] px-1 pb-3">
              {weekDays.map((day, i) => (
                <div className="flex h-full flex-1 flex-col items-center justify-end gap-1.5" key={day}>
                  <span className="text-[11px] font-semibold text-[var(--text-muted)]">{weekSlots[i]}</span>
                  <div
                    className="care-brand-gradient-vertical w-full rounded-t-md"
                    style={{ height: `${(weekSlots[i] / weekMax) * 100}%` }}
                  />
                  <span className="text-[11px] font-medium text-[var(--text-muted)]">{day}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--care-border)] bg-[var(--card-bg)] p-5 shadow-sm shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Quick Stats</h2>
            <div className="mt-5 grid gap-4">
              <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Avg. consultation time</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">18 min</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Peak hour</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">10:00–11:00</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">No-show rate</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">4.2%</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Reschedule requests</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">12</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}