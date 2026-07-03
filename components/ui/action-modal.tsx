"use client";

import { type ReactNode, useState, useId } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

export type ActionModalProps = {
  trigger: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  onConfirm?: () => void;
  confirmLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  showFooter?: boolean;
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
  showFooter = true,
}: ActionModalProps) {
  const formId = useId();
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
        footer={showFooter ? (
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setOpen(false)}
              type="button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form={formId}
              size="sm"
            >
              {confirmLabel}
            </Button>
          </div>
        ) : undefined}
      >
        <form
          id={formId}
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
