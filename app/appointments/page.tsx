"use client";

import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Calendar, Plus } from "lucide-react";
import { ActionButton, SecondaryButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { useAppointmentStore } from "@/lib/stores";
import { initializeMockAppointments } from "@/lib/stores/use-appointment-store";
import { AppointmentForm } from "@/components/appointments/appointment-form";
import { EnhancedDataTable } from "@/components/data-display/enhanced-data-table";
import { useToast } from "@/lib/use-toast";
import { useEffect, useState } from "react";
import type { Appointment } from "@/types";

export default function AppointmentsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  
  const { 
    appointments, 
    getFilteredAppointments, 
    getPaginatedAppointments, 
    deleteAppointment, 
    bulkDelete,
    searchQuery,
    setSearchQuery,
    filterStatus,
    filterType,
    setFilterStatus,
    setFilterType
  } = useAppointmentStore();
  
  const { addToast } = useToast();

  // Initialize store with mock data
  useEffect(() => {
    initializeMockAppointments();
  }, []);

  const filteredAppointments = getFilteredAppointments();
  const paginatedAppointments = getPaginatedAppointments();

  const stats = [
    { label: "Today's Appointments", value: appointments.length.toString(), delta: `${appointments.filter(a => a.status === "Waiting").length} pending`, detail: `${appointments.filter(a => a.status === "Checked in").length} completed check-ins` },
    { label: "Checked In", value: appointments.filter(a => a.status === "Checked in").length.toString(), delta: "12 in waiting", detail: "avg. 14 min wait" },
    { label: "Cancelled Today", value: "0", delta: "0 rescheduled", detail: "0 no-shows" },
    { label: "Next Week", value: "418", delta: "24 open slots", detail: "89% booked" },
  ];

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this appointment?")) {
      deleteAppointment(id);
      addToast("Appointment deleted successfully", "success");
    }
  };

  const handleBulkDelete = (ids: string[]) => {
    if (confirm(`Are you sure you want to delete ${ids.length} appointments?`)) {
      bulkDelete(ids);
      addToast(`${ids.length} appointments deleted successfully`, "success");
    }
  };

  const columns = [
    { key: "time", label: "Time", sortable: true },
    { key: "patient", label: "Patient", sortable: true },
    { key: "care", label: "Care", sortable: true },
    { key: "doctor", label: "Doctor", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "status", label: "Status", sortable: true },
  ];

  const statusFilterOptions = [
    { label: "All Status", value: "all" },
    { label: "Checked in", value: "Checked in" },
    { label: "Waiting", value: "Waiting" },
    { label: "Confirmed", value: "Confirmed" },
    { label: "Sample due", value: "Sample due" },
  ];

  const typeFilterOptions = [
    { label: "All Types", value: "all" },
    { label: "Consultation", value: "Consultation" },
    { label: "Follow-up", value: "Follow-up" },
    { label: "Check-up", value: "Check-up" },
    { label: "Surgery prep", value: "Surgery prep" },
    { label: "Vaccination", value: "Vaccination" },
    { label: "ECG", value: "ECG" },
    { label: "Physiotherapy", value: "Physiotherapy" },
  ];

  return (
    <PageShell activeHref="/appointments">
      <PageHeader
        eyebrow="Scheduling"
        title="Appointments"
        description="Calendar views, appointment lists, booking, and check-ins."
        actions={
          <>
            <ActionModal
              title="Calendar View"
              subtitle="Weekly appointment calendar — click a slot to view details."
              confirmLabel="Close"
              trigger={
                <SecondaryButton className="w-full sm:w-auto" icon={<Calendar className="size-4" />} message="">
                  Calendar view
                </SecondaryButton>
              }
            >
              <div className="rounded-lg border border-[var(--border-default)]">
                <div className="grid grid-cols-7 border-b border-[var(--border-default)] bg-[var(--care-surface)] text-center text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                    <div className="border-r border-[var(--border-default)] px-2 py-3 last:border-r-0" key={d}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 text-center text-sm">
                  {Array.from({ length: 30 }).map((_, i) => {
                    const day = i + 1;
                    const hasAppt = [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29].includes(day);
                    const isToday = day === 19;
                    return (
                      <div
                        className={`border-b border-r border-[var(--border-light)] px-1 py-3 last:border-r-0 ${
                          isToday ? "bg-[var(--care-mint)]/10 ring-1 ring-inset ring-[var(--care-primary)] font-semibold" : ""
                        }`}
                        key={day}
                      >
                        <span className={isToday ? "text-[var(--care-primary)]" : "text-[var(--text-secondary)]"}>{day}</span>
                        {hasAppt && (
                          <div className="mt-1 mx-auto h-1.5 w-1.5 rounded-full bg-[var(--care-primary)]" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              <p className="mt-3 text-xs text-[var(--text-muted)] text-center">
                Showing June 2026 · Dots indicate scheduled appointments · <span className="font-semibold text-[var(--care-primary)]">19 Jun</span> is today
              </p>
            </ActionModal>
            <ActionButton 
              icon={<Plus className="size-4" />} 
              message=""
              onClick={() => setIsAddModalOpen(true)}
            >
              Book appointment
            </ActionButton>
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} detail={item.detail} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card title="Today's Schedule" description="All appointments for today, 19 June 2026.">
          <EnhancedDataTable
            columns={columns}
            data={paginatedAppointments}
            getRowId={(appointment) => appointment.id}
            renderCell={(appointment, column) => {
              switch (column.key) {
                case "time":
                  return <span className="font-semibold text-[var(--text-primary)]">{appointment.time}</span>;
                case "patient":
                  return <span className="text-[var(--text-secondary)] font-medium">{appointment.patient}</span>;
                case "status":
                  return (
                    <StatusBadge
                      variant={appointment.status === "Waiting" || appointment.status === "Sample due" ? "warning" : "default"}
                    >
                      {appointment.status}
                    </StatusBadge>
                  );
                default:
                  return <span className="text-[var(--text-secondary)]">{String(appointment[column.key as keyof Appointment] || "")}</span>;
              }
            }}
            searchPlaceholder="Search appointments..."
            filterOptions={statusFilterOptions}
            currentFilter={filterStatus}
            onFilterChange={setFilterStatus}
            onRowClick={handleEdit}
            onBulkDelete={handleBulkDelete}
            emptyMessage="No appointments found"
          />
        </Card>

        <div className="space-y-6">
          <section className="rounded-lg border border-[var(--care-border)] bg-[var(--card-bg)] p-5 shadow-sm shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Weekly Volume</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Appointments by day this week.</p>
            <div className="mt-5 flex h-48 items-end gap-2 border-b border-l border-[var(--border-default)] px-1 pb-3">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                <div className="flex h-full flex-1 flex-col items-center justify-end gap-1.5" key={day}>
                  <span className="text-[11px] font-semibold text-[var(--text-muted)]">{[312, 298, 324, 287, 341, 156, 89][i]}</span>
                  <div
                    className="care-brand-gradient-vertical w-full rounded-t-md"
                    style={{ height: `${([312, 298, 324, 287, 341, 156, 89][i] / 360) * 100}%` }}
                  />
                  <span className="text-[11px] font-medium text-[var(--text-muted)]">{day}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-[var(--care-border)] bg-[var(--card-bg)] p-5 shadow-sm shadow-[var(--shadow-card)]">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Quick Stats</h2>
            <div className="mt-5 grid gap-4">
              <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Avg. consultation time</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">18 min</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Peak hour</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">10:00–11:00</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">No-show rate</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">4.2%</span>
              </div>
              <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-3">
                <span className="text-sm font-medium text-[var(--text-secondary)]">Reschedule requests</span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">12</span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <ActionModal
        title="Book Appointment"
        subtitle="Schedule a new patient appointment."
        confirmLabel="Book appointment"
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        trigger={<div />}
        showFooter={false}
      >
        <AppointmentForm onClose={() => setIsAddModalOpen(false)} />
      </ActionModal>

      {/* Edit Appointment Modal */}
      <ActionModal
        title="Edit Appointment"
        subtitle="Update appointment details."
        confirmLabel="Update appointment"
        open={!!editingAppointment}
        onOpenChange={(open) => !open && setEditingAppointment(null)}
        trigger={<div />}
        showFooter={false}
      >
        {editingAppointment && (
          <AppointmentForm appointment={editingAppointment} onClose={() => setEditingAppointment(null)} />
        )}
      </ActionModal>
    </PageShell>
  );
}