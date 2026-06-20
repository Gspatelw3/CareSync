"use client";

import { type ReactNode, useEffect, useCallback } from "react";
import { X } from "lucide-react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function Modal({ open, onClose, title, subtitle, children, footer }: ModalProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--overlay-bg)] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div className="relative z-10 mx-4 flex w-full max-w-4xl flex-col rounded-xl border border-[var(--border-default)] bg-[var(--card-bg)] shadow-2xl">
        {/* Header — sticky at top */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-light)] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{subtitle}</p>
            )}
          </div>
          <button
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-[var(--text-muted-light)] transition hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-secondary)]"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="max-h-[55vh] overflow-y-auto px-6 py-5">
          {children}
        </div>

        {/* Footer — sticky at bottom */}
        {footer && (
          <div className="border-t border-[var(--border-light)] px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}