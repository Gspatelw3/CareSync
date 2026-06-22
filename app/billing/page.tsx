import type { Metadata } from "next";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Filter, Plus } from "lucide-react";
import { ActionButton, SecondaryButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { FormField, FormSection } from "@/components/ui/forms/form-field";

export const metadata: Metadata = {
  title: "Billing | Care Sync",
};

const invoices = [
  { id: "INV-3421", patient: "Meera Iyer", service: "Cardiology consultation + ECG", amount: "$4,280", insurance: "Star Health", paid: "$3,240", balance: "$1,040", date: "19 Jun 2026", status: "Partial" },
  { id: "INV-3420", patient: "Arjun Menon", service: "Orthopedic surgery", amount: "$12,500", insurance: "ICICI Lombard", paid: "$12,500", balance: "$0", date: "18 Jun 2026", status: "Paid" },
  { id: "INV-3419", patient: "Sita Verma", service: "IPD - 3 days + medications", amount: "$8,750", insurance: "NIA", paid: "$6,000", balance: "$2,750", date: "17 Jun 2026", status: "Partial" },
  { id: "INV-3418", patient: "Vikram Singh", service: "ICU - 5 days + procedures", amount: "$24,300", insurance: "Apollo Munich", paid: "$0", balance: "$24,300", date: "16 Jun 2026", status: "Pending" },
  { id: "INV-3417", patient: "Rohan Das", service: "MRI + Neurologist consultation", amount: "$6,800", insurance: "Star Health", paid: "$6,800", balance: "$0", date: "15 Jun 2026", status: "Paid" },
  { id: "INV-3416", patient: "Aisha Patel", service: "Pediatric check-up + vaccines", amount: "$1,200", insurance: "Self-pay", paid: "$1,200", balance: "$0", date: "14 Jun 2026", status: "Paid" },
  { id: "INV-3415", patient: "Lakshmi Nair", service: "Maternity package", amount: "$15,000", insurance: "ICICI Lombard", paid: "$10,000", balance: "$5,000", date: "13 Jun 2026", status: "Partial" },
  { id: "INV-3414", patient: "Deepak Kumar", service: "Physiotherapy - 6 sessions", amount: "$3,600", insurance: "Self-pay", paid: "$0", balance: "$3,600", date: "12 Jun 2026", status: "Pending" },
];

const stats = [
  { label: "Total Revenue (MTD)", value: "$1.28M", delta: "+12.4% vs. last month", detail: "$378k this week" },
  { label: "Pending Payments", value: "$48.6k", delta: "18 invoices", detail: "avg. $2,700 each" },
  { label: "Insurance Claims", value: "24", delta: "18 approved", detail: "6 pending review" },
  { label: "Avg. Collection Rate", value: "87.3%", delta: "+2.1% vs. target", detail: "target: 85%" },
];

const claims = [
  { id: "CLM-089", patient: "Vikram Singh", insurer: "Apollo Munich", amount: "$24,300", submitted: "16 Jun 2026", status: "Under review" },
  { id: "CLM-088", patient: "Meera Iyer", insurer: "Star Health", amount: "$4,280", submitted: "19 Jun 2026", status: "Approved" },
  { id: "CLM-087", patient: "Sita Verma", insurer: "NIA", amount: "$8,750", submitted: "17 Jun 2026", status: "Partial approved" },
  { id: "CLM-086", patient: "Lakshmi Nair", insurer: "ICICI Lombard", amount: "$15,000", submitted: "13 Jun 2026", status: "Approved" },
  { id: "CLM-085", patient: "Deepak Kumar", insurer: "Self-pay", amount: "$3,600", submitted: "12 Jun 2026", status: "Pending" },
];

export default function BillingPage() {
  return (
    <PageShell activeHref="/billing">
      <PageHeader
        eyebrow="Revenue Cycle"
        title="Billing"
        description="Invoices, payment history, insurance claims, and pending balances."
        actions={
          <>
            <ActionModal
              title="Filter Invoices"
              subtitle="Filter by status, date range, or insurance provider."
              confirmLabel="Apply filters"
              trigger={
                <SecondaryButton className="w-full sm:w-auto" icon={<Filter className="size-4" />} message="">
                  Filter by status
                </SecondaryButton>
              }
            >
              <FormSection title="Status">
                <FormField
                  label="Invoice status"
                  type="select"
                  options={[
                    { label: "All", value: "all" },
                    { label: "Paid", value: "paid" },
                    { label: "Partial", value: "partial" },
                    { label: "Pending", value: "pending" },
                  ]}
                />
              </FormSection>
              <FormSection title="Date Range">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="From" type="date" />
                  <FormField label="To" type="date" />
                </div>
              </FormSection>
              <FormSection title="Insurance">
                <FormField
                  label="Provider"
                  type="select"
                  options={[
                    { label: "All providers", value: "all" },
                    { label: "Star Health", value: "star" },
                    { label: "ICICI Lombard", value: "icici" },
                    { label: "NIA", value: "nia" },
                    { label: "Apollo Munich", value: "apollo" },
                    { label: "Self-pay", value: "self" },
                  ]}
                />
              </FormSection>
            </ActionModal>
            <ActionModal
              title="Create Invoice"
              subtitle="Generate a new invoice for a patient."
              confirmLabel="Create invoice"
              trigger={
                <ActionButton icon={<Plus className="size-4" />} message="">
                  Create invoice
                </ActionButton>
              }
            >
              <FormSection title="Patient Information">
                <FormField
                  label="Patient"
                  type="select"
                    options={[
                      { label: "Meera Iyer", value: "P-1024" },
                      { label: "Arjun Menon", value: "P-1023" },
                      { label: "Sita Verma", value: "P-1022" },
                      { label: "Vikram Singh", value: "P-1019" },
                      { label: "Rohan Das", value: "P-1021" },
                      { label: "Aisha Patel", value: "P-1020" },
                      { label: "Lakshmi Nair", value: "P-1018" },
                      { label: "Deepak Kumar", value: "P-1017" },
                    ]}
                />
              </FormSection>
              <FormSection title="Service Details">
                <FormField label="Service description" placeholder="e.g. Cardiology consultation" />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Amount" type="number" placeholder="0.00" />
                  <FormField label="Insurance covered" type="number" placeholder="0.00" />
                </div>
                <FormField
                  label="Insurance provider"
                  type="select"
                  options={[
                    { label: "Self-pay", value: "self" },
                    { label: "Star Health", value: "star" },
                    { label: "ICICI Lombard", value: "icici" },
                    { label: "NIA", value: "nia" },
                    { label: "Apollo Munich", value: "apollo" },
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
        <Card title="Invoices" description="Recent invoices and payment status.">
          <DataTable headers={["Invoice", "Patient", "Service", "Amount", "Insurance", "Paid", "Balance", "Date", "Status"]}>
            {invoices.map((inv) => (
              <tr className="hover:bg-[var(--hover-bg)] cursor-pointer" key={inv.id}>
                <td className="px-5 py-4 font-semibold text-[var(--care-primary)] text-xs">{inv.id}</td>
                <td className="px-5 py-4 text-[var(--text-primary)] font-medium">{inv.patient}</td>
                <td className="px-5 py-4 text-[var(--text-muted)] text-xs max-w-[140px] truncate">{inv.service}</td>
                <td className="px-5 py-4 text-[var(--text-secondary)] font-medium">{inv.amount}</td>
                <td className="px-5 py-4 text-[var(--text-muted)] text-xs">{inv.insurance}</td>
                <td className="px-5 py-4 text-[var(--text-secondary)]">{inv.paid}</td>
                <td className="px-5 py-4 text-[var(--text-secondary)]">{inv.balance}</td>
                <td className="px-5 py-4 text-[var(--text-muted)] text-xs">{inv.date}</td>
                <td className="px-5 py-4">
                  <StatusBadge
                    variant={inv.status === "Pending" ? "danger" : inv.status === "Partial" ? "warning" : "default"}
                  >
                    {inv.status}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </DataTable>
        </Card>

        <Card title="Insurance Claims" description="Recent claim submissions and status.">
          <div className="divide-y divide-[var(--table-divide)]">
            {claims.map((c) => (
              <div className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-[var(--hover-bg)]" key={c.id}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{c.patient}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{c.insurer}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted-light)]">{c.id} · {c.submitted}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{c.amount}</p>
                  <StatusBadge
                    variant={c.status === "Under review" ? "warning" : c.status === "Pending" ? "danger" : "default"}
                  >
                    {c.status}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}