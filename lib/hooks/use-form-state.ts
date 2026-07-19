// ── Generic Form State Management Hook ──
// Eliminates duplication across all form components

import { useState, useEffect, useCallback } from "react";

export interface UseFormStateOptions<T> {
  initialData?: Partial<T>;
  onSubmit: (data: T) => void | Promise<void>;
  validate?: (data: T) => Record<string, string>;
}

export function useFormState<T extends Record<string, unknown>>(
  options: UseFormStateOptions<T>
) {
  const { initialData, onSubmit, validate } = options;

  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    return initialData || {};
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const setField = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is modified
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field as string];
      return next;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    const validationErrors = validate ? validate(formData as T) : {};
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return false;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(formData as T);
      return true;
    } catch (error) {
      console.error("Form submission error:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validate]);

  const reset = useCallback(() => {
    setFormData(initialData || {});
    setErrors({});
    setIsSubmitting(false);
  }, [initialData]);

  return {
    formData,
    setFormData,
    setField,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    handleSubmit,
    reset,
  };
}