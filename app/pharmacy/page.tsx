import type { Metadata } from "next";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { SearchInput } from "@/components/ui/search-input";
import { ActionModal } from "@/components/ui/action-modal";
import { FormField, FormSection } from "@/components/ui/forms/form-field";

export const metadata: Metadata = {
  title: "Pharmacy | Care Sync",
};

const inventory = [
  { id: "MED-001", name: "Atorvastatin 20mg", category: "Cardiovascular", stock: 1240, reorder: 500, unit: "tablets", expiry: "Dec 2026", status: "In stock" },
  { id: "MED-002", name: "Amoxicillin 500mg", category: "Antibiotic", stock: 860, reorder: 400, unit: "capsules", expiry: "Mar 2027", status: "In stock" },
  { id: "MED-003", name: "Insulin Glargine", category: "Endocrine", stock: 48, reorder: 100, unit: "vials", expiry: "Aug 2026", status: "Low stock" },
  { id: "MED-004", name: "Saline IV 0.9%", category: "IV Fluids", stock: 320, reorder: 200, unit: "bags", expiry: "Jan 2027", status: "In stock" },
  { id: "MED-005", name: "Paracetamol 500mg", category: "Analgesic", stock: 2400, reorder: 1000, unit: "tablets", expiry: "Jun 2027", status: "In stock" },
  { id: "MED-006", name: "Omeprazole 20mg", category: "Gastrointestinal", stock: 95, reorder: 300, unit: "capsules", expiry: "Nov 2026", status: "Low stock" },
  { id: "MED-007", name: "Ceftriaxone 1g", category: "Antibiotic", stock: 180, reorder: 150, unit: "vials", expiry: "Apr 2027", status: "In stock" },
  { id: "MED-008", name: "Morphine 10mg", category: "Controlled", stock: 22, reorder: 50, unit: "ampoules", expiry: "Sep 2026", status: "Critical" },
  { id: "MED-009", name: "Metformin 500mg", category: "Endocrine", stock: 1560, reorder: 600, unit: "tablets", expiry: "May 2027", status: "In stock" },
  { id: "MED-010", name: "Lorazepam 2mg", category: "Controlled", stock: 15, reorder: 40, unit: "tablets", expiry: "Oct 2026", status: "Critical" },
];

const dispensing = [
  { id: "DSP-342", patient: "Meera Iyer", medication: "Atorvastatin 20mg", quantity: 30, prescribed: "Dr. Kavya Rao", date: "19 Jun 2026", status: "Ready" },
  { id: "DSP-341", patient: "Arjun Menon", medication: "Amoxicillin 500mg", quantity: 14, prescribed: "Dr. Neil Shah", date: "19 Jun 2026", status: "Pending" },
  { id: "DSP-340", patient: "Sita Verma", medication: "Saline IV 0.9%", quantity: 2, prescribed: "Dr. Amina Khan", date: "18 Jun 2026", status: "Dispensed" },
  { id: "DSP-339", patient: "Vikram Singh", medication: "Morphine 10mg", quantity: 6, prescribed: "Dr. Kavya Rao", date: "18 Jun 2026", status: "Pending" },
  { id: "DSP-338", patient: "Rohan Das", medication: "Omeprazole 20mg", quantity: 30, prescribed: "Dr. Amit Verma", date: "17 Jun 2026", status: "Dispensed" },
];

const stats = [
  { label: "Total Items", value: "1,284", delta: "9 critical alerts", detail: "14 low stock items" },
  { label: "Pending Dispensing", value: "18", delta: "6 urgent", detail: "avg. 12 min wait" },
  { label: "Expiring < 6 mo", value: "23", delta: "8 items < 3 mo", detail: "needs review" },
  { label: "Monthly Dispensed", value: "4,280", delta: "+5.2% vs. last month", detail: "avg. 142/day" },
];

export default function PharmacyPage() {
  return (
    <PageShell activeHref="/pharmacy">
      <PageHeader
        eyebrow="Medication Stock"
        title="Pharmacy"
        description="Medication inventory, dispensing queues, reorder levels, and stock alerts."
        actions={
          <>
            <SearchInput placeholder="Search inventory..." />
            <ActionModal
              title="Update Inventory"
              subtitle="Add stock or update inventory levels for a medication."
              confirmLabel="Update inventory"
              trigger={
                <ActionButton icon={<Plus className="size-4" />} message="">
                  Update inventory
                </ActionButton>
              }
            >
              <FormSection title="Medication">
                <FormField
                  label="Select medication"
                  type="select"
                  options={[
                    { label: "Atorvastatin 20mg", value: "MED-001" },
                    { label: "Amoxicillin 500mg", value: "MED-002" },
                    { label: "Insulin Glargine", value: "MED-003" },
                    { label: "Saline IV 0.9%", value: "MED-004" },
                    { label: "Paracetamol 500mg", value: "MED-005" },
                    { label: "Omeprazole 20mg", value: "MED-006" },
                    { label: "Ceftriaxone 1g", value: "MED-007" },
                    { label: "Morphine 10mg", value: "MED-008" },
                    { label: "Metformin 500mg", value: "MED-009" },
                    { label: "Lorazepam 2mg", value: "MED-010" },
                  ]}
                />
              </FormSection>
              <FormSection title="Stock Update">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Add quantity" type="number" placeholder="0" />
                  <FormField label="New reorder level" type="number" placeholder="0" />
                </div>
                <FormField label="Batch / Lot number" placeholder="e.g. BATCH-2026-07" />
                <FormField label="Expiry date" type="date" />
              </FormSection>
              <FormSection title="Notes">
                <FormField label="Remarks" type="textarea" placeholder="Reason for update, supplier info..." />
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
        <Card title="Inventory" description="Current stock levels and reorder status.">
          <DataTable headers={["ID", "Name", "Category", "Stock", "Reorder At", "Expiry", "Status"]}>
            {inventory.map((item) => (
              <tr className="hover:bg-[var(--hover-bg)] cursor-pointer" key={item.id}>
                <td className="px-5 py-4 font-semibold text-[var(--care-primary)] text-xs">{item.id}</td>
                <td className="px-5 py-4 text-[var(--text-primary)] font-medium">{item.name}</td>
                <td className="px-5 py-4 text-[var(--text-muted)] text-xs">{item.category}</td>
                <td className="px-5 py-4 text-[var(--text-secondary)]">{item.stock} {item.unit}</td>
                <td className="px-5 py-4 text-[var(--text-muted)] text-xs">{item.reorder} {item.unit}</td>
                <td className="px-5 py-4 text-[var(--text-muted)] text-xs">{item.expiry}</td>
                <td className="px-5 py-4">
                  <StatusBadge
                    variant={item.status === "Critical" ? "danger" : item.status === "Low stock" ? "warning" : "default"}
                  >
                    {item.status}
                  </StatusBadge>
                </td>
              </tr>
            ))}
          </DataTable>
        </Card>

        <Card title="Dispensing Queue" description="Pending and recent dispensations.">
          <div className="divide-y divide-[var(--table-divide)]">
            {dispensing.map((d) => (
              <div className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-[var(--hover-bg)]" key={d.id}>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{d.patient}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted)]">{d.medication} × {d.quantity}</p>
                  <p className="mt-0.5 text-xs text-[var(--text-muted-light)]">{d.prescribed} · {d.date}</p>
                </div>
                <div className="shrink-0">
                  <StatusBadge
                    variant={d.status === "Pending" ? "warning" : d.status === "Ready" ? "info" : "default"}
                  >
                    {d.status}
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