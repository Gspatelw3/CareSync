"use client";

import { useState, useCallback } from "react";
import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { PatientForm } from "@/components/patients/patient-form";
import { Plus } from "lucide-react";

export function AddPatientButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitFn, setSubmitFn] = useState<(() => void) | null>(null);

  const handleSubmitRef = useCallback((fn: () => void) => {
    setSubmitFn(() => fn);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSubmitFn(null);
  }, []);

  return (
    <ActionModal
      title="Add Patient"
      subtitle="Register a new patient in the system."
      confirmLabel="Add patient"
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <ActionButton icon={<Plus className="size-4" />} message="">
          Add patient
        </ActionButton>
      }
      onConfirm={submitFn || undefined}
      showFooter={false}
    >
      <PatientForm onClose={handleClose} onSubmit={handleSubmitRef} />
    </ActionModal>
  );
}