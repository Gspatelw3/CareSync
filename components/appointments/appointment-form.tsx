"use client";

import { useState, useEffect } from "react";
import { FormField, FormSection } from "@/components/ui/forms/form-field";
import { Button } from "@/components/ui/button";
import { useAppointmentStore } from "@/lib/stores";
import { useToast } from "@/lib/use-toast";
import type { Appointment } from "@/types";

type AppointmentFormProps = {
  appointment?: Appointment;
  onClose?: () => void;
};

export function AppointmentForm({ appointment, onClose }: AppointmentFormProps) {
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

    if (!formData.patient) {
      next.patient = "Patient is required.";
    }

    if (!formData.doctor) {
      next.doctor = "Doctor is required.";
    }

    if (!formData.care) {
      next.care = "Department is required.";
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
      if (appointment) {
        updateAppointment(appointment.id, formData);
        addToast("Appointment updated successfully", "success");
      } else {
        addAppointment({
          ...formData,
        });
        addToast("Appointment booked successfully", "success");
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
      <FormSection title="Patient Information">
        <FormField
          label="Patient Name"
          type="select"
          value={formData.patient}
          onChange={(value) => setFormData({ ...formData, patient: value })}
          error={errors.patient}
          options={[
            { label: "Ravi Kumar", value: "Ravi Kumar" },
            { label: "Neha Joshi", value: "Neha Joshi" },
            { label: "Mohan Das", value: "Mohan Das" },
            { label: "Sita Verma", value: "Sita Verma" },
            { label: "Aisha Patel", value: "Aisha Patel" },
            { label: "Vikram Singh", value: "Vikram Singh" },
            { label: "Lakshmi Nair", value: "Lakshmi Nair" },
            { label: "Deepak Kumar", value: "Deepak Kumar" },
          ]}
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
            options={[
              { label: "Consultation", value: "Consultation" },
              { label: "Follow-up", value: "Follow-up" },
              { label: "Check-up", value: "Check-up" },
              { label: "Surgery prep", value: "Surgery prep" },
              { label: "Vaccination", value: "Vaccination" },
              { label: "ECG", value: "ECG" },
              { label: "Physiotherapy", value: "Physiotherapy" },
            ]}
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
          options={[
            { label: "Cardiology", value: "Cardiology" },
            { label: "Orthopedics", value: "Orthopedics" },
            { label: "General", value: "General" },
            { label: "Neurology", value: "Neurology" },
            { label: "Pediatrics", value: "Pediatrics" },
            { label: "Obstetrics", value: "Obstetrics" },
            { label: "Dermatology", value: "Dermatology" },
            { label: "Pulmonology", value: "Pulmonology" },
          ]}
        />
        <FormField
          label="Doctor"
          type="select"
          value={formData.doctor}
          onChange={(value) => setFormData({ ...formData, doctor: value })}
          error={errors.doctor}
          options={[
            { label: "Dr. Kavya Rao", value: "Dr. Kavya Rao" },
            { label: "Dr. Neil Shah", value: "Dr. Neil Shah" },
            { label: "Dr. Amina Khan", value: "Dr. Amina Khan" },
            { label: "Dr. Amit Verma", value: "Dr. Amit Verma" },
            { label: "Dr. Sneha Kapoor", value: "Dr. Sneha Kapoor" },
            { label: "Dr. Priya Mehta", value: "Dr. Priya Mehta" },
            { label: "Dr. Rajesh Gupta", value: "Dr. Rajesh Gupta" },
            { label: "Dr. Sunita Reddy", value: "Dr. Sunita Reddy" },
          ]}
        />
        <FormField
          label="Status"
          type="select"
          value={formData.status}
          onChange={(value) => setFormData({ ...formData, status: value as Appointment["status"] })}
          options={[
            { label: "Confirmed", value: "Confirmed" },
            { label: "Waiting", value: "Waiting" },
            { label: "Checked in", value: "Checked in" },
            { label: "Sample due", value: "Sample due" },
          ]}
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
