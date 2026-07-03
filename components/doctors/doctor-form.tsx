"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { FormField, FormSection } from "@/components/ui/forms/form-field";
import { Button } from "@/components/ui/button";
import { useDoctorStore } from "@/lib/stores";
import { useToast } from "@/lib/use-toast";
import type { Doctor } from "@/types";

type DoctorFormProps = {
  doctor?: Doctor;
  onClose?: () => void;
};

export function DoctorForm({ doctor, onClose }: DoctorFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    department: "",
    patients: 0,
    schedule: "",
    status: "On duty" as "On duty" | "Off duty" | "On leave" | "Available",
    phone: "",
    email: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addDoctor, updateDoctor } = useDoctorStore();
  const { addToast } = useToast();

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name,
        specialization: doctor.specialization,
        department: doctor.department,
        patients: doctor.patients,
        schedule: doctor.schedule,
        status: doctor.status,
        phone: doctor.phone,
        email: doctor.email,
      });
    }
  }, [doctor]);

  function validate() {
    const next: Record<string, string> = {};

    if (!formData.name.trim()) {
      next.name = "Doctor name is required.";
    }

    if (!formData.specialization) {
      next.specialization = "Specialization is required.";
    }

    if (!formData.department) {
      next.department = "Department is required.";
    }

    if (!formData.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (!/^[+]?[\d\s()-]+$/.test(formData.phone)) {
      next.phone = "Please enter a valid phone number.";
    }

    if (!formData.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = "Please enter a valid email address.";
    }

    if (formData.patients < 0) {
      next.patients = "Patients count cannot be negative.";
    }

    return next;
  }

  async function handleSubmit() {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      addToast("Please fix the validation errors", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Replace with actual API call
      if (doctor) {
        updateDoctor(doctor.id, formData);
        addToast("Doctor updated successfully", "success");
      } else {
        const newDoctor = addDoctor({
          ...formData,
        });
        addToast("Doctor added successfully", "success");
      }

      onClose?.();
    } catch (error) {
      addToast("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <FormSection title="Personal Information">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            placeholder="e.g. Dr. Kavya Rao"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            error={errors.name}
          />
          <FormField
            label="Email"
            type="email"
            placeholder="doctor@caresync.com"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            error={errors.email}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <FormField
            label="Phone Number"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(value) => setFormData({ ...formData, phone: value })}
            error={errors.phone}
          />
          <FormField
            label="Total Patients"
            type="number"
            placeholder="0"
            value={formData.patients.toString()}
            onChange={(value) => setFormData({ ...formData, patients: parseInt(value) || 0 })}
            error={errors.patients}
          />
        </div>
      </FormSection>

      <FormSection title="Professional Details">
        <FormField
          label="Specialization"
          type="select"
          value={formData.specialization}
          onChange={(value) => setFormData({ ...formData, specialization: value })}
          error={errors.specialization}
          options={[
            { label: "Cardiology", value: "Cardiology" },
            { label: "Orthopedics", value: "Orthopedics" },
            { label: "General Medicine", value: "General Medicine" },
            { label: "Neurology", value: "Neurology" },
            { label: "Pediatrics", value: "Pediatrics" },
            { label: "Obstetrics", value: "Obstetrics" },
            { label: "Pulmonology", value: "Pulmonology" },
            { label: "Dermatology", value: "Dermatology" },
          ]}
        />
        <FormField
          label="Department"
          type="select"
          value={formData.department}
          onChange={(value) => setFormData({ ...formData, department: value })}
          error={errors.department}
          options={[
            { label: "Cardiology", value: "Cardiology" },
            { label: "Orthopedics", value: "Orthopedics" },
            { label: "General", value: "General" },
            { label: "Neurology", value: "Neurology" },
            { label: "Pediatrics", value: "Pediatrics" },
            { label: "Obstetrics", value: "Obstetrics" },
            { label: "Respiratory", value: "Respiratory" },
            { label: "Dermatology", value: "Dermatology" },
          ]}
        />
        <FormField
          label="Status"
          type="select"
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value as "On duty" | "Off duty" | "On leave" | "Available" })}
          options={[
            { label: "On Duty", value: "On duty" },
            { label: "Off Duty", value: "Off duty" },
            { label: "On Leave", value: "On leave" },
            { label: "Available", value: "Available" },
          ]}
        />
      </FormSection>

      <FormSection title="Schedule">
        <FormField
          label="Schedule"
          placeholder="e.g. Mon–Fri 9 AM–5 PM"
          value={formData.schedule}
          onChange={(value) => setFormData({ ...formData, schedule: value })}
        />
      </FormSection>

      <div className="flex justify-end gap-3">
        {onClose && (
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="button" isLoading={isSubmitting} onClick={handleSubmit}>
          {doctor ? "Update Doctor" : "Add Doctor"}
        </Button>
      </div>
    </div>
  );
}
