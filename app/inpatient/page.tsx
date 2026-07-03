"use client";

import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Filter, Plus } from "lucide-react";
import { ActionButton, SecondaryButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { useAdmissionStore } from "@/lib/stores";
import { initializeMockAdmissions } from "@/lib/stores/use-admission-store";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useEffect, useState } from "react";
import type { Admission } from "@/types";

export default function InpatientPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmission, setEditingAdmission] = useState<Admission | null>(null);
  
  const { 
    admissions, 
    getFilteredAdmissions, 
    getPaginatedAdmissions, 
    deleteAdmission, 
    bulkDelete,
    searchQuery,
    setSearchQuery,
    filterStatus,
    filterWard,
    setFilterStatus,
    setFilterWard
  } = useAdmissionStore();
  
  const { addToast } = useToast();

  // Initialize store with mock data
  useEffect(() => {
    initializeMockAdmissions();
  }, []);

  const filteredAdmissions = getFilteredAdmissions();
  const paginatedAdmissions = getPaginatedAdmissions();

  const stats = [
    { label: "Total Beds", value: "174", delta: "58 available", detail: "77% occupancy" },
    { label: "ICU Beds", value: "24", delta: "3 available", detail: "87.5% occupancy" },
    { label: "Admissions Today", value: admissions.filter(a => a.admitted === "2026-06-19").length.toString(), delta: "3 discharges", detail: "net +4" },
    { label: "Avg. Stay", value: "5.8 days", delta: "ICU: 8.2 days", detail: "General: 4.1 days" },
  ];

  const handleEdit = (admission: Admission) => {
    setEditingAdmission(admission);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this admission record?")) {
      deleteAdmission(id);
      addToast("Admission record deleted successfully", "success");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} admission records?`)) {
      bulkDelete(ids);
      addToast(`${ids.length} admission records deleted successfully`, "success");
    }
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "ward", label: "Ward", sortable: true },
    { key: "bed", label: "Bed", sortable: true },
    { key: "doctor", label: "Doctor", sortable: true },
    { key: "admitted", label: "Admitted", sortable: true },
    { key: "diagnosis", label: "Diagnosis", sortable: false },
    { key: "status", label: "Status", sortable: true },
  ];

  const statusFilterOptions = [
    { label: "All Status", value: "all" },
    { label: "Critical", value: "Critical" },
    { label: "Stable", value: "Stable" },
    { label: "Observation", value: "Observation" },
    { label: "Recovering", value: "Recovering" },
    { label: "Discharge soon", value: "Discharge soon" },
  ];

  const wardFilterOptions = [
    { label: "All Wards", value: "all" },
    { label: "ICU", value: "ICU" },
    { label: "Emergency", value: "Emergency" },
    { label: "General A", value: "General A" },
    { label: "General B", value: "General B" },
    { label: "Maternity", value: "Maternity" },
    { label: "Pediatrics", value: "Pediatrics" },
    { label: "Isolation", value: "Isolation" },
    { label: "Recovery", value: "Recovery" },
  ];

  return (
    <PageShell activeHref="/inpatient">
      <PageHeader
        eyebrow="Inpatient Care"
        title="Beds"
        description="Bed allocation, ward management, admissions, and discharge tracking."
        actions={
          <>
            <ActionModal
              title="Filter Wards"
              subtitle="Filter by ward type, occupancy, or status."
              confirmLabel="Apply filters"
              trigger={
                <SecondaryButton className="w-full sm:w-auto" icon={<Filter className="size-4" />} message="">
                  Filter wards
                </SecondaryButton>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Ward Type</label>
                  <select
                    value={filterWard}
                    onChange={(e) => setFilterWard(e.target.value)}
                    className="w-full rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-3 py-2 text-sm"
                  >
                    {wardFilterOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-3 py-2 text-sm"
                  >
                    {statusFilterOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </ActionModal>
            <ActionButton 
              icon={<Plus className="size-4" />} 
              message=""
              onClick={() => setIsAddModalOpen(true)}
            >
              Allocate bed
            </ActionButton>
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} detail={item.detail} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title="Ward Overview" description="Bed occupancy by ward.">
          <div className="p-5">
            <div className="grid gap-4">
              {["ICU", "Emergency", "General A", "General B", "Maternity", "Pediatrics", "Isolation", "Recovery"].map((ward) => {
                const occupied = admissions.filter(a => a.ward === ward).length;
                const total = ward === "ICU" ? 24 : ward === "Emergency" ? 18 : ward === "General A" ? 40 : ward === "General B" ? 36 : ward === "Maternity" ? 20 : ward === "Pediatrics" ? 16 : ward === "Isolation" ? 8 : 12;
                const available = total - occupied;
                const occupancyPct = Math.round((occupied / total) * 100);
                return (
                  <div className="flex flex-col gap-2" key={ward}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[var(--text-primary)] w-24">{ward}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-semibold text-[var(--text-secondary)]">{occupied}/{total}</span>
                        <span className={available > 0 ? "text-[var(--care-secondary)]" : "text-red-500"}>
                          {available} free
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--border-light)]">
                      <div
                        className={`h-2 rounded-full ${
                          occupancyPct > 85 ? "bg-red-400" : occupancyPct > 65 ? "bg-amber-400" : "bg-[var(--care-mint)]"
                        }`}
                        style={{ width: `${occupancyPct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card title="Current Admissions" description="Active inpatients.">
          <div className="divide-y divide-[var(--table-divide)]">
            {paginatedAdmissions.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">
                No admissions found
              </div>
            ) : (
              paginatedAdmissions.map((a) => (
                <div className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-[var(--hover-bg)]" key={a.id}>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">{a.patient}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">{a.ward} · {a.bed}</p>
                    <p className="mt-0.5 text-xs text-[var(--text-muted)]">{a.diagnosis}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <StatusBadge
                      variant={a.status === "Critical" ? "danger" : a.status === "Discharge soon" ? "info" : "default"}
                    >
                      {a.status}
                    </StatusBadge>
                    <p className="mt-1 text-[11px] text-[var(--text-muted-light)]">{a.admitted}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Add Admission Modal */}
      <ActionModal
        title="Allocate Bed"
        subtitle="Assign a bed to an incoming patient."
        confirmLabel="Allocate bed"
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        trigger={<div />}
      >
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Patient</label>
            <select className="w-full rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-3 py-2 text-sm">
              <option>Select patient...</option>
              {admissions.map(a => (
                <option key={a.id} value={a.patient}>{a.patient}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Ward</label>
            <select className="w-full rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-3 py-2 text-sm">
              <option>ICU (3 available)</option>
              <option>Emergency (4 available)</option>
              <option>General A (12 available)</option>
              <option>General B (6 available)</option>
              <option>Maternity (4 available)</option>
              <option>Pediatrics (5 available)</option>
              <option>Isolation (3 available)</option>
              <option>Recovery (4 available)</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Diagnosis</label>
            <input
              type="text"
              placeholder="e.g. Myocardial infarction"
              className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Doctor</label>
            <select className="w-full rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-3 py-2 text-sm">
              <option>Dr. Kavya Rao</option>
              <option>Dr. Neil Shah</option>
              <option>Dr. Amina Khan</option>
              <option>Dr. Amit Verma</option>
              <option>Dr. Sneha Kapoor</option>
              <option>Dr. Priya Mehta</option>
            </select>
          </div>
        </div>
      </ActionModal>
    </PageShell>
  );
}