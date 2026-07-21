"use client";

import { useState, useEffect, useCallback } from "react";
import { FormField, FormSection } from "@/components/ui/forms/form-field";
import { Button } from "@/components/ui/button";
import { useAppointmentStore } from "@/lib/stores";
import { useToast } from "@/lib/use-toast";
import { validateRequired } from "@/lib/utils/validation";
import { DEPARTMENTS, DOCTORS, PATIENTS, APPOINTMENT_TYPES, APPOINTMENT_STATUSES } from "@/lib/constants/options";
import type { Appointment } from "@/types";

type AppointmentFormProps = {
  appointment?: Appointment;
  onClose?: () => void;
  onSubmit?: (submitFn: () => void) => void;
};

export function AppointmentForm({ appointment, onClose, onSubmit }: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    time: "",
    patient: "",
    care: "",
    doctor: "",
    type: "Consultation" as Appointment["type"],
    status: "Confirmed" as Appointment["status"],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { addAppointment, updateAppointment } = useAppointmentStore();
  const { addToast } = useToast();

  useEffect(() => {
    if (appointment) {
      setFormData({
        time: appointment.time,
        patient: appointment.patient,
        care: appointment.care,
        doctor: appointment.doctor,
        type: appointment.type,
        status: appointment.status,
      });
    }
  }, [appointment]);

  function validate() {
    const next: Record<string, string> = {};

    if (!formData.time) {
      next.time = "Time is required.";
    }

    const patientError = validateRequired(formData.patient, "Patient");
    if (patientError) next.patient = patientError;

    const doctorError = validateRequired(formData.doctor, "Doctor");
    if (doctorError) next.doctor = doctorError;

    const careError = validateRequired(formData.care, "Department");
    if (careError) next.care = careError;

    return next;
  }

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      addToast("Please fix the validation errors", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      if (appointment) {
        updateAppointment(appointment.id, formData);
        addToast("Appointment updated successfully", "success");
      } else {
        addAppointment({
          ...formData,
        });
        addToast("Appointment booked successfully", "success");
      }

      // Close modal after successful creation
      onClose?.();
    } catch (error) {
      addToast("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }, [appointment, formData, onClose, addAppointment, updateAppointment, addToast]);

  // Expose submit function to parent modal
  useEffect(() => {
    if (onSubmit) {
      onSubmit(handleSubmit);
    }
  }, [onSubmit, handleSubmit]);

  return (
    <div className="space-y-6">
      <FormSection title="Patient Information">
        <FormField
          label="Patient Name"
          type="select"
          value={formData.patient}
          onChange={(value) => setFormData({ ...formData, patient: value })}
          error={errors.patient}
          options={PATIENTS}
        />
      </FormSection>

      <FormSection title="Schedule">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Time"
            type="text"
            placeholder="e.g. 10:00"
            value={formData.time}
            onChange={(value) => setFormData({ ...formData, time: value })}
            error={errors.time}
          />
          <FormField
            label="Appointment Type"
            type="select"
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value as Appointment["type"] })}
            options={APPOINTMENT_TYPES}
          />
        </div>
      </FormSection>

      <FormSection title="Care Team">
        <FormField
          label="Department"
          type="select"
          value={formData.care}
          onChange={(value) => setFormData({ ...formData, care: value })}
          error={errors.care}
          options={DEPARTMENTS}
        />
        <FormField
          label="Doctor"
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
          onChange={(value) => setFormData({ ...formData, status: value as Appointment["status"] })}
          options={APPOINTMENT_STATUSES}
        />
      </FormSection>

      <div className="flex justify-end gap-3">
        {onClose && (
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="button" onClick={handleSubmit} isLoading={isSubmitting}>
          {appointment ? "Update Appointment" : "Book Appointment"}
        </Button>
      </div>
    </div>
  );
}
