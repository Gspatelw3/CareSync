import type { Metadata } from "next";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Filter, Plus } from "lucide-react";
import { ActionButton, SecondaryButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { FormField, FormSection } from "@/components/ui/forms/form-field";

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
            <ActionModal
              title="Filter Wards"
              subtitle="Filter by ward type, occupancy, or status."
              confirmLabel="Apply filters"
              trigger={
                <SecondaryButton className="w-full sm:w-auto" icon={<Filter className="size-4" />} message="">
                  Filter wards
                </SecondaryButton>
              }
            >
              <FormSection title="Ward Type">
                <FormField
                  label="Department"
                  type="select"
                  options={[
                    { label: "All wards", value: "all" },
                    { label: "ICU", value: "icu" },
                    { label: "Emergency", value: "emergency" },
                    { label: "General", value: "general" },
                    { label: "Maternity", value: "maternity" },
                    { label: "Pediatrics", value: "pediatrics" },
                    { label: "Isolation", value: "isolation" },
                    { label: "Recovery", value: "recovery" },
                  ]}
                />
              </FormSection>
              <FormSection title="Occupancy">
                <FormField
                  label="Availability"
                  type="select"
                  options={[
                    { label: "All", value: "all" },
                    { label: "Available beds only", value: "available" },
                    { label: "Near capacity (>80%)", value: "full" },
                  ]}
                />
              </FormSection>
              <FormSection title="Status">
                <FormField
                  label="Care level"
                  type="select"
                  options={[
                    { label: "All levels", value: "all" },
                    { label: "High dependency", value: "high" },
                    { label: "Acute care", value: "acute" },
                    { label: "Stable", value: "stable" },
                    { label: "Post-op", value: "postop" },
                  ]}
                />
              </FormSection>
            </ActionModal>
            <ActionModal
              title="Allocate Bed"
              subtitle="Assign a bed to an incoming patient."
              confirmLabel="Allocate bed"
              trigger={
                <ActionButton icon={<Plus className="size-4" />} message="">
                  Allocate bed
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
                    { label: "Sita Verma", value: "P-1021" },
                    { label: "Vikram Singh", value: "P-1019" },
                    { label: "Rohan Das", value: "P-1021" },
                    { label: "Aisha Patel", value: "P-1020" },
                    { label: "Lakshmi Nair", value: "P-1018" },
                    { label: "Deepak Kumar", value: "P-1017" },
                  ]}
                />
              </FormSection>
              <FormSection title="Ward & Bed">
                <FormField
                  label="Ward"
                  type="select"
                  options={[
                    { label: "ICU (3 available)", value: "icu" },
                    { label: "Emergency (4 available)", value: "emergency" },
                    { label: "General A (12 available)", value: "general-a" },
                    { label: "General B (6 available)", value: "general-b" },
                    { label: "Maternity (4 available)", value: "maternity" },
                    { label: "Pediatrics (5 available)", value: "pediatrics" },
                    { label: "Isolation (3 available)", value: "isolation" },
                    { label: "Recovery (4 available)", value: "recovery" },
                  ]}
                />
                <FormField label="Diagnosis" placeholder="e.g. Myocardial infarction" />
              </FormSection>
              <FormSection title="Attending">
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
        <Card title="Ward Overview" description="Bed occupancy by ward.">
          <div className="p-5">
            <div className="grid gap-4">
              {wards.map((w) => {
                const occupancyPct = Math.round((w.occupied / w.beds) * 100);
                return (
                  <div className="flex flex-col gap-2" key={w.ward}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[var(--text-primary)] w-24">{w.ward}</span>
                        <span className="text-xs text-[var(--text-muted)]">{w.nurse}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-semibold text-[var(--text-secondary)]">{w.occupied}/{w.beds}</span>
                        <span className={w.available > 0 ? "text-[var(--care-secondary)]" : "text-red-500"}>
                          {w.available} free
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--border-light)]">
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
          <div className="divide-y divide-[var(--table-divide)]">
            {admissions.map((a) => (
              <div className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-[var(--hover-bg)]" key={a.id}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{a.patient}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{a.ward} · {a.bed}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{a.diagnosis}</p>
                </div>
                <div className="shrink-0 text-right">
                  <StatusBadge
                    variant={a.status === "Critical" ? "danger" : a.status === "Discharge soon" ? "info" : "default"}
                  >
                    {a.status}
                  </StatusBadge>
                  <p className="mt-1 text-[11px] text-[var(--text-muted-light)]">{a.admitted}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}