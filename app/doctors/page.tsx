"use client";

import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDoctorStore } from "@/lib/stores";
import { initializeMockDoctors } from "@/lib/stores/use-doctor-store";
import { DoctorForm } from "@/components/doctors/doctor-form";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useEffect, useState } from "react";
import type { Doctor } from "@/types";

export default function DoctorsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<string | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState(false);
  const [idsToDelete, setIdsToDelete] = useState<string[]>([]);
  
  const { 
    doctors, 
    getFilteredDoctors, 
    getPaginatedDoctors, 
    deleteDoctor, 
    bulkDelete,
    bulkUpdateStatus,
    searchQuery,
    setSearchQuery,
    filterStatus,
    filterDepartment,
    setFilterStatus,
    setFilterDepartment
  } = useDoctorStore();
  
  const { addToast } = useToast();

  // Initialize store with mock data
  useEffect(() => {
    initializeMockDoctors();
  }, []);

  const filteredDoctors = getFilteredDoctors();
  const paginatedDoctors = getPaginatedDoctors();

  // Calculate dynamic stats from current data
  const totalDoctors = doctors.length;
  const onDutyCount = doctors.filter(d => d.status === "On duty").length;
  const onLeaveCount = doctors.filter(d => d.status === "On leave").length;
  const offDutyCount = doctors.filter(d => d.status === "Off duty").length;
  const availableCount = doctors.filter(d => d.status === "Available").length;
  const avgPatientsPerDoctor = totalDoctors > 0 
    ? Math.round(doctors.reduce((sum, d) => sum + d.patients, 0) / totalDoctors) 
    : 0;

  const stats = [
    { 
      label: "Total Doctors", 
      value: totalDoctors.toString(), 
      delta: `${onDutyCount} on duty`, 
      detail: `${doctors.length > 0 ? new Set(doctors.map(d => d.department)).size : 0} departments covered` 
    },
    { 
      label: "On Duty Now", 
      value: onDutyCount.toString(), 
      delta: `${availableCount} available`, 
      detail: `${offDutyCount} off duty` 
    },
    { 
      label: "On Leave", 
      value: onLeaveCount.toString(), 
      delta: "Currently away", 
      detail: "Will return soon" 
    },
    { 
      label: "Avg. Patients", 
      value: avgPatientsPerDoctor.toString(), 
      delta: "per doctor", 
      detail: "Total patient load" 
    },
  ];

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
  };

  const handleDelete = (id: string) => {
    setDoctorToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (doctorToDelete) {
      deleteDoctor(doctorToDelete);
      addToast("Doctor deleted successfully", "success");
      setDoctorToDelete(null);
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    setIdsToDelete(ids);
    setBulkDeleteConfirmOpen(true);
  };

  const confirmBulkDelete = () => {
    bulkDelete(idsToDelete);
    addToast(`${idsToDelete.length} doctors deleted successfully`, "success");
    setIdsToDelete([]);
  };

  const handleBulkStatusUpdate = (ids: string[], status: string) => {
    // TODO: Replace with API call
    bulkUpdateStatus(ids, status as Doctor["status"]);
    addToast(`Updated ${ids.length} doctors to ${status}`, "success");
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "specialization", label: "Specialization", sortable: true },
    { key: "department", label: "Department", sortable: true },
    { key: "patients", label: "Patients", sortable: true },
    { key: "schedule", label: "Schedule", sortable: false },
    { key: "status", label: "Status", sortable: true },
    { key: "phone", label: "Phone", sortable: false },
    { key: "email", label: "Email", sortable: false },
    { key: "actions", label: "Actions", sortable: false },
  ];

  const statusFilterOptions = [
    { label: "All Status", value: "all" },
    { label: "On Duty", value: "On duty" },
    { label: "Off Duty", value: "Off duty" },
    { label: "On Leave", value: "On leave" },
    { label: "Available", value: "Available" },
  ];

  const departmentFilterOptions = [
    { label: "All Departments", value: "all" },
    { label: "Cardiology", value: "Cardiology" },
    { label: "Orthopedics", value: "Orthopedics" },
    { label: "General", value: "General" },
    { label: "Neurology", value: "Neurology" },
    { label: "Pediatrics", value: "Pediatrics" },
    { label: "Obstetrics", value: "Obstetrics" },
    { label: "Respiratory", value: "Respiratory" },
    { label: "Dermatology", value: "Dermatology" },
  ];

  return (
    <PageShell activeHref="/doctors">
      <PageHeader
        eyebrow="Care Team"
        title="Doctors"
        description="Doctor directory, profiles, department coverage, and schedule management."
        actions={
          <ActionButton 
            icon={<Plus className="size-4" />} 
            message=""
            onClick={() => setIsAddModalOpen(true)}
          >
            Add doctor
          </ActionButton>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} detail={item.detail} />
        ))}
      </div>

      <div className="mt-6">
        <Card title="Doctor Directory" description="All registered doctors and their schedules.">
          <EnhancedDataTable
            columns={columns}
            data={paginatedDoctors}
            getRowId={(doctor) => doctor.id}
            renderCell={(doctor, column) => {
              switch (column.key) {
                case "id":
                  return <span className="font-semibold text-[var(--care-primary)] whitespace-nowrap">{doctor.id}</span>;
                case "name":
                  return <span className="text-[var(--text-primary)] font-medium whitespace-nowrap">{doctor.name}</span>;
                case "status":
                  const statusVariant = 
                    doctor.status === "On leave" ? "warning" :
                    doctor.status === "Off duty" ? "danger" :
                    doctor.status === "Available" ? "info" : "default";
                  return (
                    <div className="whitespace-nowrap">
                      <StatusBadge variant={statusVariant}>
                        {doctor.status}
                      </StatusBadge>
                    </div>
                  );
                case "phone":
                  return <span className="text-[var(--text-secondary)] whitespace-nowrap">{doctor.phone}</span>;
                case "email":
                  return <span className="text-[var(--text-secondary)]">{doctor.email}</span>;
                case "actions":
                  return (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(doctor);
                        }}
                        className="rounded-md p-1.5 cursor-pointer text-[var(--care-primary)] hover:bg-[var(--care-primary)]/10 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="size-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doctor.id);
                        }}
                        className="rounded-md p-1.5 cursor-pointer text-red-400 hover:bg-red-400/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  );
                default:
                  return <span className="text-[var(--text-secondary)]">{String(doctor[column.key as keyof Doctor] || "")}</span>;
              }
            }}
            searchPlaceholder="Search by name, ID, department, or specialization..."
            filterOptions={statusFilterOptions}
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
            departmentFilterOptions={departmentFilterOptions}
            currentDepartmentFilter={filterDepartment}
            onDepartmentFilterChange={setFilterDepartment}
            onBulkDelete={handleBulkDelete}
            onBulkStatusUpdate={handleBulkStatusUpdate}
            emptyMessage="No doctors found"
          />
        </Card>
      </div>

      {/* Add Doctor Modal */}
      <ActionModal
        title="Add Doctor"
        subtitle="Register a new doctor in the system."
        confirmLabel="Add doctor"
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        trigger={<div />}
        showFooter={false}
      >
        <DoctorForm onClose={() => setIsAddModalOpen(false)} />
      </ActionModal>

      {/* Edit Doctor Modal */}
      <ActionModal
        title="Edit Doctor"
        subtitle="Update doctor information."
        confirmLabel="Update doctor"
        open={!!editingDoctor}
        onOpenChange={(open) => !open && setEditingDoctor(null)}
        trigger={<div />}
        showFooter={false}
      >
        {editingDoctor && (
          <DoctorForm 
            doctor={editingDoctor} 
            onClose={() => setEditingDoctor(null)}
          />
        )}
      </ActionModal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Doctor"
        description="Are you sure you want to delete this doctor? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        variant="danger"
      />

      {/* Bulk Delete Confirmation Dialog */}
      <ConfirmDialog
        open={bulkDeleteConfirmOpen}
        onOpenChange={setBulkDeleteConfirmOpen}
        title="Delete Multiple Doctors"
        description={`Are you sure you want to delete ${idsToDelete.length} doctors? This action cannot be undone.`}
        confirmLabel="Delete All"
        onConfirm={confirmBulkDelete}
        variant="danger"
      />
    </PageShell>
  );
}
