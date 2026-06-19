import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader, Card, Table, StatusBadge } from "@/components/layout/page-shell";
import { SvgIcon } from "@/components/layout/page-shell";
import { iconPaths } from "@/lib/icons";

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
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--care-border)] bg-white px-3 text-sm font-semibold text-[var(--care-primary)] transition hover:bg-[var(--care-surface)]"
              href="/appointments"
            >
              <SvgIcon className="size-4" paths={iconPaths.calendar} />
              Calendar view
            </Link>
            <Link
              className="care-brand-gradient inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition hover:brightness-95"
              href="/appointments"
            >
              <SvgIcon className="size-4" paths={iconPaths.plus} />
              Book appointment
            </Link>
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div className="rounded-lg border border-[var(--care-border)] bg-white p-4 shadow-sm shadow-[var(--care-primary)]/5" key={item.label}>
            <p className="text-sm font-medium text-slate-600">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-[var(--care-secondary)]">{item.delta}</span>
              <span className="text-slate-500">{item.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Today's Schedule" description="All appointments for today, 19 June 2026.">
          <Table headers={["Time", "Patient", "Care", "Doctor", "Type", "Status"]}>
            {appointments.map((a) => (
              <tr className="hover:bg-slate-50 cursor-pointer" key={`${a.time}-${a.patient}`}>
                <td className="px-5 py-4 font-semibold text-slate-950">{a.time}</td>
                <td className="px-5 py-4 text-slate-700 font-medium">{a.patient}</td>
                <td className="px-5 py-4 text-slate-700">{a.care}</td>
                <td className="px-5 py-4 text-slate-700">{a.doctor}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{a.type}</td>
                <td className="px-5 py-4">
                  <StatusBadge
                    variant={a.status === "Waiting" || a.status === "Sample due" ? "warning" : "default"}
                  >
                    {a.status}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        <div className="space-y-6">
          <section className="rounded-lg border border-[var(--care-border)] bg-white p-5 shadow-sm shadow-[var(--care-primary)]/5">
            <h2 className="text-lg font-semibold text-slate-950">Weekly Volume</h2>
            <p className="mt-1 text-sm text-slate-600">Appointments by day this week.</p>
            <div className="mt-5 flex h-48 items-end gap-2 border-b border-l border-slate-200 px-1 pb-3">
              {weekDays.map((day, i) => (
                <div className="flex h-full flex-1 flex-col items-center justify-end gap-1.5" key={day}>
                  <span className="text-[11px] font-semibold text-slate-500">{weekSlots[i]}</span>
                  <div
                    className="care-brand-gradient-vertical w-full rounded-t-md"
                    style={{ height: `${(weekSlots[i] / weekMax) * 100}%` }}
                  />
                  <span className="text-[11px] font-medium text-slate-500">{day}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--care-border)] bg-white p-5 shadow-sm shadow-[var(--care-primary)]/5">
            <h2 className="text-lg font-semibold text-slate-950">Quick Stats</h2>
            <div className="mt-5 grid gap-4">
              <div className="flex items-center justify-between rounded-md border border-slate-200 p-3">
                <span className="text-sm font-medium text-slate-700">Avg. consultation time</span>
                <span className="text-sm font-semibold text-slate-950">18 min</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-200 p-3">
                <span className="text-sm font-medium text-slate-700">Peak hour</span>
                <span className="text-sm font-semibold text-slate-950">10:00–11:00</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-200 p-3">
                <span className="text-sm font-medium text-slate-700">No-show rate</span>
                <span className="text-sm font-semibold text-slate-950">4.2%</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-slate-200 p-3">
                <span className="text-sm font-medium text-slate-700">Reschedule requests</span>
                <span className="text-sm font-semibold text-slate-950">12</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}