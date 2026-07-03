"use client";

import { type ReactNode, useState, useId } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type ConfirmDialogProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: "danger" | "warning" | "info";
  children?: ReactNode;
};

export function ConfirmDialog({
  open = false,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  variant = "danger",
  children,
}: ConfirmDialogProps) {
  const formId = useId();

  const handleConfirm = () => {
    onConfirm();
    onOpenChange?.(false);
  };

  const variantStyles = {
    danger: "text-red-600",
    warning: "text-amber-600",
    info: "text-blue-600",
  };

  const buttonVariant = variant === "danger" ? "danger" : "secondary";

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange?.(false)}
      title={title}
      subtitle={description}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onOpenChange?.(false)}
            type="button"
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            form={formId}
            size="sm"
            variant={buttonVariant}
          >
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <form id={formId} onSubmit={(e) => { e.preventDefault(); handleConfirm(); }}>
        <div className="space-y-4">
          {description && (
            <div className="flex gap-3">
              <AlertTriangle className={`size-5 flex-shrink-0 ${variantStyles[variant]}`} />
              <p className="text-sm text-[var(--text-secondary)]">{description}</p>
            </div>
          )}
          {children}
        </div>
      </form>
    </Modal>
  );
}
