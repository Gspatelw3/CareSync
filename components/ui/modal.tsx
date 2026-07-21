"use client";

import { type KeyboardEvent, type ReactNode, useEffect, useCallback, useId, useRef } from "react";
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const subtitleId = useId();

  const handleKeyDown = useCallback(
    (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    const previouslyFocusedElement = document.activeElement;

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";

      requestAnimationFrame(() => {
        const firstFocusable = dialogRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      });
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [open, handleKeyDown]);

  const handleDialogKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;

    const focusableElements = Array.from(
      dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      ) ?? []
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[5vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[var(--overlay-bg)] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal panel */}
      <div
        ref={dialogRef}
        aria-describedby={subtitle ? subtitleId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className="relative z-10 mx-4 flex w-full max-w-4xl flex-col rounded-xl border border-[var(--border-default)] bg-[var(--card-bg)] shadow-2xl"
        onKeyDown={handleDialogKeyDown}
        role="dialog"
      >
        {/* Header — sticky at top */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--border-light)] px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold text-[var(--text-primary)]" id={titleId}>{title}</h2>
            {subtitle && (
              <p className="mt-1 text-sm text-[var(--text-secondary)]" id={subtitleId}>{subtitle}</p>
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
