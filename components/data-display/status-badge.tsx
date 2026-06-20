import type { ReactNode } from "react";

export type StatusBadgeVariant = "default" | "warning" | "danger" | "info";

export function StatusBadge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: StatusBadgeVariant;
}) {
  const styles: Record<StatusBadgeVariant, string> = {
    default:
      "bg-[color:var(--care-mint)]/20 text-[var(--care-secondary-dark)] ring-1 ring-[color:var(--care-mint)]/60",
    warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    danger: "bg-red-50 text-red-700 ring-1 ring-red-200",
    info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  };

  return (
    <span
      className={[
        "inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold",
        styles[variant] || styles.default,
      ].join(" ")}
    >
      {children}
    </span>
  );
}