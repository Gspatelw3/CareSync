"use client";

import { type ReactNode, useState } from "react";
import Select from "react-select";
import { Modal } from "@/components/ui/modal";

export type ActionModalProps = {
  trigger: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function ActionModal({
  trigger,
  title,
  subtitle,
  children,
  onConfirm,
  confirmLabel = "Submit",
  open: externalOpen,
  onOpenChange,
}: ActionModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;

  const setOpen = (value: boolean) => {
    if (isControlled) {
      onOpenChange?.(value);
    } else {
      setInternalOpen(value);
    }
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="w-full sm:w-auto">{trigger}</div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        subtitle={subtitle}
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              className="inline-flex h-10 items-center justify-center rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              onClick={() => setOpen(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="care-brand-gradient inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-white transition hover:brightness-95"
              type="submit"
              form="action-modal-form"
            >
              {confirmLabel}
            </button>
          </div>
        }
      >
        <form
          id="action-modal-form"
          onSubmit={(e) => {
            e.preventDefault();
            onConfirm?.();
            setOpen(false);
          }}
        >
          <div className="space-y-5">{children}</div>
        </form>
      </Modal>
    </>
  );
}

type FieldProps = {
  label: string;
  value?: string;
  placeholder?: string;
  type?: "text" | "select" | "textarea" | "number" | "date";
  options?: { label: string; value: string }[];
  onChange?: (value: string) => void;
};

export function FormField({ label, value, placeholder, type = "text", options, onChange }: FieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  const selectStyles = {
    control: (base: Record<string, unknown>, state: { isFocused: boolean }) => ({
      ...base,
      minHeight: "2.5rem",
      borderRadius: "0.375rem",
      border: "1px solid",
      borderColor: state.isFocused ? "var(--care-primary)" : "#e2e8f0",
      backgroundColor: "white",
      paddingLeft: "0.75rem",
      paddingRight: "0.75rem",
      display: "flex",
      alignItems: "center",
      boxShadow: "none",
      "&:hover": {
        borderColor: state.isFocused ? "var(--care-primary)" : "#e2e8f0",
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
      color: "#0f172a",
      fontSize: "0.875rem",
    }),
    singleValue: (base: Record<string, unknown>) => ({
      ...base,
      color: "#0f172a",
      fontSize: "0.875rem",
      margin: 0,
    }),
    placeholder: (base: Record<string, unknown>) => ({
      ...base,
      color: "#94a3b8",
      fontSize: "0.875rem",
      margin: 0,
    }),
    menu: (base: Record<string, unknown>) => ({
      ...base,
      borderRadius: "0.375rem",
      border: "1px solid #e2e8f0",
      backgroundColor: "white",
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      zIndex: 60,
      overflow: "hidden",
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
      color: "#0f172a",
      backgroundColor: state.isFocused ? "#f1f5f9" : "transparent",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "#e2e8f0",
      },
    }),
    clearIndicator: (base: Record<string, unknown>) => ({
      ...base,
      color: "#94a3b8",
      cursor: "pointer",
      padding: "0.25rem",
      "&:hover": {
        color: "#64748b",
      },
    }),
    dropdownIndicator: (base: Record<string, unknown>) => ({
      ...base,
      color: "#94a3b8",
      cursor: "pointer",
      padding: "0.25rem",
      "&:hover": {
        color: "#64748b",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
  };

  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700" htmlFor={id}>
        {label}
      </label>
      {type === "select" && options ? (
        <Select
          inputId={id}
          options={options}
          placeholder={`Select ${label.toLowerCase()}...`}
          defaultValue={value ? options.find((o) => o.value === value) : undefined}
          onChange={(opt) => onChange?.(opt?.value ?? "")}
          isClearable
          unstyled
          styles={selectStyles}
        />
      ) : type === "textarea" ? (
        <textarea
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[var(--care-primary)]"
          defaultValue={value || ""}
          id={id}
          placeholder={placeholder}
          rows={3}
        />
      ) : (
        <input
          className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none focus:border-[var(--care-primary)] placeholder:text-slate-400"
          defaultValue={value || ""}
          id={id}
          placeholder={placeholder}
          type={type}
        />
      )}
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-slate-500">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}