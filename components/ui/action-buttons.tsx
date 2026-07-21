"use client";

import { type ReactNode } from "react";
import { useToast } from "@/lib/use-toast";
import { Button } from "@/components/ui/button";

type ActionButtonProps = {
  children: ReactNode;
  message?: string;
  type?: "success" | "info" | "warning";
  className?: string;
  icon?: ReactNode;
  onClick?: () => void;
};

export function ActionButton({ children, message, type = "success", className, icon, onClick }: ActionButtonProps) {
  const { addToast } = useToast();
  return (
    <Button
      className={`w-full sm:w-auto ${className ?? ""}`}
      size="sm"
      onClick={onClick || (message ? () => addToast(message, type) : undefined)}
    >
      {icon}
      {children}
    </Button>
  );
}

type SecondaryButtonProps = {
  children: ReactNode;
  message?: string;
  icon?: ReactNode;
  className?: string;
  onClick?: () => void;
};

export function SecondaryButton({ children, message, icon, className, onClick }: SecondaryButtonProps) {
  const { addToast } = useToast();
  return (
    <Button
      variant="secondary"
      className={`w-full sm:w-auto ${className ?? ""}`}
      size="sm"
      onClick={onClick || (message ? () => addToast(message, "info") : undefined)}
    >
      {icon}
      {children}
    </Button>
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
      className="text-sm font-semibold text-[var(--care-primary)] hover:text-[var(--care-primary-dark)] cursor-pointer focus:outline-none focus-visible:underline"
      onClick={() => addToast(message, "info")}
      type="button"
    >
      {children}
    </button>
  );
}
