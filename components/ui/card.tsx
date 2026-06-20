import type { ReactNode } from "react";

export function Card({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-[var(--care-border)] bg-[var(--card-bg)] shadow-sm shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-3 border-b border-[var(--care-border)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}