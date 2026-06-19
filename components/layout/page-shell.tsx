import { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";

type PageShellProps = {
  activeHref: string;
  children: ReactNode;
};

export function PageShell({ activeHref, children }: PageShellProps) {
  return (
    <main className="min-h-screen bg-[var(--care-surface)] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AppSidebar activeHref={activeHref} />
        <section className="px-4 py-5 sm:px-6 lg:px-8 lg:h-screen overflow-y-auto">
          {children}
        </section>
      </div>
    </main>
  );
}

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b border-[var(--care-border)] pb-5 xl:flex-row xl:items-center xl:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--care-primary)]">
          {eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-950">
          {title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
      {actions && (
        <div className="grid gap-2 sm:flex sm:items-center">
          {actions}
        </div>
      )}
    </header>
  );
}

export function StatCard({
  label,
  value,
  delta,
  detail,
  icon,
  href,
}: {
  label: string;
  value: string;
  delta: string;
  detail: string;
  icon: ReactNode;
  href?: string;
}) {
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper
      className="rounded-lg border border-[var(--care-border)] bg-white p-4 shadow-sm shadow-[var(--care-primary)]/5 transition hover:-translate-y-0.5 hover:shadow-md"
      href={href}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-600">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-md bg-[var(--care-surface)] text-[var(--care-primary)]">
          {icon}
        </span>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-semibold text-[var(--care-secondary)]">{delta}</span>
        <span className="text-slate-500">{detail}</span>
      </div>
    </Wrapper>
  );
}

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
    <section className="rounded-lg border border-[var(--care-border)] bg-white shadow-sm shadow-[var(--care-primary)]/5">
      <div className="flex flex-col gap-3 border-b border-[var(--care-border)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function StatusBadge({ children, variant = "default" }: { children: string; variant?: "default" | "warning" | "danger" | "info" }) {
  const styles: Record<string, string> = {
    default: "bg-[color:var(--care-mint)]/20 text-[var(--care-secondary-dark)] ring-1 ring-[color:var(--care-mint)]/60",
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

export function Table({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap">
        <thead className="bg-[var(--care-surface)] text-xs uppercase tracking-[0.12em] text-slate-500">
          <tr>
            {headers.map((header) => (
              <th className="px-5 py-3 font-semibold" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}

export function SvgIcon({ paths, className }: { paths: string[]; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {paths.map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}