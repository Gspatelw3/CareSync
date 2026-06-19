import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader, Card, StatusBadge } from "@/components/layout/page-shell";
import { SvgIcon } from "@/components/layout/page-shell";
import { iconPaths } from "@/lib/icons";

export const metadata: Metadata = {
  title: "Reports | Care Sync",
};

const reportCategories = [
  {
    title: "Clinical Reports",
    description: "Patient outcomes, diagnosis trends, and treatment efficacy.",
    reports: [
      { name: "Patient Admission Summary", period: "Monthly", updated: "18 Jun 2026", status: "Generated" },
      { name: "Diagnosis Frequency Report", period: "Quarterly", updated: "15 Jun 2026", status: "Generated" },
      { name: "Treatment Outcome Analysis", period: "Quarterly", updated: "10 Jun 2026", status: "Draft" },
      { name: "ICU Utilization Report", period: "Weekly", updated: "19 Jun 2026", status: "Generated" },
    ],
  },
  {
    title: "Financial Reports",
    description: "Revenue summaries, billing trends, and insurance analytics.",
    reports: [
      { name: "Monthly Revenue Summary", period: "Monthly", updated: "01 Jun 2026", status: "Generated" },
      { name: "Pending Invoice Aging", period: "Weekly", updated: "19 Jun 2026", status: "Generated" },
      { name: "Insurance Claim Success Rate", period: "Monthly", updated: "01 Jun 2026", status: "Draft" },
      { name: "Collection Efficiency Report", period: "Monthly", updated: "01 Jun 2026", status: "Generated" },
    ],
  },
  {
    title: "Operational Reports",
    description: "Bed occupancy, staff allocation, and workflow efficiency.",
    reports: [
      { name: "Bed Occupancy Trends", period: "Daily", updated: "19 Jun 2026", status: "Auto-generated" },
      { name: "Appointment No-Show Rate", period: "Weekly", updated: "16 Jun 2026", status: "Generated" },
      { name: "Pharmacy Stock Report", period: "Weekly", updated: "18 Jun 2026", status: "Generated" },
      { name: "Lab Turnaround Time", period: "Monthly", updated: "01 Jun 2026", status: "Generated" },
    ],
  },
  {
    title: "Compliance Reports",
    description: "Regulatory filings, audit trails, and quality metrics.",
    reports: [
      { name: "Infection Control Audit", period: "Monthly", updated: "05 Jun 2026", status: "Generated" },
      { name: "Medical Records Compliance", period: "Quarterly", updated: "01 Apr 2026", status: "Generated" },
      { name: "Staff Credentialing Report", period: "Quarterly", updated: "01 May 2026", status: "Draft" },
      { name: "Safety Incident Log", period: "Monthly", updated: "10 Jun 2026", status: "Generated" },
    ],
  },
];

const stats = [
  { label: "Report Templates", value: "64", delta: "8 new this month", detail: "across all categories" },
  { label: "Generated This Week", value: "18", delta: "12 auto-generated", detail: "6 manual" },
  { label: "Pending Drafts", value: "7", delta: "3 overdue", detail: "needs final review" },
  { label: "Scheduled Reports", value: "24", delta: "daily / weekly / monthly", detail: "auto-generated" },
];

export default function ReportsPage() {
  return (
    <PageShell activeHref="/reports">
      <PageHeader
        eyebrow="Insights"
        title="Reports"
        description="Operational reports, utilization trends, revenue summaries, and clinical performance views."
        actions={
          <>
            <div className="relative">
              <SvgIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" paths={iconPaths.search} />
              <input
                className="h-10 w-52 rounded-md border border-[var(--care-border)] bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[var(--care-primary)]"
                placeholder="Search reports..."
                type="search"
              />
            </div>
            <Link
              className="care-brand-gradient inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition hover:brightness-95"
              href="/reports"
            >
              <SvgIcon className="size-4" paths={iconPaths.plus} />
              Generate report
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

      <div className="mt-6 grid gap-6">
        {reportCategories.map((category) => (
          <Card
            key={category.title}
            title={category.title}
            description={category.description}
            action={
              <Link
                className="text-sm font-semibold text-[var(--care-primary)] hover:text-[var(--care-primary-dark)]"
                href="/reports"
              >
                View all
              </Link>
            }
          >
            <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
              {category.reports.map((report) => (
                <div
                  className="flex items-center justify-between gap-4 bg-white px-5 py-4 hover:bg-slate-50"
                  key={report.name}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-950">{report.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {report.period} · Updated {report.updated}
                    </p>
                  </div>
                  <StatusBadge
                    variant={report.status === "Draft" ? "warning" : report.status === "Auto-generated" ? "info" : "default"}
                  >
                    {report.status}
                  </StatusBadge>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
}