// ── Care Sync Shared Type Definitions ──
// Central type definitions used across the application.
// When connecting to a backend API, these types should mirror the API response schemas.

// ── Patient ──
export type Patient = {
  id: string;
  name: string;
  gender: "M" | "F" | "Other";
  age: number;
  contact: string;
  department: string;
  doctor: string;
  status: "Active" | "Discharged" | "ICU";
  lastVisit: string;
};

// ── Doctor ──
export type Doctor = {
  id: string;
  name: string;
  specialization: string;
  department: string;
  patients: number;
  schedule: string;
  status: "On duty" | "On leave";
  phone: string;
};

// ── Appointment ──
export type Appointment = {
  time: string;
  patient: string;
  care: string;
  doctor: string;
  type:
    | "Consultation"
    | "Follow-up"
    | "Check-up"
    | "Surgery prep"
    | "Vaccination"
    | "ECG"
    | "Physiotherapy";
  status: "Checked in" | "Waiting" | "Confirmed" | "Sample due";
};

// ── Invoice ──
export type Invoice = {
  id: string;
  patient: string;
  service: string;
  amount: string;
  insurance: string;
  paid: string;
  balance: string;
  date: string;
  status: "Paid" | "Partial" | "Pending";
};

// ── Insurance Claim ──
export type InsuranceClaim = {
  id: string;
  patient: string;
  insurer: string;
  amount: string;
  submitted: string;
  status: "Under review" | "Approved" | "Partial approved" | "Pending";
};

// ── Ward ──
export type Ward = {
  ward: string;
  beds: number;
  occupied: number;
  available: number;
  nurse: string;
  status: string;
};

// ── Admission ──
export type Admission = {
  id: string;
  patient: string;
  ward: string;
  bed: string;
  doctor: string;
  admitted: string;
  diagnosis: string;
  status: "Critical" | "Stable" | "Observation" | "Recovering" | "Discharge soon";
};

// ── Pharmacy Inventory Item ──
export type InventoryItem = {
  id: string;
  name: string;
  category: string;
  stock: number;
  reorder: number;
  unit: string;
  expiry: string;
  status: "In stock" | "Low stock" | "Critical";
};

// ── Dispensing Record ──
export type DispensingRecord = {
  id: string;
  patient: string;
  medication: string;
  quantity: number;
  prescribed: string;
  date: string;
  status: "Ready" | "Pending" | "Dispensed";
};

// ── Laboratory Test Request ──
export type LabTestRequest = {
  id: string;
  patient: string;
  test: string;
  doctor: string;
  requested: string;
  priority: "STAT" | "Urgent" | "Normal";
  status:
    | "Awaiting sample"
    | "Sample collected"
    | "In progress"
    | "Report ready"
    | "Reviewed";
};

// ── Lab Department ──
export type LabDepartment = {
  name: string;
  tests: number;
  pending: number;
  turnaround: string;
};

// ── Report ──
export type Report = {
  name: string;
  period: string;
  updated: string;
  status: "Generated" | "Draft" | "Auto-generated";
};

// ── Report Category ──
export type ReportCategory = {
  title: string;
  description: string;
  reports: Report[];
};

// ── Settings Entry ──
export type SettingsGroup = {
  title: string;
  description: string;
  fields: { label: string; value: string }[];
};

// ── Stat Card (Dashboard / Page Stats) ──
export type StatCardData = {
  label: string;
  value: string;
  delta: string;
  detail: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
};

// ── Navigation Item ──
export type NavigationItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

// ── Status Badge Variant ──
export type StatusBadgeVariant = "default" | "warning" | "danger" | "info";

// ── Alert ──
export type Alert = {
  label: string;
  value: string;
  tone: "amber" | "red" | "blue";
};