"use client";

import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { useBillingStore } from "@/lib/stores";
import { initializeMockInvoices } from "@/lib/stores/use-billing-store";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useEffect, useState } from "react";
import { InvoiceForm } from "./invoice-form";
import type { Invoice } from "@/types";

export default function BillingPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  
  const { 
    invoices, 
    getFilteredInvoices, 
    getPaginatedInvoices, 
    deleteInvoice, 
    bulkDelete,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus
  } = useBillingStore();
  
  const { addToast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize store with mock data
  useEffect(() => {
    initializeMockInvoices();
    setIsInitialized(true);
  }, []);

  const filteredInvoices = getFilteredInvoices();
  const paginatedInvoices = getPaginatedInvoices();

  const totalRevenue = invoices.reduce((sum, inv) => sum + parseFloat(inv.amount.replace(/[₹,]/g, '')), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + parseFloat(inv.paid.replace(/[₹,]/g, '')), 0);
  const totalPending = invoices.reduce((sum, inv) => sum + parseFloat(inv.balance.replace(/[₹,]/g, '')), 0);

  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString('en-IN')}`, delta: "This month", detail: "All invoices" },
    { label: "Collected", value: `₹${totalPaid.toLocaleString('en-IN')}`, delta: "Payments received", detail: `${invoices.filter(i => i.status === "Paid").length} paid invoices` },
    { label: "Pending", value: `₹${totalPending.toLocaleString('en-IN')}`, delta: "Outstanding", detail: `${invoices.filter(i => i.status === "Pending").length} pending` },
    { label: "Total Invoices", value: invoices.length.toString(), delta: `${invoices.filter(i => i.status === "Partial").length} partial`, detail: "All time" },
  ];

  const handleEdit = (invoice: Invoice) => {
    setEditingInvoice(invoice);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      deleteInvoice(id);
      addToast("Invoice deleted successfully", "success");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} invoices?`)) {
      bulkDelete(ids);
      addToast(`${ids.length} invoices deleted successfully`, "success");
    }
  };

  const handleInvoiceSubmit = () => {
    // This will be called by the InvoiceForm
    // The form handles its own submission logic
  };

  const columns = [
    { key: "id", label: "Invoice ID", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "service", label: "Service", sortable: false },
    { key: "amount", label: "Amount", sortable: true },
    { key: "paid", label: "Paid", sortable: true },
    { key: "balance", label: "Balance", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ];

  const statusFilterOptions = [
    { label: "All Status", value: "all" },
    { label: "Paid", value: "Paid" },
    { label: "Partial", value: "Partial" },
    { label: "Pending", value: "Pending" },
  ];

  if (!isInitialized) {
    return (
      <PageShell activeHref="/billing">
        <div className="flex items-center justify-center h-96">
          <div className="text-sm text-[var(--text-muted)]">Loading...</div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell activeHref="/billing">
      <PageHeader
        eyebrow="Billing & Payments"
        title="Billing"
        description="Invoice management, payment tracking, and insurance claims."
        actions={
          <ActionButton 
            icon={<Plus className="size-4" />} 
            message=""
            onClick={() => setIsAddModalOpen(true)}
          >
            New invoice
          </ActionButton>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} detail={item.detail} />
        ))}
      </div>

      <div className="mt-6">
        <Card title="Invoices" description="All billing invoices and payment status.">
          <EnhancedDataTable
            columns={columns}
            data={paginatedInvoices}
            getRowId={(invoice) => invoice.id}
            renderCell={(invoice, column) => {
              switch (column.key) {
                case "id":
                  return <span className="font-semibold text-[var(--care-primary)]">{invoice.id}</span>;
                case "patient":
                  return <span className="text-[var(--text-primary)] font-medium">{invoice.patient}</span>;
                case "status":
                  return (
                    <StatusBadge
                      variant={invoice.status === "Paid" ? "info" : invoice.status === "Partial" ? "warning" : "default"}
                    >
                      {invoice.status}
                    </StatusBadge>
                  );
                default:
                  return <span className="text-[var(--text-secondary)]">{String(invoice[column.key as keyof Invoice] || "")}</span>;
              }
            }}
            searchPlaceholder="Search invoices..."
            filterOptions={statusFilterOptions}
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
            onRowClick={handleEdit}
            onBulkDelete={handleBulkDelete}
            emptyMessage="No invoices found"
          />
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <ActionModal
        title={editingInvoice ? "Edit Invoice" : "New Invoice"}
        subtitle={editingInvoice ? "Update invoice details." : "Create a new invoice."}
        open={isAddModalOpen || !!editingInvoice}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setEditingInvoice(null);
          }
        }}
        trigger={<div />}
        showFooter={false}
      >
        <InvoiceForm 
          invoice={editingInvoice} 
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingInvoice(null);
          }} 
        />
      </ActionModal>
    </PageShell>
  );
}