import type { ReactNode } from "react";

export type StatusBadgeVariant = "default" | "warning" | "danger" | "info" | "success";

export function StatusBadge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: StatusBadgeVariant;
}) {
  const styles: Record<StatusBadgeVariant, string> = {
    default:
      "bg-[var(--badge-default-bg)] text-[var(--badge-default-text)] ring-1 ring-[var(--badge-default-ring)]",
    warning: "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)] ring-1 ring-[var(--badge-warning-ring)]",
    danger: "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)] ring-1 ring-[var(--badge-danger-ring)]",
    info: "bg-[var(--badge-info-bg)] text-[var(--badge-info-text)] ring-1 ring-[var(--badge-info-ring)]",
    success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:ring-emerald-800",
  };

  return (
    <span
      className={[
        "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        styles[variant] || styles.default,
      ].join(" ")}
    >
      {children}
    </span>
  );
}