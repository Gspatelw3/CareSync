"use client";

import { FormField, FormSection } from "@/components/ui/action-modal";

export function AddPatientForm() {
  return (
    <>
      <FormSection title="Personal Information">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="First name" placeholder="e.g. Meera" />
          <FormField label="Last name" placeholder="e.g. Iyer" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Gender"
            type="select"
            options={[
              { label: "Male", value: "male" },
              { label: "Female", value: "female" },
              { label: "Other", value: "other" },
            ]}
          />
          <FormField label="Age" type="number" placeholder="e.g. 38" />
        </div>
        <FormField label="Phone number" placeholder="+91 98765 43210" />
        <FormField label="Email" placeholder="patient@email.com" />
      </FormSection>
      <FormSection title="Medical Details">
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
          ]}
        />
        <FormField
          label="Assign doctor"
          type="select"
          options={[
            { label: "Dr. Kavya Rao", value: "D-042" },
            { label: "Dr. Neil Shah", value: "D-041" },
            { label: "Dr. Amina Khan", value: "D-040" },
            { label: "Dr. Amit Verma", value: "D-039" },
            { label: "Dr. Sneha Kapoor", value: "D-038" },
            { label: "Dr. Priya Mehta", value: "D-037" },
          ]}
        />
        <FormField label="Medical history" type="textarea" placeholder="Any pre-existing conditions, allergies..." />
      </FormSection>
    </>
  );
}