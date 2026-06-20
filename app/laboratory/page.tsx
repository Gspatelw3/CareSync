import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader, Card, Table, StatusBadge, StatCard } from "@/components/layout/page-shell";
import { Filter, Plus } from "lucide-react";
import { ActionButton, SecondaryButton } from "@/components/ui/action-buttons";
import { ActionModal, FormField, FormSection } from "@/components/ui/action-modal";

export const metadata: Metadata = {
  title: "Laboratory | Care Sync",
};

const testRequests = [
  { id: "LAB-341", patient: "Meera Iyer", test: "Complete Blood Count", doctor: "Dr. Kavya Rao", requested: "19 Jun 2026", priority: "Urgent", status: "Sample collected" },
  { id: "LAB-340", patient: "Arjun Menon", test: "X-ray Left Knee", doctor: "Dr. Neil Shah", requested: "19 Jun 2026", priority: "Normal", status: "Awaiting sample" },
  { id: "LAB-339", patient: "Sita Verma", test: "Blood Culture", doctor: "Dr. Amina Khan", requested: "18 Jun 2026", priority: "Urgent", status: "In progress" },
  { id: "LAB-338", patient: "Vikram Singh", test: "Troponin I", doctor: "Dr. Kavya Rao", requested: "18 Jun 2026", priority: "STAT", status: "Report ready" },
  { id: "LAB-337", patient: "Rohan Das", test: "MRI Brain", doctor: "Dr. Amit Verma", requested: "17 Jun 2026", priority: "Normal", status: "Report ready" },
  { id: "LAB-336", patient: "Aisha Patel", test: "Blood Glucose", doctor: "Dr. Sneha Kapoor", requested: "17 Jun 2026", priority: "Normal", status: "Reviewed" },
  { id: "LAB-335", patient: "Lakshmi Nair", test: "Ultrasound", doctor: "Dr. Priya Mehta", requested: "16 Jun 2026", priority: "Normal", status: "Reviewed" },
  { id: "LAB-334", patient: "Deepak Kumar", test: "Lipid Profile", doctor: "Dr. Neil Shah", requested: "16 Jun 2026", priority: "Normal", status: "Awaiting sample" },
];

const stats = [
  { label: "Total Requests", value: "187", delta: "31 pending", detail: "this week" },
  { label: "Awaiting Collection", value: "24", delta: "8 urgent", detail: "avg. 45 min delay" },
  { label: "In Progress", value: "42", delta: "12 STAT", detail: "avg. 3.2 hr turnaround" },
  { label: "Reports Ready", value: "28", delta: "14 unread", detail: "awaiting review" },
];

const reportStatus = (status: string) => {
  if (status === "STAT") return "danger";
  if (status === "Urgent") return "warning";
  return "info";
};

const testStatus = (status: string) => {
  if (status === "Report ready") return "info";
  if (status === "Awaiting sample") return "warning";
  if (status === "In progress") return "default";
  if (status === "Sample collected") return "default";
  return "default";
};

const departments = [
  { name: "Hematology", tests: 42, pending: 8, turnaround: "2.4 hrs" },
  { name: "Microbiology", tests: 28, pending: 6, turnaround: "4.8 hrs" },
  { name: "Biochemistry", tests: 56, pending: 12, turnaround: "1.8 hrs" },
  { name: "Radiology", tests: 38, pending: 5, turnaround: "3.1 hrs" },
  { name: "Pathology", tests: 23, pending: 3, turnaround: "5.2 hrs" },
];

export default function LaboratoryPage() {
  return (
    <PageShell activeHref="/laboratory">
      <PageHeader
        eyebrow="Diagnostics"
        title="Laboratory"
        description="Test requests, sample collection, report uploads, and review queues."
        actions={
          <>
            <ActionModal
              title="Filter by Department"
              subtitle="Filter lab requests by department and priority."
              confirmLabel="Apply filters"
              trigger={
                <SecondaryButton className="w-full sm:w-auto" icon={<Filter className="size-4" />} message="">
                  Filter by department
                </SecondaryButton>
              }
            >
              <FormSection title="Department">
                <FormField
                  label="Lab department"
                  type="select"
                  options={[
                    { label: "All departments", value: "all" },
                    { label: "Hematology", value: "hematology" },
                    { label: "Microbiology", value: "microbiology" },
                    { label: "Biochemistry", value: "biochemistry" },
                    { label: "Radiology", value: "radiology" },
                    { label: "Pathology", value: "pathology" },
                  ]}
                />
              </FormSection>
              <FormSection title="Priority">
                <FormField
                  label="Priority level"
                  type="select"
                  options={[
                    { label: "All priorities", value: "all" },
                    { label: "STAT", value: "stat" },
                    { label: "Urgent", value: "urgent" },
                    { label: "Normal", value: "normal" },
                  ]}
                />
              </FormSection>
              <FormSection title="Status">
                <FormField
                  label="Test status"
                  type="select"
                  options={[
                    { label: "All statuses", value: "all" },
                    { label: "Awaiting sample", value: "awaiting" },
                    { label: "Sample collected", value: "collected" },
                    { label: "In progress", value: "progress" },
                    { label: "Report ready", value: "ready" },
                    { label: "Reviewed", value: "reviewed" },
                  ]}
                />
              </FormSection>
            </ActionModal>
            <ActionModal
              title="Create Test Request"
              subtitle="Submit a new laboratory test request."
              confirmLabel="Create request"
              trigger={
                <ActionButton icon={<Plus className="size-4" />} message="">
                  Create test request
                </ActionButton>
              }
            >
              <FormSection title="Patient & Doctor">
                <FormField
                  label="Patient"
                  type="select"
                  options={[
                    { label: "Meera Iyer", value: "P-1024" },
                    { label: "Arjun Menon", value: "P-1023" },
                    { label: "Sita Verma", value: "P-1021" },
                    { label: "Vikram Singh", value: "P-1019" },
                    { label: "Rohan Das", value: "P-1021" },
                    { label: "Aisha Patel", value: "P-1020" },
                  ]}
                />
                <FormField
                  label="Referring doctor"
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
              <FormSection title="Test Details">
                <FormField label="Test name" placeholder="e.g. Complete Blood Count" />
                <FormField
                  label="Department"
                  type="select"
                  options={[
                    { label: "Hematology", value: "hematology" },
                    { label: "Microbiology", value: "microbiology" },
                    { label: "Biochemistry", value: "biochemistry" },
                    { label: "Radiology", value: "radiology" },
                    { label: "Pathology", value: "pathology" },
                  ]}
                />
                <FormField
                  label="Priority"
                  type="select"
                  options={[
                    { label: "Normal", value: "normal" },
                    { label: "Urgent", value: "urgent" },
                    { label: "STAT", value: "stat" },
                  ]}
                />
              </FormSection>
              <FormSection title="Notes">
                <FormField label="Clinical notes" type="textarea" placeholder="Any relevant clinical information..." />
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
        <Card title="Test Requests" description="All lab requests sorted by priority.">
          <Table headers={["ID", "Patient", "Test", "Doctor", "Requested", "Priority", "Status"]}>
            {testRequests.map((r) => (
              <tr className="hover:bg-slate-50 cursor-pointer" key={r.id}>
                <td className="px-5 py-4 font-semibold text-[var(--care-primary)] text-xs">{r.id}</td>
                <td className="px-5 py-4 text-slate-950 font-medium">{r.patient}</td>
                <td className="px-5 py-4 text-slate-700">{r.test}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{r.doctor}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{r.requested}</td>
                <td className="px-5 py-4">
                  <StatusBadge variant={reportStatus(r.priority)}>{r.priority}</StatusBadge>
                </td>
                <td className="px-5 py-4">
                  <StatusBadge variant={testStatus(r.status)}>{r.status}</StatusBadge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>

        <Card title="Department Summary" description="Workload by lab department.">
          <div className="p-5">
            <div className="grid gap-5">
              {departments.map((d) => (
                <div className="flex flex-col gap-2" key={d.name}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-950">{d.name}</span>
                    <span className="text-xs text-slate-500">{d.turnaround} avg.</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600">{d.tests} tests this week</span>
                    <span className={d.pending > 0 ? "font-semibold text-amber-600" : "text-slate-500"}>
                      {d.pending} pending
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-[var(--care-primary)]"
                      style={{ width: `${((d.tests - d.pending) / d.tests) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}