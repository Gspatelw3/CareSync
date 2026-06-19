import type { Metadata } from "next";
import Link from "next/link";
import { PageShell, PageHeader, Card, Table, StatusBadge } from "@/components/layout/page-shell";
import { SvgIcon } from "@/components/layout/page-shell";
import { iconPaths } from "@/lib/icons";
import { ActionButton } from "@/components/ui/action-buttons";

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
            <div className="relative">
              <SvgIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" paths={iconPaths.search} />
              <input
                className="h-10 w-52 rounded-md border border-[var(--care-border)] bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[var(--care-primary)]"
                placeholder="Search doctors..."
                type="search"
              />
            </div>
            <ActionButton icon={<SvgIcon className="size-4" paths={iconPaths.plus} />} message="New doctor registration form opened.">
              Add doctor
            </ActionButton>
          </>
        }
      />

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div className="rounded-lg border border-[var(--care-border)] bg-white p-4 shadow-sm shadow-[var(--care-primary)]/5" key={item.label}>
            <p className="text-sm font-medium text-slate-600">{item.label}</p>
            <p className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</p>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
              <span className="font-semibold text-[var(--care-secondary)]">{item.delta}</span>
              <span className="text-slate-500">{item.detail}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Card title="Doctor Directory" description="All registered doctors and their schedules.">
          <Table headers={["ID", "Name", "Specialization", "Department", "Patients", "Schedule", "Status", "Contact"]}>
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
          </Table>
        </Card>
      </div>
    </PageShell>
  );
}