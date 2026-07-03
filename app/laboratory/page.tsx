"use client";

import type { Metadata } from "next";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { useLabStore } from "@/lib/stores";
import { initializeMockLabTests } from "@/lib/stores/use-lab-store";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useEffect, useState } from "react";
import type { LabTestRequest } from "@/types";

export const metadata: Metadata = {
  title: "Laboratory | Care Sync",
};

export default function LaboratoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTestRequest | null>(null);
  
  const { 
    labTests, 
    getFilteredLabTests, 
    getPaginatedLabTests, 
    deleteLabTest, 
    bulkDelete,
    searchQuery,
    setSearchQuery,
    filterStatus,
    filterPriority,
    setFilterStatus,
    setFilterPriority
  } = useLabStore();
  
  const { addToast } = useToast();

  // Initialize store with mock data
  useEffect(() => {
    initializeMockLabTests();
  }, []);

  const filteredTests = getFilteredLabTests();
  const paginatedTests = getPaginatedLabTests();

  const stats = [
    { label: "Total Tests", value: labTests.length.toString(), delta: `${labTests.filter(t => t.status === "In progress").length} in progress`, detail: "Today" },
    { label: "Pending", value: labTests.filter(t => t.status === "Awaiting sample" || t.status === "Sample collected").length.toString(), delta: "Awaiting processing", detail: "Sample collection" },
    { label: "Completed", value: labTests.filter(t => t.status === "Report ready" || t.status === "Reviewed").length.toString(), delta: "Ready for review", detail: "Reports generated" },
    { label: "STAT Tests", value: labTests.filter(t => t.priority === "STAT").length.toString(), delta: "Urgent priority", detail: "Immediate attention" },
  ];

  const handleEdit = (test: LabTestRequest) => {
    setEditingTest(test);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this lab test request?")) {
      deleteLabTest(id);
      addToast("Lab test deleted successfully", "success");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} lab tests?`)) {
      bulkDelete(ids);
      addToast(`${ids.length} lab tests deleted successfully`, "success");
    }
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "test", label: "Test", sortable: true },
    { key: "doctor", label: "Doctor", sortable: true },
    { key: "requested", label: "Requested", sortable: true },
    { key: "priority", label: "Priority", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ];

  const statusFilterOptions = [
    { label: "All Status", value: "all" },
    { label: "Awaiting sample", value: "Awaiting sample" },
    { label: "Sample collected", value: "Sample collected" },
    { label: "In progress", value: "In progress" },
    { label: "Report ready", value: "Report ready" },
    { label: "Reviewed", value: "Reviewed" },
  ];

  const priorityFilterOptions = [
    { label: "All Priority", value: "all" },
    { label: "STAT", value: "STAT" },
    { label: "Urgent", value: "Urgent" },
    { label: "Normal", value: "Normal" },
  ];

  return (
    <PageShell activeHref="/laboratory">
      <PageHeader
        eyebrow="Laboratory Services"
        title="Laboratory"
        description="Lab test requests, sample tracking, and report management."
        actions={
          <ActionButton 
            icon={<Plus className="size-4" />} 
            message=""
            onClick={() => setIsAddModalOpen(true)}
          >
            New test request
          </ActionButton>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} detail={item.detail} />
        ))}
      </div>

      <div className="mt-6">
        <Card title="Lab Test Requests" description="All laboratory test requests and their status.">
          <EnhancedDataTable
            columns={columns}
            data={paginatedTests}
            getRowId={(test) => test.id}
            renderCell={(test, column) => {
              switch (column.key) {
                case "id":
                  return <span className="font-semibold text-[var(--care-primary)]">{test.id}</span>;
                case "patient":
                  return <span className="text-[var(--text-primary)] font-medium">{test.patient}</span>;
                case "priority":
                  return (
                    <StatusBadge
                      variant={test.priority === "STAT" ? "danger" : test.priority === "Urgent" ? "warning" : "default"}
                    >
                      {test.priority}
                    </StatusBadge>
                  );
                case "status":
                  return (
                    <StatusBadge
                      variant={test.status === "Report ready" || test.status === "Reviewed" ? "info" : "default"}
                    >
                      {test.status}
                    </StatusBadge>
                  );
                default:
                  return <span className="text-[var(--text-secondary)]">{String(test[column.key as keyof LabTestRequest] || "")}</span>;
              }
            }}
            searchPlaceholder="Search lab tests..."
            filterOptions={statusFilterOptions}
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
            onRowClick={handleEdit}
            onBulkDelete={handleBulkDelete}
            emptyMessage="No lab tests found"
          />
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <ActionModal
        title={editingTest ? "Edit Test Request" : "New Lab Test Request"}
        subtitle={editingTest ? "Update lab test details." : "Create a new lab test request."}
        confirmLabel={editingTest ? "Update" : "Create request"}
        open={isAddModalOpen || !!editingTest}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setEditingTest(null);
          }
        }}
        trigger={<div />}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Patient</label>
            <select className="w-full rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-3 py-2 text-sm">
              <option>Vikram Singh</option>
              <option>Sita Verma</option>
              <option>Lakshmi Nair</option>
              <option>Rohan Das</option>
              <option>Aisha Patel</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Test Type</label>
            <select className="w-full rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-3 py-2 text-sm">
              <option>Complete Blood Count</option>
              <option>Chest X-Ray</option>
              <option>Blood Glucose</option>
              <option>MRI Brain</option>
              <option>Urine Culture</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Priority</label>
              <select className="w-full rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-3 py-2 text-sm">
                <option>Normal</option>
                <option>Urgent</option>
                <option>STAT</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Doctor</label>
              <select className="w-full rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-3 py-2 text-sm">
                <option>Dr. Kavya Rao</option>
                <option>Dr. Neil Shah</option>
                <option>Dr. Amina Khan</option>
                <option>Dr. Amit Verma</option>
                <option>Dr. Sneha Kapoor</option>
              </select>
            </div>
          </div>
        </div>
      </ActionModal>
    </PageShell>
  );
}