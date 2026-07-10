"use client";

import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { FormField } from "@/components/ui/forms/form-field";
import { useInventoryStore } from "@/lib/stores";
import { initializeMockInventory } from "@/lib/stores/use-inventory-store";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useEffect, useState } from "react";
import type { InventoryItem } from "@/types";

export default function PharmacyPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  
  const { 
    inventory, 
    getFilteredInventory, 
    getPaginatedInventory, 
    deleteInventoryItem, 
    bulkDelete,
    searchQuery,
    setSearchQuery,
    filterStatus,
    filterCategory,
    setFilterStatus,
    setFilterCategory
  } = useInventoryStore();
  
  const { addToast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize store with mock data
  useEffect(() => {
    initializeMockInventory();
    setIsInitialized(true);
  }, []);

  const filteredInventory = getFilteredInventory();
  const paginatedInventory = getPaginatedInventory();

  const stats = [
    { label: "Total Items", value: inventory.length.toString(), delta: `${inventory.filter(i => i.status === "In stock").length} in stock`, detail: `${inventory.filter(i => i.status === "Critical").length} critical` },
    { label: "Low Stock", value: inventory.filter(i => i.status === "Low stock").length.toString(), delta: "Needs reorder", detail: "Check expiry dates" },
    { label: "Critical", value: inventory.filter(i => i.status === "Critical").length.toString(), delta: "Urgent action", detail: "Reorder immediately" },
    { label: "Categories", value: [...new Set(inventory.map(i => i.category))].length.toString(), delta: "Active", detail: "All categories" },
  ];

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this inventory item?")) {
      deleteInventoryItem(id);
      addToast("Inventory item deleted successfully", "success");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} items?`)) {
      bulkDelete(ids);
      addToast(`${ids.length} items deleted successfully`, "success");
    }
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
    { key: "reorder", label: "Reorder Level", sortable: true },
    { key: "unit", label: "Unit", sortable: false },
    { key: "expiry", label: "Expiry", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ];

  const statusFilterOptions = [
    { label: "All Status", value: "all" },
    { label: "In Stock", value: "In stock" },
    { label: "Low Stock", value: "Low stock" },
    { label: "Critical", value: "Critical" },
  ];

  const categoryFilterOptions = [
    { label: "All Categories", value: "all" },
    { label: "Pain Relief", value: "Pain Relief" },
    { label: "Antibiotics", value: "Antibiotics" },
    { label: "Diabetes", value: "Diabetes" },
    { label: "IV Fluids", value: "IV Fluids" },
    { label: "PPE", value: "PPE" },
  ];

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
            renderCell={(item, column) => {
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
                default:
                  return <span className="text-[var(--text-secondary)]">{String(item[column.key as keyof InventoryItem] || "")}</span>;
              }
            }}
            searchPlaceholder="Search inventory..."
            filterOptions={statusFilterOptions}
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
            onRowClick={handleEdit}
            onBulkDelete={handleBulkDelete}
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
    </PageShell>
  );
}