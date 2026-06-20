import type { Metadata } from "next";
import Link from "next/link";
import {
    PageShell,
    PageHeader,
    Card,
    StatusBadge,
    StatCard,
} from "@/components/layout/page-shell";
import { Plus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { SearchInput } from "@/components/ui/search-input";
import { ActionModal, FormField, FormSection } from "@/components/ui/action-modal";
import { ViewAllButton } from "@/components/ui/view-all-button";

export const metadata: Metadata = {
    title: "Reports | Care Sync",
};

const reportCategories = [
    {
        title: "Clinical Reports",
        description:
            "Patient outcomes, diagnosis trends, and treatment efficacy.",
        reports: [
            { name: "Patient Admission Summary", period: "Monthly", updated: "18 Jun 2026", status: "Generated" },
            { name: "Diagnosis Frequency Report", period: "Quarterly", updated: "15 Jun 2026", status: "Generated" },
            { name: "Treatment Outcome Analysis", period: "Quarterly", updated: "10 Jun 2026", status: "Draft" },
            { name: "ICU Utilization Report", period: "Weekly", updated: "19 Jun 2026", status: "Generated" },
            { name: "Emergency Room Flow Analysis", period: "Monthly", updated: "12 Jun 2026", status: "Generated" },
            { name: "Surgery Success Rate Report", period: "Quarterly", updated: "08 Jun 2026", status: "Generated" },
            { name: "Pediatric Care Summary", period: "Monthly", updated: "05 Jun 2026", status: "Draft" },
            { name: "Cardiology Follow-up Report", period: "Weekly", updated: "19 Jun 2026", status: "Auto-generated" },
            { name: "Radiology Utilization Trends", period: "Monthly", updated: "01 Jun 2026", status: "Generated" },
            { name: "Maternity Care Outcomes", period: "Quarterly", updated: "25 May 2026", status: "Generated" },
            { name: "Mental Health Referral Analysis", period: "Monthly", updated: "20 May 2026", status: "Draft" },
            { name: "Critical Care Mortality Review", period: "Quarterly", updated: "15 May 2026", status: "Generated" },
        ],
    },
    {
        title: "Financial Reports",
        description:
            "Revenue summaries, billing trends, and insurance analytics.",
        reports: [
            { name: "Monthly Revenue Summary", period: "Monthly", updated: "01 Jun 2026", status: "Generated" },
            { name: "Pending Invoice Aging", period: "Weekly", updated: "19 Jun 2026", status: "Generated" },
            { name: "Insurance Claim Success Rate", period: "Monthly", updated: "01 Jun 2026", status: "Draft" },
            { name: "Collection Efficiency Report", period: "Monthly", updated: "01 Jun 2026", status: "Generated" },
            { name: "OPD Revenue Breakdown", period: "Weekly", updated: "18 Jun 2026", status: "Generated" },
            { name: "IPD Billing Summary", period: "Monthly", updated: "10 Jun 2026", status: "Auto-generated" },
            { name: "Pharmacy Revenue Report", period: "Monthly", updated: "05 Jun 2026", status: "Generated" },
            { name: "Lab Services Revenue", period: "Monthly", updated: "01 Jun 2026", status: "Generated" },
            { name: "Insurance Pending Clearance", period: "Daily", updated: "19 Jun 2026", status: "Generated" },
            { name: "Discount & Write-off Analysis", period: "Quarterly", updated: "20 May 2026", status: "Draft" },
            { name: "Year-over-Year Revenue Growth", period: "Annual", updated: "01 Apr 2026", status: "Generated" },
            { name: "Vendor Payment Reconciliation", period: "Monthly", updated: "28 May 2026", status: "Generated" },
        ],
    },
    {
        title: "Operational Reports",
        description:
            "Bed occupancy, staff allocation, and workflow efficiency.",
        reports: [
            { name: "Bed Occupancy Trends", period: "Daily", updated: "19 Jun 2026", status: "Auto-generated" },
            { name: "Appointment No-Show Rate", period: "Weekly", updated: "16 Jun 2026", status: "Generated" },
            { name: "Pharmacy Stock Report", period: "Weekly", updated: "18 Jun 2026", status: "Generated" },
            { name: "Lab Turnaround Time", period: "Monthly", updated: "01 Jun 2026", status: "Generated" },
            { name: "Staff Duty Roster Summary", period: "Weekly", updated: "17 Jun 2026", status: "Generated" },
            { name: "OT Utilization Report", period: "Daily", updated: "19 Jun 2026", status: "Auto-generated" },
            { name: "Ward-wise Patient Distribution", period: "Daily", updated: "19 Jun 2026", status: "Auto-generated" },
            { name: "Ambulance Dispatch Log", period: "Monthly", updated: "10 Jun 2026", status: "Generated" },
            { name: "Housekeeping & Sanitation Audit", period: "Weekly", updated: "15 Jun 2026", status: "Generated" },
            { name: "Medical Equipment Maintenance", period: "Monthly", updated: "05 Jun 2026", status: "Draft" },
            { name: "Dietary & Kitchen Operations", period: "Weekly", updated: "18 Jun 2026", status: "Generated" },
            { name: "Security Incident Report", period: "Monthly", updated: "01 Jun 2026", status: "Generated" },
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
            { name: "HIPAA Compliance Checklist", period: "Quarterly", updated: "15 May 2026", status: "Generated" },
            { name: "Waste Disposal Compliance", period: "Monthly", updated: "08 Jun 2026", status: "Generated" },
            { name: "License Renewal Tracker", period: "Annual", updated: "01 Jan 2026", status: "Generated" },
            { name: "Patient Rights & Ethics Audit", period: "Quarterly", updated: "20 Apr 2026", status: "Draft" },
            { name: "Clinical Trial Compliance", period: "Monthly", updated: "12 Jun 2026", status: "Generated" },
            { name: "Fire Safety Drill Report", period: "Monthly", updated: "03 Jun 2026", status: "Generated" },
            { name: "Data Privacy Audit Trail", period: "Quarterly", updated: "10 May 2026", status: "Generated" },
            { name: "Vendor Credential Verification", period: "Monthly", updated: "25 May 2026", status: "Draft" },
        ],
    },
];

const stats = [
    {
        label: "Report Templates",
        value: "64",
        delta: "8 new this month",
        detail: "across all categories",
    },
    {
        label: "Generated This Week",
        value: "18",
        delta: "12 auto-generated",
        detail: "6 manual",
    },
    {
        label: "Pending Drafts",
        value: "7",
        delta: "3 overdue",
        detail: "needs final review",
    },
    {
        label: "Scheduled Reports",
        value: "24",
        delta: "daily / weekly / monthly",
        detail: "auto-generated",
    },
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
                        <SearchInput placeholder="Search reports..." />
                        <ActionModal
                            title="Generate Report"
                            subtitle="Create a new report from available templates."
                            confirmLabel="Generate report"
                            trigger={
                                <ActionButton className="care-brand-gradient w-full sm:w-auto" icon={<Plus className="size-4" />} message="">
                                    Generate report
                                </ActionButton>
                            }
                        >
                            <FormSection title="Report Template">
                                <FormField
                                    label="Category"
                                    type="select"
                                    options={[
                                        { label: "Clinical Reports", value: "clinical" },
                                        { label: "Financial Reports", value: "financial" },
                                        { label: "Operational Reports", value: "operational" },
                                        { label: "Compliance Reports", value: "compliance" },
                                    ]}
                                />
                                <FormField
                                    label="Report type"
                                    type="select"
                                    options={[
                                        { label: "Patient Admission Summary", value: "admission" },
                                        { label: "Monthly Revenue Summary", value: "revenue" },
                                        { label: "Bed Occupancy Trends", value: "occupancy" },
                                        { label: "Infection Control Audit", value: "infection" },
                                        { label: "Custom report", value: "custom" },
                                    ]}
                                />
                            </FormSection>
                            <FormSection title="Parameters">
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField label="Start date" type="date" />
                                    <FormField label="End date" type="date" />
                                </div>
                                <FormField
                                    label="Format"
                                    type="select"
                                    options={[
                                        { label: "PDF", value: "pdf" },
                                        { label: "Excel", value: "excel" },
                                        { label: "CSV", value: "csv" },
                                    ]}
                                />
                            </FormSection>
                            <FormSection title="Notes">
                                <FormField label="Additional notes" type="textarea" placeholder="Any specific data points or filters..." />
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

            <div className="mt-6 grid gap-6">
                {reportCategories.map((category) => (
                    <Card
                        key={category.title}
                        title={category.title}
                        description={category.description}
                        action={
                            <ViewAllButton
                                label="View all"
                                title={category.title}
                                subtitle={`All reports in the ${category.title.toLowerCase()} category.`}
                                reports={category.reports}
                            />
                        }
                    >
                        <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
                            {category.reports.slice(0, 4).map((report) => (
                                <div
                                    className="flex items-center justify-between gap-4 bg-white px-5 py-4 hover:bg-slate-50"
                                    key={report.name}
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-950">
                                            {report.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-slate-500">
                                            {report.period} · Updated{" "}
                                            {report.updated}
                                        </p>
                                    </div>
                                    <StatusBadge
                                        variant={
                                            report.status === "Draft"
                                                ? "warning"
                                                : report.status ===
                                                    "Auto-generated"
                                                  ? "info"
                                                  : "default"
                                        }
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