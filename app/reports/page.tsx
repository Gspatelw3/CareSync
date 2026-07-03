"use client";

import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Download, Calendar } from "lucide-react";
import { ActionButton, SecondaryButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { FormField } from "@/components/ui/forms/form-field";

const reportCategories = [
    {
        title: "Patient Reports",
        description:
            "Patient demographics, admission trends, and health metrics.",
        reports: [
            {
                name: "Patient Census",
                period: "Daily",
                updated: "19 Jun 2026",
                status: "Generated" as const,
            },
            {
                name: "Admission Trends",
                period: "Monthly",
                updated: "01 Jun 2026",
                status: "Auto-generated" as const,
            },
            {
                name: "Patient Satisfaction",
                period: "Quarterly",
                updated: "01 Apr 2026",
                status: "Draft" as const,
            },
        ],
    },
    {
        title: "Financial Reports",
        description: "Revenue, billing, and payment analytics.",
        reports: [
            {
                name: "Revenue Summary",
                period: "Monthly",
                updated: "19 Jun 2026",
                status: "Generated" as const,
            },
            {
                name: "Insurance Claims",
                period: "Monthly",
                updated: "15 Jun 2026",
                status: "Generated" as const,
            },
            {
                name: "Outstanding Payments",
                period: "Weekly",
                updated: "19 Jun 2026",
                status: "Auto-generated" as const,
            },
        ],
    },
    {
        title: "Operational Reports",
        description:
            "Staff performance, resource utilization, and efficiency metrics.",
        reports: [
            {
                name: "Doctor Performance",
                period: "Monthly",
                updated: "01 Jun 2026",
                status: "Generated" as const,
            },
            {
                name: "Bed Occupancy",
                period: "Daily",
                updated: "19 Jun 2026",
                status: "Auto-generated" as const,
            },
            {
                name: "Pharmacy Usage",
                period: "Monthly",
                updated: "01 Jun 2026",
                status: "Draft" as const,
            },
        ],
    },
    {
        title: "Laboratory Reports",
        description: "Test volumes, turnaround times, and quality metrics.",
        reports: [
            {
                name: "Test Volume Analysis",
                period: "Monthly",
                updated: "01 Jun 2026",
                status: "Generated" as const,
            },
            {
                name: "Turnaround Time",
                period: "Weekly",
                updated: "19 Jun 2026",
                status: "Auto-generated" as const,
            },
        ],
    },
];

export default function ReportsPage() {
    return (
        <PageShell activeHref="/reports">
            <PageHeader
                eyebrow="Analytics & Insights"
                title="Reports"
                description="Generate and download operational, financial, and clinical reports."
                actions={
                    <ActionModal
                        title="Generate Report"
                        subtitle="Select report type and date range to generate a new report."
                        confirmLabel="Generate"
                        trigger={
                            <ActionButton
                                icon={<Calendar className="size-4" />}
                                message=""
                            >
                                Generate report
                            </ActionButton>
                        }
                    >
                        <div className="space-y-4">
                            <FormField
                                label="Report Type"
                                type="select"
                                value=""
                                onChange={() => {}}
                                options={[
                                    {
                                        label: "Patient Census",
                                        value: "Patient Census",
                                    },
                                    {
                                        label: "Revenue Summary",
                                        value: "Revenue Summary",
                                    },
                                    {
                                        label: "Bed Occupancy",
                                        value: "Bed Occupancy",
                                    },
                                    {
                                        label: "Doctor Performance",
                                        value: "Doctor Performance",
                                    },
                                    {
                                        label: "Test Volume Analysis",
                                        value: "Test Volume Analysis",
                                    },
                                ]}
                            />
                            <FormField
                                label="Period"
                                type="select"
                                value=""
                                onChange={() => {}}
                                options={[
                                    { label: "Daily", value: "Daily" },
                                    { label: "Weekly", value: "Weekly" },
                                    { label: "Monthly", value: "Monthly" },
                                    { label: "Quarterly", value: "Quarterly" },
                                    { label: "Yearly", value: "Yearly" },
                                ]}
                            />
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                                    Date Range
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        type="date"
                                        className="rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                                    />
                                    <input
                                        type="date"
                                        className="rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </ActionModal>
                }
            />

            <div className="mt-6 grid gap-6">
                {reportCategories.map((category) => (
                    <Card
                        key={category.title}
                        title={category.title}
                        description={category.description}
                    >
                        <div className="divide-y divide-[var(--table-divide)]">
                            {category.reports.map((report) => (
                                <div
                                    className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-[var(--hover-bg)]"
                                    key={report.name}
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                                            {report.name}
                                        </p>
                                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                                            {category.title} · {report.period} ·
                                            Updated {report.updated}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`text-xs font-medium ${
                                                report.status === "Generated"
                                                    ? "text-[var(--care-secondary)]"
                                                    : report.status === "Draft"
                                                      ? "text-amber-600"
                                                      : "text-blue-600"
                                            }`}
                                        >
                                            {report.status}
                                        </span>
                                        <SecondaryButton
                                            icon={
                                                <Download className="size-4" />
                                            }
                                            message=""
                                        >
                                            Download
                                        </SecondaryButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </PageShell>
    );
}
