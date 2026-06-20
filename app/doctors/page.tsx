import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data-display/data-table";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Plus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { SearchInput } from "@/components/ui/search-input";
import { ActionModal } from "@/components/ui/action-modal";
import { FormField, FormSection } from "@/components/ui/forms/form-field";

export const metadata: Metadata = {
  title: "Doctors | Care Sync",
};

const doctors = [
  { id: "D-042", name: "Dr. Kavya Rao", specialization: "Cardiology", department: "Cardiology", patients: 184, schedule: "Mon–Fri 9 AM–5 PM", status: "On duty", phone: "+91 99887 76655" },
  { id: "D-041", name: "Dr. Neil Shah", specialization: "Orthopedics", department: "Orthopedics", patients: 127, schedule: "Mon–Sat 10 AM–6 PM", status: "On duty", phone: "+91 88776 65544" },
  { id: "D-040", name: "Dr. Amina Khan", specialization: "General Medicine", department: "General", patients: 210, schedule: "Mon–Fri 8 AM–4 PM", status: "On duty", phone: "+91 77665 54433" },
  { id: "D-039", name: "Dr. Amit Verma", specialization: "Neurology", department: "Neurology", patients: 96, schedule: "Tue–Sat 10 AM–7 PM", status: "On leave", phone: "+91 66554 43322" },
  { id: "D-038", name: "Dr. Sneha Kapoor", specialization: "Pediatrics", department: "Pediatrics", patients: 152, schedule: "Mon–Fri 9 AM–5 PM", status: "On duty", phone: "+91 55443 32211" },
  { id: "D-037", name: "Dr. Priya Mehta", specialization: "Obstetrics", department: "Obstetrics", patients: 138, schedule: "Mon–Sat 9 AM–4 PM", status: "On duty", phone: "+91 44332 21100" },
  { id: "D-036", name: "Dr. Rajesh Gupta", specialization: "Pulmonology", department: "Respiratory", patients: 74, schedule: "Wed–Sun 10 AM–6 PM", status: "On duty", phone: "+91 33221 10099" },
  { id: "D-035", name: "Dr. Sunita Reddy", specialization: "Dermatology", department: "Dermatology", patients: 89, schedule: "Mon–Fri 11 AM–7 PM", status: "On leave", phone: "+91 22110 09988" },
];

const stats = [
  { label: "Total Doctors", value: "186", delta: "42 on duty", detail: "14 departments covered" },
  { label: "On Duty Now", value: "42", delta: "6 in surgery", detail: "28 in consultations" },
  { label: "On Leave", value: "8", delta: "3 sick leave", detail: "5 planned leave" },
  { label: "Avg. Patients/Day", value: "24", delta: "−3 vs. last month", detail: "per doctor" },
];

export default function DoctorsPage() {
  return (
    <PageShell activeHref="/doctors">
      <PageHeader
        eyebrow="Care Team"
        title="Doctors"
        description="Doctor directory, profiles, department coverage, and schedule management."
        actions={
          <>
            <SearchInput placeholder="Search doctors..." />
            <ActionModal
              title="Add Doctor"
              subtitle="Register a new doctor in the system."
              confirmLabel="Add doctor"
              trigger={
                <ActionButton icon={<Plus className="size-4" />} message="">
                  Add doctor
                </ActionButton>
              }
            >
              <FormSection title="Personal Information">
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="First name" placeholder="e.g. Kavya" />
                  <FormField label="Last name" placeholder="e.g. Rao" />
                </div>
                <FormField label="Phone number" placeholder="+91 98765 43210" />
                <FormField label="Email" placeholder="kavya.rao@caresync.com" />
              </FormSection>
              <FormSection title="Professional Details">
                <FormField
                  label="Specialization"
                  type="select"
                  options={[
                    { label: "Cardiology", value: "cardiology" },
                    { label: "Orthopedics", value: "orthopedics" },
                    { label: "General Medicine", value: "general" },
                    { label: "Neurology", value: "neurology" },
                    { label: "Pediatrics", value: "pediatrics" },
                    { label: "Obstetrics", value: "obstetrics" },
                    { label: "Pulmonology", value: "pulmonology" },
                    { label: "Dermatology", value: "dermatology" },
                  ]}
                />
                <FormField
                  label="Department"
                  type="select"
                  options={[
                    { label: "Cardiology", value: "cardiology" },
                    { label: "Orthopedics", value: "orthopedics" },
                    { label: "General", value: "general" },
                    { label: "Neurology", value: "neurology" },
                    { label: "Pediatrics", value: "pediatrics" },
                    { label: "Obstetrics", value: "obstetrics" },
                    { label: "Respiratory", value: "respiratory" },
                    { label: "Dermatology", value: "dermatology" },
                  ]}
                />
                <FormField label="License number" placeholder="e.g. MCI-2024-0042" />
              </FormSection>
              <FormSection title="Schedule">
                <FormField
                  label="Working days"
                  type="select"
                  options={[
                    { label: "Mon–Fri", value: "weekdays" },
                    { label: "Mon–Sat", value: "weekdays-sat" },
                    { label: "Tue–Sat", value: "tue-sat" },
                    { label: "Wed–Sun", value: "wed-sun" },
                  ]}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Start time" type="text" placeholder="9 AM" />
                  <FormField label="End time" type="text" placeholder="5 PM" />
                </div>
              </FormSection>
            </ActionModal>
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <StatCard key={item.label} label={item.label} value={item.value} delta={item.delta} detail={item.detail} />
        ))}
      </div>

      <div className="mt-6">
        <Card title="Doctor Directory" description="All registered doctors and their schedules.">
          <DataTable headers={["ID", "Name", "Specialization", "Department", "Patients", "Schedule", "Status", "Contact"]}>
            {doctors.map((d) => (
              <tr className="hover:bg-slate-50 cursor-pointer" key={d.id}>
                <td className="px-5 py-4 font-semibold text-[var(--care-primary)]">{d.id}</td>
                <td className="px-5 py-4 text-slate-950 font-medium">{d.name}</td>
                <td className="px-5 py-4 text-slate-700">{d.specialization}</td>
                <td className="px-5 py-4 text-slate-700">{d.department}</td>
                <td className="px-5 py-4 text-slate-700">{d.patients}</td>
                <td className="px-5 py-4 text-slate-500 text-xs">{d.schedule}</td>
                <td className="px-5 py-4">
                  <StatusBadge variant={d.status === "On leave" ? "warning" : "default"}>
                    {d.status}
                  </StatusBadge>
                </td>
                <td className="px-5 py-4 text-slate-700 text-xs">{d.phone}</td>
              </tr>
            ))}
          </DataTable>
        </Card>
      </div>
    </PageShell>
  );
}