"use client";

import { type ReactNode, useState } from "react";
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
