"use client";

import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { FormField } from "@/components/ui/forms/form-field";
import { useLabStore } from "@/lib/stores";
import { initializeMockLabTests } from "@/lib/stores/use-lab-store";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useEffect, useState } from "react";
import type { LabTestRequest } from "@/types";

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
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize store with mock data
  useEffect(() => {
    initializeMockLabTests();
    setIsInitialized(true);
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

  if (!isInitialized) {
    return (
      <PageShell activeHref="/laboratory">
        <div className="flex items-center justify-center h-96">
          <div className="text-sm text-[var(--text-muted)]">Loading...</div>
        </div>
      </PageShell>
    );
  }

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
          <FormField
            label="Patient"
            type="select"
            value=""
            onChange={() => {}}
            options={[
              { label: "Vikram Singh", value: "Vikram Singh" },
              { label: "Sita Verma", value: "Sita Verma" },
              { label: "Lakshmi Nair", value: "Lakshmi Nair" },
              { label: "Rohan Das", value: "Rohan Das" },
              { label: "Aisha Patel", value: "Aisha Patel" },
            ]}
          />
          <FormField
            label="Test Type"
            type="select"
            value=""
            onChange={() => {}}
            options={[
              { label: "Complete Blood Count", value: "Complete Blood Count" },
              { label: "Chest X-Ray", value: "Chest X-Ray" },
              { label: "Blood Glucose", value: "Blood Glucose" },
              { label: "MRI Brain", value: "MRI Brain" },
              { label: "Urine Culture", value: "Urine Culture" },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Priority"
              type="select"
              value=""
              onChange={() => {}}
              options={[
                { label: "Normal", value: "Normal" },
                { label: "Urgent", value: "Urgent" },
                { label: "STAT", value: "STAT" },
              ]}
            />
            <FormField
              label="Doctor"
              type="select"
              value=""
              onChange={() => {}}
              options={[
                { label: "Dr. Kavya Rao", value: "Dr. Kavya Rao" },
                { label: "Dr. Neil Shah", value: "Dr. Neil Shah" },
                { label: "Dr. Amina Khan", value: "Dr. Amina Khan" },
                { label: "Dr. Amit Verma", value: "Dr. Amit Verma" },
                { label: "Dr. Sneha Kapoor", value: "Dr. Sneha Kapoor" },
              ]}
            />
          </div>
        </div>
      </ActionModal>
    </PageShell>
  );
}