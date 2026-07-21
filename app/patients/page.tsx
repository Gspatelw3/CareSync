"use client";

import { lazy, Suspense } from "react";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { usePatientStore } from "@/lib/stores";
import { initializeMockPatients } from "@/lib/stores/use-patient-store";
import { useToast } from "@/lib/use-toast";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Patient } from "@/types";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";

// Lazy load PatientForm to reduce initial bundle size
const LazyPatientForm = lazy(() => import("@/components/patients/patient-form").then(mod => ({ default: mod.PatientForm })));

export default function PatientsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  
  const patients = usePatientStore((state) => state.patients);
  const deletePatient = usePatientStore((state) => state.deletePatient);
  const bulkDelete = usePatientStore((state) => state.bulkDelete);
  const bulkUpdateStatus = usePatientStore((state) => state.bulkUpdateStatus);
  const filterStatus = usePatientStore((state) => state.filterStatus);
  const setFilterStatus = usePatientStore((state) => state.setFilterStatus);
  
  const { addToast } = useToast();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize store with mock data
  useEffect(() => {
    initializeMockPatients();
    setIsInitialized(true);
  }, []);

  const stats = useMemo(() => {
    const activeCount = patients.filter((p) => p.status === "Active").length;
    const icuCount = patients.filter((p) => p.status === "ICU").length;

    return [
    { label: "Total Patients", value: patients.length.toLocaleString(), delta: "+8.2%", detail: `${activeCount} active today` },
    { label: "New This Week", value: "147", delta: "+12.5%", detail: "vs. last week" },
    { label: "ICU / Critical", value: icuCount.toString(), delta: "11 observed", detail: "86% occupancy" },
    { label: "Avg. Stay", value: "4.2 days", delta: "−0.6 days", detail: "reducing YTD" },
  ];
  }, [patients]);

  const handleEdit = useCallback((patient: Patient) => {
    setEditingPatient(patient);
  }, []);

  const handleDelete = useCallback((id: string) => {
    setPatientToDelete(id);
    setDeleteConfirmOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (patientToDelete) {
      deletePatient(patientToDelete);
      addToast("Patient deleted successfully", "success");
      setPatientToDelete(null);
    }
  }, [addToast, deletePatient, patientToDelete]);

  const handleBulkDelete = useCallback((ids: string[]) => {
    setIdsToDelete(ids);
    setBulkDeleteConfirmOpen(true);
  }, []);

  const confirmBulkDelete = useCallback(() => {
    bulkDelete(idsToDelete);
    addToast(`${idsToDelete.length} patients deleted successfully`, "success");
    setIdsToDelete([]);
  }, [addToast, bulkDelete, idsToDelete]);

  const handleBulkStatusUpdate = useCallback((ids: string[], status: string) => {
    bulkUpdateStatus(ids, status as Patient["status"]);
    addToast(`Updated ${ids.length} patients to ${status}`, "success");
  }, [addToast, bulkUpdateStatus]);

  const columns = useMemo(() => [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "gender", label: "Gender", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "contact", label: "Contact", sortable: false },
    { key: "department", label: "Department", sortable: true },
    { key: "doctor", label: "Doctor", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "lastVisit", label: "Last Visit", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ], []);

  const filterOptions = useMemo(() => [
    { label: "All Status", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Discharged", value: "Discharged" },
    { label: "ICU", value: "ICU" },
  ], []);

  const bulkStatusOptions = useMemo(() => [
    { label: "Active", value: "Active" },
    { label: "Discharged", value: "Discharged" },
    { label: "ICU", value: "ICU" },
  ], []);

  const renderCell = useCallback((patient: Patient, column: { key: string }) => {
    switch (column.key) {
      case "id":
        return <span className="font-semibold text-[var(--care-primary)]">{patient.id}</span>;
      case "name":
        return <span className="text-[var(--text-primary)] font-medium">{patient.name}</span>;
      case "status":
        return (
          <StatusBadge
            variant={patient.status === "Discharged" ? "info" : patient.status === "ICU" ? "danger" : "default"}
          >
            {patient.status}
          </StatusBadge>
        );
      case "actions":
        return (
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(patient);
              }}
              className="rounded-md p-1.5 cursor-pointer text-[var(--care-primary)] hover:bg-[var(--care-primary)]/10 transition-colors"
              title="Edit"
            >
              <Pencil className="size-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(patient.id);
              }}
              className="rounded-md p-1.5 cursor-pointer text-red-400 hover:bg-red-400/10 transition-colors"
              title="Delete"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        );
      default:
        return <span className="text-[var(--text-secondary)]">{String(patient[column.key as keyof Patient] || "")}</span>;
    }
  }, [handleDelete, handleEdit]);

  if (!isInitialized) {
    return (
      <PageShell activeHref="/patients">
        <div className="flex items-center justify-center h-96">
          <div className="text-sm text-[var(--text-muted)]">Loading...</div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell activeHref="/patients">
      <PageHeader
        eyebrow="Patient Management"
        title="Patients"
        description="Patient registry, intake, profiles, and medical history."
        actions={
          <ActionButton 
            icon={<Plus className="size-4" />} 
            message=""
            onClick={() => setIsAddModalOpen(true)}
          >
            Add patient
          </ActionButton>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} detail={item.detail} />
        ))}
      </div>

      <div className="mt-6">
        <Card title="Patient Registry" description="All registered patients sorted by last visit.">
          <EnhancedDataTable
            columns={columns}
            data={patients}
            getRowId={(patient) => patient.id}
            renderCell={renderCell}
            searchPlaceholder="Search patients..."
            filterOptions={filterOptions}
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
            onRowClick={handleEdit}
            onBulkDelete={handleBulkDelete}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            bulkStatusOptions={bulkStatusOptions}
            emptyMessage="No patients found"
          />
        </Card>
      </div>

      {/* Add Patient Modal */}
      <ActionModal
        title="Add Patient"
        subtitle="Register a new patient in the system."
        confirmLabel="Add patient"
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        trigger={<div />}
        showFooter={false}
      >
        <Suspense fallback={<div className="text-sm text-[var(--text-muted)]">Loading form...</div>}>
          <LazyPatientForm onClose={() => setIsAddModalOpen(false)} />
        </Suspense>
      </ActionModal>

      {/* Edit Patient Modal */}
      <ActionModal
        title="Edit Patient"
        subtitle="Update patient information."
        confirmLabel="Update patient"
        open={!!editingPatient}
        onOpenChange={(open) => !open && setEditingPatient(null)}
        trigger={<div />}
        showFooter={false}
      >
        {editingPatient && (
          <Suspense fallback={<div className="text-sm text-[var(--text-muted)]">Loading form...</div>}>
            <LazyPatientForm patient={editingPatient} onClose={() => setEditingPatient(null)} />
          </Suspense>
        )}
      </ActionModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Patient"
        description="Are you sure you want to delete this patient? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        variant="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
        title="Delete Multiple Patients"
        description={`Are you sure you want to delete ${idsToDelete.length} patients? This action cannot be undone.`}
        confirmLabel="Delete All"
        onConfirm={confirmBulkDelete}
        variant="danger"
      />
    </PageShell>
  );
}
