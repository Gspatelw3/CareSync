"use client";

import { type ReactNode } from "react";
import { useToast } from "@/lib/use-toast";

type ActionButtonProps = {
  children: ReactNode;
  message: string;
  type?: "success" | "info" | "warning";
  className?: string;
  icon?: ReactNode;
};

export function ActionButton({ children, message, type = "success", className = "care-brand-gradient", icon }: ActionButtonProps) {
  const { addToast } = useToast();
  return (
    <button
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-white transition hover:brightness-95 cursor-pointer ${className}`}
      onClick={() => addToast(message, type)}
      type="button"
    >
      {icon}
      {children}
    </button>
  );
}

type SecondaryButtonProps = {
  children: ReactNode;
  message: string;
  icon?: ReactNode;
};

export function SecondaryButton({ children, message, icon }: SecondaryButtonProps) {
  const { addToast } = useToast();
  return (
    <button
      className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[var(--care-border)] bg-white px-3 text-sm font-semibold text-[var(--care-primary)] transition hover:bg-[var(--care-surface)] cursor-pointer"
      onClick={() => addToast(message, "info")}
      type="button"
    >
      {icon}
      {children}
    </button>
  );
}

type ToastLinkProps = {
  children: ReactNode;
  message: string;
};

export function ToastLink({ children, message }: ToastLinkProps) {
  const { addToast } = useToast();
  return (
    <button
      className="text-sm font-semibold text-[var(--care-primary)] hover:text-[var(--care-primary-dark)] cursor-pointer"
      onClick={() => addToast(message, "info")}
      type="button"
    >
      {children}
    </button>
  );
}