"use client";

import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { usePatientStore } from "@/lib/stores";
import { initializeMockPatients } from "@/lib/stores/use-patient-store";
import { PatientForm } from "@/components/patients/patient-form";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useEffect, useState } from "react";
import type { Patient } from "@/types";

export default function PatientsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  
  const { 
    patients, 
    getFilteredPatients, 
    getPaginatedPatients, 
    deletePatient, 
    bulkDelete,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus
  } = usePatientStore();
  
  const { addToast } = useToast();

  // Initialize store with mock data
  useEffect(() => {
    initializeMockPatients();
  }, []);

  const filteredPatients = getFilteredPatients();
  const paginatedPatients = getPaginatedPatients();

  const stats = [
    { label: "Total Patients", value: patients.length.toLocaleString(), delta: "+8.2%", detail: `${patients.filter(p => p.status === "Active").length} active today` },
    { label: "New This Week", value: "147", delta: "+12.5%", detail: "vs. last week" },
    { label: "ICU / Critical", value: patients.filter(p => p.status === "ICU").length.toString(), delta: "11 observed", detail: "86% occupancy" },
    { label: "Avg. Stay", value: "4.2 days", delta: "−0.6 days", detail: "reducing YTD" },
  ];

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this patient?")) {
      deletePatient(id);
      addToast("Patient deleted successfully", "success");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} patients?`)) {
      bulkDelete(ids);
      addToast(`${ids.length} patients deleted successfully`, "success");
    }
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "gender", label: "Gender", sortable: true },
    { key: "age", label: "Age", sortable: true },
    { key: "contact", label: "Contact", sortable: false },
    { key: "department", label: "Department", sortable: true },
    { key: "doctor", label: "Doctor", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "lastVisit", label: "Last Visit", sortable: true },
  ];

  const filterOptions = [
    { label: "All Status", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Discharged", value: "Discharged" },
    { label: "ICU", value: "ICU" },
  ];

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
            data={paginatedPatients}
            getRowId={(patient) => patient.id}
            renderCell={(patient, column) => {
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
                default:
                  return <span className="text-[var(--text-secondary)]">{String(patient[column.key as keyof Patient] || "")}</span>;
              }
            }}
            searchPlaceholder="Search patients..."
            filterOptions={filterOptions}
            currentFilter={filterStatus}
            onFilterChange={setSearchQuery}
            onRowClick={handleEdit}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
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
        <PatientForm onClose={() => setIsAddModalOpen(false)} />
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
          <PatientForm patient={editingPatient} onClose={() => setEditingPatient(null)} />
        )}
      </ActionModal>
    </PageShell>
  );
}
