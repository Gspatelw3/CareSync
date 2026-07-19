"use client";

import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormField } from "@/components/ui/forms/form-field";
import { useInventoryStore } from "@/lib/stores";
import { initializeMockInventory } from "@/lib/stores/use-inventory-store";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { InventoryItem } from "@/types";

export default function PharmacyPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  
  const inventory = useInventoryStore((state) => state.inventory);
  const getPaginatedInventory = useInventoryStore((state) => state.getPaginatedInventory);
  const deleteInventoryItem = useInventoryStore((state) => state.deleteInventoryItem);
  const bulkDelete = useInventoryStore((state) => state.bulkDelete);
  const bulkUpdateStatus = useInventoryStore((state) => state.bulkUpdateStatus);
  const filterStatus = useInventoryStore((state) => state.filterStatus);
  const setFilterStatus = useInventoryStore((state) => state.setFilterStatus);
  
  const { addToast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize store with mock data
  useEffect(() => {
    initializeMockInventory();
    setIsInitialized(true);
  }, []);

  const paginatedInventory = getPaginatedInventory();

  const stats = useMemo(() => {
    const counts = inventory.reduce(
      (acc, item) => {
        acc.status[item.status] = (acc.status[item.status] ?? 0) + 1;
        acc.categories.add(item.category);
        return acc;
      },
      { categories: new Set<string>(), status: {} as Record<InventoryItem["status"], number> },
    );

    return [
      { label: "Total Items", value: inventory.length.toString(), delta: `${counts.status["In stock"] ?? 0} in stock`, detail: `${counts.status.Critical ?? 0} critical` },
      { label: "Low Stock", value: (counts.status["Low stock"] ?? 0).toString(), delta: "Needs reorder", detail: "Check expiry dates" },
      { label: "Critical", value: (counts.status.Critical ?? 0).toString(), delta: "Urgent action", detail: "Reorder immediately" },
      { label: "Categories", value: counts.categories.size.toString(), delta: "Active", detail: "All categories" },
    ];
  }, [inventory]);

  const handleEdit = useCallback((item: InventoryItem) => {
    setEditingItem(item);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setItemToDelete(id);
    setDeleteConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (itemToDelete) {
      deleteInventoryItem(itemToDelete);
      addToast("Inventory item deleted successfully", "success");
      setItemToDelete(null);
    }
  }, [addToast, deleteInventoryItem, itemToDelete]);

  const handleBulkDelete = useCallback((ids: string[]) => {
    setIdsToDelete(ids);
    setBulkDeleteConfirmOpen(true);
  }, []);

  const confirmBulkDelete = useCallback(() => {
    bulkDelete(idsToDelete);
    addToast(`${idsToDelete.length} items deleted successfully`, "success");
    setIdsToDelete([]);
  }, [addToast, bulkDelete, idsToDelete]);

  const handleBulkStatusUpdate = useCallback((ids: string[], status: string) => {
    bulkUpdateStatus(ids, status as InventoryItem["status"]);
    addToast(`Updated ${ids.length} items to ${status}`, "success");
  }, [addToast, bulkUpdateStatus]);

  const columns = useMemo(() => [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
    { key: "reorder", label: "Reorder Level", sortable: true },
    { key: "unit", label: "Unit", sortable: false },
    { key: "expiry", label: "Expiry", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ], []);

  const statusFilterOptions = useMemo(() => [
    { label: "All Status", value: "all" },
    { label: "In Stock", value: "In stock" },
    { label: "Low Stock", value: "Low stock" },
    { label: "Critical", value: "Critical" },
  ], []);

  const categoryFilterOptions = useMemo(() => [
    { label: "All Categories", value: "all" },
    { label: "Pain Relief", value: "Pain Relief" },
    { label: "Antibiotics", value: "Antibiotics" },
    { label: "Diabetes", value: "Diabetes" },
    { label: "IV Fluids", value: "IV Fluids" },
    { label: "PPE", value: "PPE" },
  ], []);

  const renderCell = useCallback((item: InventoryItem, column: { key: string }) => {
    switch (column.key) {
      case "id":
        return <span className="font-semibold text-[var(--care-primary)]">{item.id}</span>;
      case "name":
        return <span className="text-[var(--text-primary)] font-medium">{item.name}</span>;
      case "status":
        return (
          <StatusBadge
            variant={item.status === "Critical" ? "danger" : item.status === "Low stock" ? "warning" : "default"}
          >
            {item.status}
          </StatusBadge>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(item);
              }}
              className="rounded-md p-1.5 cursor-pointer text-[var(--care-primary)] hover:bg-[var(--care-primary)]/10 transition-colors"
              title="Edit"
            >
              <Pencil className="size-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item.id);
              }}
              className="rounded-md p-1.5 cursor-pointer text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        );
      default:
        return <span className="text-[var(--text-secondary)]">{String(item[column.key as keyof InventoryItem] || "")}</span>;
    }
  }, [handleDelete, handleEdit]);

  if (!isInitialized) {
    return (
      <PageShell activeHref="/pharmacy">
        <div className="flex items-center justify-center h-96">
          <div className="text-sm text-[var(--text-muted)]">Loading...</div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell activeHref="/pharmacy">
      <PageHeader
        eyebrow="Pharmacy Management"
        title="Pharmacy"
        description="Inventory management, stock tracking, and medication dispensing."
        actions={
          <ActionButton 
            icon={<Plus className="size-4" />} 
            message=""
            onClick={() => setIsAddModalOpen(true)}
          >
            Add item
          </ActionButton>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} detail={item.detail} />
        ))}
      </div>

      <div className="mt-6">
        <Card title="Inventory" description="Pharmacy stock and medication inventory.">
          <EnhancedDataTable
            columns={columns}
            data={paginatedInventory}
            getRowId={(item) => item.id}
            renderCell={renderCell}
            searchPlaceholder="Search inventory..."
            filterOptions={statusFilterOptions}
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
            onRowClick={handleEdit}
            onBulkDelete={handleBulkDelete}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            emptyMessage="No inventory items found"
          />
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <ActionModal
        title={editingItem ? "Edit Item" : "Add Inventory Item"}
        subtitle={editingItem ? "Update inventory item details." : "Add new item to inventory."}
        confirmLabel={editingItem ? "Update" : "Add item"}
        open={isAddModalOpen || !!editingItem}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setEditingItem(null);
          }
        }}
        trigger={<div />}
        showFooter={false}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Item Name</label>
            <input
              type="text"
              placeholder="e.g. Paracetamol 500mg"
              className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
              defaultValue={editingItem?.name}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Category"
              type="select"
              value={editingItem?.category || ""}
              onChange={() => {}}
              options={[
                { label: "Pain Relief", value: "Pain Relief" },
                { label: "Antibiotics", value: "Antibiotics" },
                { label: "Diabetes", value: "Diabetes" },
                { label: "IV Fluids", value: "IV Fluids" },
                { label: "PPE", value: "PPE" },
              ]}
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Unit</label>
              <input
                type="text"
                placeholder="e.g. tablets"
                className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                defaultValue={editingItem?.unit}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Stock</label>
              <input
                type="number"
                placeholder="0"
                className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                defaultValue={editingItem?.stock}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Reorder Level</label>
              <input
                type="number"
                placeholder="0"
                className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                defaultValue={editingItem?.reorder}
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Expiry Date</label>
            <input
              type="date"
              className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
              defaultValue={editingItem?.expiry}
            />
          </div>
        </div>
      </ActionModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Inventory Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        variant="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
        title="Delete Multiple Items"
        description={`Are you sure you want to delete ${idsToDelete.length} items? This action cannot be undone.`}
        confirmLabel="Delete All"
        onConfirm={confirmBulkDelete}
        variant="danger"
      />
    </PageShell>
  );
}
