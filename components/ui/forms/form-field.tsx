"use client";

import { useState, useEffect } from "react";
import Select from "react-select";
import { DatePicker } from "@/components/ui/date-picker";

type FormFieldProps = {
  label: string;
  value?: string;
  placeholder?: string;
  type?: "text" | "select" | "textarea" | "number" | "date" | "tel" | "email";
  options?: { label: string; value: string }[];
  onChange?: (value: string) => void;
  error?: string;
};

const selectStyles = {
  control: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
    ...base,
    minHeight: "2.5rem",
    borderRadius: "0.375rem",
    border: "1px solid",
    borderColor: state.isFocused ? "var(--care-primary)" : "var(--input-border)",
    backgroundColor: "var(--input-bg)",
    paddingLeft: "0.75rem",
    paddingRight: "0.75rem",
    display: "flex",
    alignItems: "center",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.isFocused ? "var(--care-primary)" : "var(--input-border)",
    },
  }),
  valueContainer: (base: Record<string, unknown>) => ({
    ...base,
    padding: 0,
  }),
  input: (base: Record<string, unknown>) => ({
    ...base,
    margin: 0,
    padding: 0,
    color: "var(--input-text)",
    fontSize: "0.875rem",
  }),
  singleValue: (base: Record<string, unknown>) => ({
    ...base,
    color: "var(--input-text)",
    fontSize: "0.875rem",
    margin: 0,
  }),
  placeholder: (base: Record<string, unknown>) => ({
    ...base,
    color: "var(--input-placeholder)",
    fontSize: "0.875rem",
    margin: 0,
  }),
  menu: (base: Record<string, unknown>) => ({
    ...base,
    borderRadius: "0.375rem",
    border: "1px solid var(--border-default)",
    backgroundColor: "var(--card-bg)",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    zIndex: 999999,
    overflow: "hidden",
  }),
  menuPortal: (base: Record<string, unknown>) => ({
    ...base,
    zIndex: 999999,
  }),
  menuList: (base: Record<string, unknown>) => ({
    ...base,
    padding: "0.25rem",
  }),
  option: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
    ...base,
    padding: "0.375rem 0.75rem",
    fontSize: "0.875rem",
    borderRadius: "0.25rem",
    color: "var(--text-primary)",
    backgroundColor: state.isFocused ? "var(--hover-bg-strong)" : "transparent",
    cursor: "pointer",
    "&:active": { backgroundColor: "var(--border-default)" },
  }),
  clearIndicator: (base: Record<string, unknown>) => ({
    ...base,
    color: "var(--text-muted-light)",
    cursor: "pointer",
    padding: "0.25rem",
    "&:hover": { color: "var(--text-muted)" },
  }),
  dropdownIndicator: (base: Record<string, unknown>) => ({
    ...base,
    color: "var(--text-muted-light)",
    cursor: "pointer",
    padding: "0.25rem",
    "&:hover": { color: "var(--text-muted)" },
  }),
  indicatorSeparator: () => ({ display: "none" }),
};

export function FormField({
  label,
  value: externalValue,
  placeholder,
  type = "text",
  options,
  onChange: externalOnChange,
  error,
}: FormFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");
  const [mounted, setMounted] = useState(false);

  // Internal state for uncontrolled usage (when no external value/onChange is provided).
  // This allows form fields to track user input even without parent state management.
  const [internalValue, setInternalValue] = useState("");

  const isControlled = externalValue !== undefined;
  const value = isControlled ? externalValue : internalValue;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    externalOnChange?.(newValue);
  };

  return (
    <div>
      <label
        className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]"
        htmlFor={id}
      >
        {label}
      </label>
      {error && (
        <p className="mb-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
      {type === "select" && options ? (
        <Select
          inputId={id}
          instanceId={id}
          options={options}
          placeholder={`Select ${label.toLowerCase()}...`}
          value={value ? options.find((o) => o.value === value) : null}
          onChange={(opt) => handleChange(opt?.value ?? "")}
          isClearable
          unstyled
          styles={selectStyles}
          menuPortalTarget={mounted ? document.body : undefined}
          menuPosition="fixed"
        />
      ) : type === "textarea" ? (
        <textarea
          className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm text-[var(--input-text)] outline-none focus:border-[var(--care-primary)] focus:ring-2 focus:ring-[var(--care-primary)]/20 placeholder:text-[var(--input-placeholder)]"
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          id={id}
          placeholder={placeholder}
          rows={3}
        />
      ) : type === "date" ? (
        <DatePicker
          value={value || undefined}
          placeholder={placeholder}
          onChange={handleChange}
          id={id}
        />
      ) : (
        <input
          className="h-10 w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-sm text-[var(--input-text)] outline-none focus:border-[var(--care-primary)] focus:ring-2 focus:ring-[var(--care-primary)]/20 placeholder:text-[var(--input-placeholder)]"
          value={value || ""}
          onChange={(e) => handleChange(e.target.value)}
          id={id}
          placeholder={placeholder}
          type={type}
        />
      )}
    </div>
  );
}

export function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
