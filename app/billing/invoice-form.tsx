"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { FormField, FormSection } from "@/components/ui/forms/form-field";
import { Button } from "@/components/ui/button";
import { useBillingStore } from "@/lib/stores";
import { useToast } from "@/lib/use-toast";
import { validateRequired } from "@/lib/utils/validation";
import { PATIENTS, INSURANCE_PROVIDERS, INVOICE_SERVICES, INVOICE_STATUSES } from "@/lib/constants/options";
import type { Invoice } from "@/types";

type InvoiceFormProps = {
    invoice?: Invoice | null;
    onClose?: () => void;
    onSubmit?: (submitFn: () => void) => void;
};

export function InvoiceForm({ invoice, onClose, onSubmit }: InvoiceFormProps) {
    const [formData, setFormData] = useState({
        patient: "",
        service: "",
        amount: "",
        insurance: "None",
        paid: "",
        balance: "",
        date: new Date().toISOString().split("T")[0],
        status: "Pending" as Invoice["status"],
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { addInvoice, updateInvoice } = useBillingStore();
    const { addToast } = useToast();

    // Auto-calculate balance based on amount and paid
    const calculatedBalance = useMemo(() => {
        const amount = parseFloat(formData.amount) || 0;
        const paid = parseFloat(formData.paid) || 0;
        return Math.max(0, amount - paid).toFixed(2);
    }, [formData.amount, formData.paid]);

    useEffect(() => {
        if (invoice) {
            setFormData({
                patient: invoice.patient,
                service: invoice.service,
                amount: invoice.amount,
                insurance: invoice.insurance,
                paid: invoice.paid,
                balance: invoice.balance,
                date: invoice.date,
                status: invoice.status,
            });
        }
    }, [invoice]);

  function validate() {
    const next: Record<string, string> = {};

    const patientError = validateRequired(formData.patient, "Patient");
    if (patientError) next.patient = patientError;

    const serviceError = validateRequired(formData.service, "Service");
    if (serviceError) next.service = serviceError;

    if (!formData.amount) {
      next.amount = "Amount is required.";
    }

    return next;
  }

    const handleSubmit = useCallback(
        async (e?: React.FormEvent) => {
            e?.preventDefault();

            const validationErrors = validate();
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length > 0) {
                addToast("Please fix the validation errors", "error");
                return;
            }

            setIsSubmitting(true);

            try {
                // Update balance with calculated value before submission
                const submitData = {
                    ...formData,
                    balance: calculatedBalance,
                };

                if (invoice) {
                    updateInvoice(invoice.id, submitData);
                    addToast("Invoice updated successfully", "success");
                } else {
                    addInvoice(submitData);
                    addToast("Invoice created successfully", "success");
                }

                onClose?.();
            } catch (error) {
                addToast("An error occurred. Please try again.", "error");
            } finally {
                setIsSubmitting(false);
            }
        },
        [
            invoice,
            formData,
            calculatedBalance,
            onClose,
            addInvoice,
            updateInvoice,
            addToast,
        ],
    );

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
                    label="Patient"
                    type="select"
                    value={formData.patient}
                    onChange={(value) =>
                        setFormData({ ...formData, patient: value })
                    }
                    error={errors.patient}
                    options={PATIENTS}
                />
            </FormSection>

            <FormSection title="Service Details">
                <FormField
                    label="Service"
                    type="select"
                    value={formData.service}
                    onChange={(value) =>
                        setFormData({ ...formData, service: value })
                    }
                    error={errors.service}
                    options={INVOICE_SERVICES}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Amount (₹)"
                        type="text"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(value) =>
                            setFormData({ ...formData, amount: value })
                        }
                        error={errors.amount}
                    />
                    <FormField
                        label="Insurance"
                        type="select"
                        value={formData.insurance}
                        onChange={(value) =>
                            setFormData({ ...formData, insurance: value })
                        }
                        options={INSURANCE_PROVIDERS}
                    />
                </div>
            </FormSection>

            <FormSection title="Payment Information">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Paid (₹)"
                        type="text"
                        placeholder="0.00"
                        value={formData.paid}
                        onChange={(value) =>
                            setFormData({ ...formData, paid: value })
                        }
                    />
                    <div>
                        <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                            Balance (₹)
                        </label>
                        <input
                            type="text"
                            readOnly
                            value={calculatedBalance}
                            className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm opacity-75"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        label="Date"
                        type="text"
                        value={formData.date}
                        onChange={(value) =>
                            setFormData({ ...formData, date: value })
                        }
                    />
                    <FormField
                        label="Status"
                        type="select"
                        value={formData.status}
                        onChange={(value) =>
                            setFormData({
                                ...formData,
                                status: value as Invoice["status"],
                            })
                        }
                        options={INVOICE_STATUSES}
                    />
                </div>
            </FormSection>

            <div className="flex justify-end gap-3">
                {onClose && (
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancel
                    </Button>
                )}
                <Button
                    type="button"
                    isLoading={isSubmitting}
                    onClick={handleSubmit}
                >
                    {invoice ? "Update Invoice" : "Create Invoice"}
                </Button>
            </div>
        </div>
    );
}
