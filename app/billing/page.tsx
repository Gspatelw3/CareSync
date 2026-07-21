"use client";

import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useBillingStore } from "@/lib/stores";
import { initializeMockInvoices } from "@/lib/stores/use-billing-store";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useCallback, useEffect, useMemo, useState, lazy, Suspense } from "react";
import type { Invoice } from "@/types";

// Lazy load InvoiceForm to reduce initial bundle size
const LazyInvoiceForm = lazy(() => import("./invoice-form").then(mod => ({ default: mod.InvoiceForm })));

export default function BillingPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  
  const invoices = useBillingStore((state) => state.invoices);
  const deleteInvoice = useBillingStore((state) => state.deleteInvoice);
  const bulkDelete = useBillingStore((state) => state.bulkDelete);
  const bulkUpdateStatus = useBillingStore((state) => state.bulkUpdateStatus);
  const filterStatus = useBillingStore((state) => state.filterStatus);
  const setFilterStatus = useBillingStore((state) => state.setFilterStatus);
  
  const { addToast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize store with mock data
  useEffect(() => {
    initializeMockInvoices();
    setIsInitialized(true);
  }, []);

  const stats = useMemo(() => {
    const totals = invoices.reduce(
      (acc, inv) => {
        acc.revenue += parseFloat(inv.amount.replace(/[₹,]/g, ""));
        acc.paid += parseFloat(inv.paid.replace(/[₹,]/g, ""));
        acc.pending += parseFloat(inv.balance.replace(/[₹,]/g, ""));
        acc.status[inv.status] = (acc.status[inv.status] ?? 0) + 1;
        return acc;
      },
      { revenue: 0, paid: 0, pending: 0, status: {} as Record<Invoice["status"], number> },
    );

    return [
    { label: "Total Revenue", value: `₹${totals.revenue.toLocaleString('en-IN')}`, delta: "This month", detail: "All invoices" },
    { label: "Collected", value: `₹${totals.paid.toLocaleString('en-IN')}`, delta: "Payments received", detail: `${totals.status.Paid ?? 0} paid invoices` },
    { label: "Pending", value: `₹${totals.pending.toLocaleString('en-IN')}`, delta: "Outstanding", detail: `${totals.status.Pending ?? 0} pending` },
    { label: "Total Invoices", value: invoices.length.toString(), delta: `${totals.status.Partial ?? 0} partial`, detail: "All time" },
  ];
  }, [invoices]);

  const handleEdit = useCallback((invoice: Invoice) => {
    setEditingInvoice(invoice);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setInvoiceToDelete(id);
    setDeleteConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete);
      addToast("Invoice deleted successfully", "success");
      setInvoiceToDelete(null);
    }
  }, [addToast, deleteInvoice, invoiceToDelete]);

  const handleBulkDelete = useCallback((ids: string[]) => {
    setIdsToDelete(ids);
    setBulkDeleteConfirmOpen(true);
  }, []);

  const confirmBulkDelete = useCallback(() => {
    bulkDelete(idsToDelete);
    addToast(`${idsToDelete.length} invoices deleted successfully`, "success");
    setIdsToDelete([]);
  }, [addToast, bulkDelete, idsToDelete]);

  const handleBulkStatusUpdate = useCallback((ids: string[], status: string) => {
    bulkUpdateStatus(ids, status as Invoice["status"]);
    addToast(`Updated ${ids.length} invoices to ${status}`, "success");
  }, [addToast, bulkUpdateStatus]);

  const columns = useMemo(() => [
    { key: "id", label: "Invoice ID", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "service", label: "Service", sortable: false },
    { key: "amount", label: "Amount", sortable: true },
    { key: "paid", label: "Paid", sortable: true },
    { key: "balance", label: "Balance", sortable: true },
    { key: "date", label: "Date", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ], []);

  const statusFilterOptions = useMemo(() => [
    { label: "All Status", value: "all" },
    { label: "Paid", value: "Paid" },
    { label: "Partial", value: "Partial" },
    { label: "Pending", value: "Pending" },
  ], []);

  const bulkStatusOptions = useMemo(() => [
    { label: "Paid", value: "Paid" },
    { label: "Partial", value: "Partial" },
    { label: "Pending", value: "Pending" },
  ], []);

  const renderCell = useCallback((invoice: Invoice, column: { key: string }) => {
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
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(invoice);
              }}
              className="rounded-md p-1.5 cursor-pointer text-[var(--care-primary)] hover:bg-[var(--care-primary)]/10 transition-colors"
              title="Edit"
            >
              <Pencil className="size-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(invoice.id);
              }}
              className="rounded-md p-1.5 cursor-pointer text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        );
      default:
        return <span className="text-[var(--text-secondary)]">{String(invoice[column.key as keyof Invoice] || "")}</span>;
    }
  }, [handleDelete, handleEdit]);

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
            data={invoices}
            getRowId={(invoice) => invoice.id}
            renderCell={renderCell}
            searchPlaceholder="Search invoices..."
            filterOptions={statusFilterOptions}
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
            onRowClick={handleEdit}
            onBulkDelete={handleBulkDelete}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            bulkStatusOptions={bulkStatusOptions}
            emptyMessage="No invoices found"
          />
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <ActionModal
        title={editingInvoice ? "Edit Invoice" : "New Invoice"}
        subtitle={editingInvoice ? "Update invoice details." : "Create a new invoice."}
        confirmLabel={editingInvoice ? "Update" : "Create"}
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
        <Suspense fallback={<div className="text-sm text-[var(--text-muted)]">Loading form...</div>}>
          <LazyInvoiceForm
            invoice={editingInvoice}
            onClose={() => {
              setIsAddModalOpen(false);
              setEditingInvoice(null);
            }}
          />
        </Suspense>
      </ActionModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        variant="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
        title="Delete Multiple Invoices"
        description={`Are you sure you want to delete ${idsToDelete.length} invoices? This action cannot be undone.`}
        confirmLabel="Delete All"
        onConfirm={confirmBulkDelete}
        variant="danger"
      />
    </PageShell>
  );
}
