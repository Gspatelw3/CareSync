"use client";

import { useState, useEffect, useCallback } from "react";
import { FormField, FormSection } from "@/components/ui/forms/form-field";
import { Button } from "@/components/ui/button";
import { usePatientStore } from "@/lib/stores";
import { useToast } from "@/lib/use-toast";
import { validateRequired, validatePhone, validateAge } from "@/lib/utils/validation";
import { DEPARTMENTS, DOCTORS, GENDERS, PATIENT_STATUSES } from "@/lib/constants/options";
import type { Patient } from "@/types";

type PatientFormProps = {
  patient?: Patient;
  onClose?: () => void;
  onSubmit?: (submitFn: () => void) => void;
};

export function PatientForm({ patient, onClose, onSubmit }: PatientFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    gender: "M" as "M" | "F" | "Other",
    age: "",
    contact: "",
    department: "",
    doctor: "",
    status: "Active" as "Active" | "Discharged" | "ICU",
    lastVisit: new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addPatient, updatePatient } = usePatientStore();
  const { addToast } = useToast();

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name,
        gender: patient.gender,
        age: patient.age.toString(),
        contact: patient.contact,
        department: patient.department,
        doctor: patient.doctor,
        status: patient.status,
        lastVisit: patient.lastVisit,
      });
    }
  }, [patient]);

  function validate() {
    const next: Record<string, string> = {};

    const nameError = validateRequired(formData.name, "Patient name");
    if (nameError) next.name = nameError;

    const ageError = validateAge(formData.age);
    if (ageError) next.age = ageError;

    const phoneError = validatePhone(formData.contact);
    if (phoneError) next.contact = phoneError;

    const deptError = validateRequired(formData.department, "Department");
    if (deptError) next.department = deptError;

    const doctorError = validateRequired(formData.doctor, "Doctor");
    if (doctorError) next.doctor = doctorError;

    return next;
  }

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      addToast("Please fix the validation errors", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      if (patient) {
        updatePatient(patient.id, {
          ...formData,
          age: Number(formData.age),
        });
        addToast("Patient updated successfully", "success");
      } else {
        addPatient({
          ...formData,
          age: Number(formData.age),
        });
        addToast("Patient added successfully", "success");
      }

      onClose?.();
    } catch (error) {
      addToast("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [patient, formData, onClose, addPatient, updatePatient, addToast]);

  // Expose submit function to parent
  useEffect(() => {
    if (onSubmit) {
      onSubmit(handleSubmit);
    }
  }, [onSubmit, handleSubmit]);

  return (
    <div className="space-y-6">
      <FormSection title="Personal Information">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Full Name"
            placeholder="e.g. Meera Iyer"
            value={formData.name}
            onChange={(value) => setFormData({ ...formData, name: value })}
            error={errors.name}
          />
          <FormField
            label="Gender"
            type="select"
            value={formData.gender}
            onChange={(value) => setFormData({ ...formData, gender: value as "M" | "F" | "Other" })}
            options={GENDERS}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Age"
            type="number"
            placeholder="e.g. 38"
            value={formData.age}
            onChange={(value) => setFormData({ ...formData, age: value })}
            error={errors.age}
          />
          <FormField
            label="Contact Number"
            placeholder="+91 98765 43210"
            value={formData.contact}
            onChange={(value) => setFormData({ ...formData, contact: value })}
            error={errors.contact}
          />
        </div>
      </FormSection>

      <FormSection title="Medical Details">
        <FormField
          label="Department"
          type="select"
          value={formData.department}
          onChange={(value) => setFormData({ ...formData, department: value })}
          error={errors.department}
          options={DEPARTMENTS}
        />
        <FormField
          label="Assigned Doctor"
          type="select"
          value={formData.doctor}
          onChange={(value) => setFormData({ ...formData, doctor: value })}
          error={errors.doctor}
          options={DOCTORS}
        />
        <FormField
          label="Status"
          type="select"
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value as "Active" | "Discharged" | "ICU" })}
          options={PATIENT_STATUSES}
        />
        <FormField
          label="Last Visit"
          type="date"
          value={formData.lastVisit}
          onChange={(value) => setFormData({ ...formData, lastVisit: value })}
        />
      </FormSection>

      <div className="flex justify-end gap-3">
        {onClose && (
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="button" isLoading={isSubmitting} onClick={handleSubmit}>
          {patient ? "Update Patient" : "Add Patient"}
        </Button>
      </div>
    </div>
  );
}
