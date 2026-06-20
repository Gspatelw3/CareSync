import type { Metadata } from "next";
import { PageShell, PageHeader, Card, Table, StatusBadge, StatCard } from "@/components/layout/page-shell";
import { Plus } from "lucide-react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { SearchInput } from "@/components/ui/search-input";
import { AddPatientForm } from "@/components/patients/add-patient-form";

export const metadata: Metadata = {
  title: "Patients | Care Sync",
};

const patients = [
  { id: "P-1024", name: "Meera Iyer", gender: "F", age: 38, contact: "+91 98765 43210", department: "Cardiology", doctor: "Dr. Kavya Rao", status: "Active", lastVisit: "19 Jun 2026" },
  { id: "P-1023", name: "Arjun Menon", gender: "M", age: 52, contact: "+91 87654 32109", department: "Orthopedics", doctor: "Dr. Neil Shah", status: "Active", lastVisit: "18 Jun 2026" },
  { id: "P-1022", name: "Priya Nair", gender: "F", age: 29, contact: "+91 76543 21098", department: "General", doctor: "Dr. Amina Khan", status: "Discharged", lastVisit: "17 Jun 2026" },
  { id: "P-1021", name: "Rohan Das", gender: "M", age: 45, contact: "+91 65432 10987", department: "Neurology", doctor: "Dr. Amit Verma", status: "Active", lastVisit: "16 Jun 2026" },
  { id: "P-1020", name: "Sneha Patel", gender: "F", age: 34, contact: "+91 54321 09876", department: "Pediatrics", doctor: "Dr. Sneha Kapoor", status: "Active", lastVisit: "15 Jun 2026" },
  { id: "P-1019", name: "Vikram Singh", gender: "M", age: 61, contact: "+91 43210 98765", department: "Cardiology", doctor: "Dr. Kavya Rao", status: "ICU", lastVisit: "14 Jun 2026" },
  { id: "P-1018", name: "Anita Sharma", gender: "F", age: 27, contact: "+91 32109 87654", department: "Obstetrics", doctor: "Dr. Priya Mehta", status: "Discharged", lastVisit: "13 Jun 2026" },
  { id: "P-1017", name: "Deepak Kumar", gender: "M", age: 48, contact: "+91 21098 76543", department: "Orthopedics", doctor: "Dr. Neil Shah", status: "Active", lastVisit: "12 Jun 2026" },
];

const stats = [
  { label: "Total Patients", value: "12,486", delta: "+8.2%", detail: "358 active today" },
  { label: "New This Week", value: "147", delta: "+12.5%", detail: "vs. last week" },
  { label: "ICU / Critical", value: "23", delta: "11 observed", detail: "86% occupancy" },
  { label: "Avg. Stay", value: "4.2 days", delta: "−0.6 days", detail: "reducing YTD" },
];

export default function PatientsPage() {
  return (
    <PageShell activeHref="/patients">
      <PageHeader
        eyebrow="Patient Management"
        title="Patients"
        description="Patient registry, intake, profiles, and medical history."
        actions={
          <>
            <SearchInput placeholder="Search patients..." />
              <ActionModal
                title="Add Patient"
                subtitle="Register a new patient in the system."
                confirmLabel="Add patient"
                trigger={
                  <ActionButton icon={<Plus className="size-4" />} message="">
                    Add patient
                  </ActionButton>
                }
              >
                <AddPatientForm />
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
        <Card title="Patient Registry" description="All registered patients sorted by last visit.">
          <Table headers={["ID", "Name", "Gender", "Age", "Contact", "Department", "Doctor", "Status", "Last Visit"]}>
            {patients.map((p) => (
              <tr className="hover:bg-slate-50 cursor-pointer" key={p.id}>
                <td className="px-5 py-4 font-semibold text-[var(--care-primary)]">{p.id}</td>
                <td className="px-5 py-4 text-slate-950 font-medium">{p.name}</td>
                <td className="px-5 py-4 text-slate-700">{p.gender}</td>
                <td className="px-5 py-4 text-slate-700">{p.age}</td>
                <td className="px-5 py-4 text-slate-700">{p.contact}</td>
                <td className="px-5 py-4 text-slate-700">{p.department}</td>
                <td className="px-5 py-4 text-slate-700">{p.doctor}</td>
                <td className="px-5 py-4">
                  <StatusBadge
                    variant={p.status === "Discharged" ? "info" : p.status === "ICU" ? "danger" : "default"}
                  >
                    {p.status}
                  </StatusBadge>
                </td>
                <td className="px-5 py-4 text-slate-500 text-xs">{p.lastVisit}</td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </PageShell>
  );
}