"use client";

import { ActionButton } from "@/components/ui/action-buttons";
import { ActionModal } from "@/components/ui/action-modal";
import { AddPatientForm } from "@/components/patients/add-patient-form";
import { Plus } from "lucide-react";

export function AddPatientButton() {
  return (
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
  );
}