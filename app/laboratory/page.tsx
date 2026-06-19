import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader, Card, Table, StatusBadge } from "@/components/layout/page-shell";
import { SvgIcon } from "@/components/layout/page-shell";
import { iconPaths } from "@/lib/icons";
import { ActionButton, SecondaryButton } from "@/components/ui/action-buttons";

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
            <SecondaryButton icon={<SvgIcon className="size-4" paths={iconPaths.filter} />} message="Opening department filter options.">
              Filter by department
            </SecondaryButton>
            <ActionButton icon={<SvgIcon className="size-4" paths={iconPaths.plus} />} message="New test request form opened.">
              Create test request
            </ActionButton>
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