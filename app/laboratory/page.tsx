"use client";

import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { FormField } from "@/components/ui/forms/form-field";
import { useLabStore } from "@/lib/stores";
import { initializeMockLabTests } from "@/lib/stores/use-lab-store";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { LabTestRequest } from "@/types";

export default function LaboratoryPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<LabTestRequest | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  
  const labTests = useLabStore((state) => state.labTests);
  const deleteLabTest = useLabStore((state) => state.deleteLabTest);
  const bulkDelete = useLabStore((state) => state.bulkDelete);
  const bulkUpdateStatus = useLabStore((state) => state.bulkUpdateStatus);
  const filterStatus = useLabStore((state) => state.filterStatus);
  const setFilterStatus = useLabStore((state) => state.setFilterStatus);
  
  const { addToast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize store with mock data
  useEffect(() => {
    initializeMockLabTests();
    setIsInitialized(true);
  }, []);

  const stats = useMemo(() => {
    const counts = labTests.reduce(
      (acc, test) => {
        acc.status[test.status] = (acc.status[test.status] ?? 0) + 1;
        acc.priority[test.priority] = (acc.priority[test.priority] ?? 0) + 1;
        return acc;
      },
      {
        priority: {} as Record<LabTestRequest["priority"], number>,
        status: {} as Record<LabTestRequest["status"], number>,
      },
    );
    const pendingCount = (counts.status["Awaiting sample"] ?? 0) + (counts.status["Sample collected"] ?? 0);
    const completedCount = (counts.status["Report ready"] ?? 0) + (counts.status.Reviewed ?? 0);

    return [
      { label: "Total Tests", value: labTests.length.toString(), delta: `${counts.status["In progress"] ?? 0} in progress`, detail: "Today" },
      { label: "Pending", value: pendingCount.toString(), delta: "Awaiting processing", detail: "Sample collection" },
      { label: "Completed", value: completedCount.toString(), delta: "Ready for review", detail: "Reports generated" },
      { label: "STAT Tests", value: (counts.priority.STAT ?? 0).toString(), delta: "Urgent priority", detail: "Immediate attention" },
    ];
  }, [labTests]);

  const handleEdit = useCallback((test: LabTestRequest) => {
    setEditingTest(test);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setTestToDelete(id);
    setDeleteConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (testToDelete) {
      deleteLabTest(testToDelete);
      addToast("Lab test deleted successfully", "success");
      setTestToDelete(null);
    }
  }, [addToast, deleteLabTest, testToDelete]);

  const handleBulkDelete = useCallback((ids: string[]) => {
    setIdsToDelete(ids);
    setBulkDeleteConfirmOpen(true);
  }, []);

  const confirmBulkDelete = useCallback(() => {
    bulkDelete(idsToDelete);
    addToast(`${idsToDelete.length} lab tests deleted successfully`, "success");
    setIdsToDelete([]);
  }, [addToast, bulkDelete, idsToDelete]);

  const handleBulkStatusUpdate = useCallback((ids: string[], status: string) => {
    bulkUpdateStatus(ids, status as LabTestRequest["status"]);
    addToast(`Updated ${ids.length} lab tests to ${status}`, "success");
  }, [addToast, bulkUpdateStatus]);

  const columns = useMemo(() => [
    { key: "id", label: "ID", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "test", label: "Test", sortable: true },
    { key: "doctor", label: "Doctor", sortable: true },
    { key: "requested", label: "Requested", sortable: true },
    { key: "priority", label: "Priority", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ], []);

  const statusFilterOptions = useMemo(() => [
    { label: "All Status", value: "all" },
    { label: "Awaiting sample", value: "Awaiting sample" },
    { label: "Sample collected", value: "Sample collected" },
    { label: "In progress", value: "In progress" },
    { label: "Report ready", value: "Report ready" },
    { label: "Reviewed", value: "Reviewed" },
  ], []);

  const bulkStatusOptions = useMemo(() => [
    { label: "Awaiting sample", value: "Awaiting sample" },
    { label: "Sample collected", value: "Sample collected" },
    { label: "In progress", value: "In progress" },
    { label: "Report ready", value: "Report ready" },
    { label: "Reviewed", value: "Reviewed" },
  ], []);

  const priorityFilterOptions = useMemo(() => [
    { label: "All Priority", value: "all" },
    { label: "STAT", value: "STAT" },
    { label: "Urgent", value: "Urgent" },
    { label: "Normal", value: "Normal" },
  ], []);

  const renderCell = useCallback((test: LabTestRequest, column: { key: string }) => {
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
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(test);
              }}
              className="rounded-md p-1.5 cursor-pointer text-[var(--care-primary)] hover:bg-[var(--care-primary)]/10 transition-colors"
              title="Edit"
            >
              <Pencil className="size-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(test.id);
              }}
              className="rounded-md p-1.5 cursor-pointer text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        );
      default:
        return <span className="text-[var(--text-secondary)]">{String(test[column.key as keyof LabTestRequest] || "")}</span>;
    }
  }, [handleDelete, handleEdit]);

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
            data={labTests}
            getRowId={(test) => test.id}
            renderCell={renderCell}
            searchPlaceholder="Search lab tests..."
            filterOptions={statusFilterOptions}
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
            onRowClick={handleEdit}
            onBulkDelete={handleBulkDelete}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            bulkStatusOptions={bulkStatusOptions}
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
        showFooter={false}
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

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Lab Test Request"
        description="Are you sure you want to delete this lab test request? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        variant="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
        title="Delete Multiple Lab Tests"
        description={`Are you sure you want to delete ${idsToDelete.length} lab tests? This action cannot be undone.`}
        confirmLabel="Delete All"
        onConfirm={confirmBulkDelete}
        variant="danger"
      />
    </PageShell>
  );
}
