import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader, Card, Table, StatusBadge } from "@/components/layout/page-shell";
import { SvgIcon } from "@/components/layout/page-shell";
import { iconPaths } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Beds | Care Sync",
};

const wards = [
  { ward: "ICU", beds: 24, occupied: 21, available: 3, nurse: "Sister Anjali", status: "High dependency" },
  { ward: "Emergency", beds: 18, occupied: 14, available: 4, nurse: "Sister Priya", status: "Acute care" },
  { ward: "General A", beds: 40, occupied: 28, available: 12, nurse: "Sister Meera", status: "Stable" },
  { ward: "General B", beds: 36, occupied: 30, available: 6, nurse: "Sister Kavita", status: "Stable" },
  { ward: "Maternity", beds: 20, occupied: 16, available: 4, nurse: "Sister Deepa", status: "Maternity care" },
  { ward: "Pediatrics", beds: 16, occupied: 11, available: 5, nurse: "Sister Rani", status: "Children's care" },
  { ward: "Isolation", beds: 8, occupied: 5, available: 3, nurse: "Sister Neha", status: "Infection control" },
  { ward: "Recovery", beds: 12, occupied: 8, available: 4, nurse: "Sister Lata", status: "Post-op" },
];

const admissions = [
  { id: "ADM-241", patient: "Vikram Singh", ward: "ICU", bed: "ICU-07", doctor: "Dr. Kavya Rao", admitted: "14 Jun 2026", diagnosis: "Myocardial infarction", status: "Critical" },
  { id: "ADM-240", patient: "Sita Verma", ward: "General A", bed: "GA-12", doctor: "Dr. Amina Khan", admitted: "16 Jun 2026", diagnosis: "Pneumonia", status: "Stable" },
  { id: "ADM-239", patient: "Lakshmi Nair", ward: "Maternity", bed: "MT-04", doctor: "Dr. Priya Mehta", admitted: "17 Jun 2026", diagnosis: "Antenatal monitoring", status: "Stable" },
  { id: "ADM-238", patient: "Rohan Das", ward: "General B", bed: "GB-08", doctor: "Dr. Amit Verma", admitted: "16 Jun 2026", diagnosis: "Migraine", status: "Observation" },
  { id: "ADM-237", patient: "Aisha Patel", ward: "Pediatrics", bed: "PD-03", doctor: "Dr. Sneha Kapoor", admitted: "18 Jun 2026", diagnosis: "Viral fever", status: "Recovering" },
  { id: "ADM-236", patient: "Mohan Das", ward: "Recovery", bed: "RC-02", doctor: "Dr. Neil Shah", admitted: "15 Jun 2026", diagnosis: "Post-surgery recovery", status: "Discharge soon" },
];

const stats = [
  { label: "Total Beds", value: "174", delta: "58 available", detail: "77% occupancy" },
  { label: "ICU Beds", value: "24", delta: "3 available", detail: "87.5% occupancy" },
  { label: "Admissions Today", value: "7", delta: "3 discharges", detail: "net +4" },
  { label: "Avg. Stay", value: "5.8 days", delta: "ICU: 8.2 days", detail: "General: 4.1 days" },
];

export default function InpatientPage() {
  return (
    <PageShell activeHref="/inpatient">
      <PageHeader
        eyebrow="Inpatient Care"
        title="Beds"
        description="Bed allocation, ward management, admissions, and discharge tracking."
        actions={
          <>
            <Link
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--care-border)] bg-white px-3 text-sm font-semibold text-[var(--care-primary)] transition hover:bg-[var(--care-surface)]"
              href="/inpatient"
            >
              <SvgIcon className="size-4" paths={iconPaths.filter} />
              Filter wards
            </Link>
            <Link
              className="care-brand-gradient inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition hover:brightness-95"
              href="/inpatient"
            >
              <SvgIcon className="size-4" paths={iconPaths.plus} />
              Allocate bed
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
        <Card title="Ward Overview" description="Bed occupancy by ward.">
          <div className="p-5">
            <div className="grid gap-4">
              {wards.map((w) => {
                const occupancyPct = Math.round((w.occupied / w.beds) * 100);
                return (
                  <div className="flex flex-col gap-2" key={w.ward}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-slate-950 w-24">{w.ward}</span>
                        <span className="text-xs text-slate-500">{w.nurse}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-semibold text-slate-700">{w.occupied}/{w.beds}</span>
                        <span className={w.available > 0 ? "text-[var(--care-secondary)]" : "text-red-500"}>
                          {w.available} free
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full ${
                          occupancyPct > 85 ? "bg-red-400" : occupancyPct > 65 ? "bg-amber-400" : "bg-[var(--care-mint)]"
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card title="Current Admissions" description="Active inpatients.">
          <div className="divide-y divide-slate-100">
            {admissions.map((a) => (
              <div className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-slate-50" key={a.id}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-950">{a.patient}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{a.ward} · {a.bed}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{a.diagnosis}</p>
                </div>
                <div className="shrink-0 text-right">
                  <StatusBadge
                    variant={a.status === "Critical" ? "danger" : a.status === "Discharge soon" ? "info" : "default"}
                  >
                    {a.status}
                  </StatusBadge>
                  <p className="mt-1 text-[11px] text-slate-400">{a.admitted}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}