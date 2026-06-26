import { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";

type PageShellProps = {
    activeHref: string;
    children: ReactNode;
    onNavigate?: (href: string) => void;
};

export function PageShell({ activeHref, children, onNavigate }: PageShellProps) {
    return (
        <main className="min-h-screen bg-[var(--care-surface)] text-[var(--text-primary)]">
            <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
                <AppSidebar activeHref={activeHref} onNavigate={onNavigate} />
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

export function PageHeader({
    eyebrow,
    title,
    description,
    actions,
}: PageHeaderProps) {
    return (
        <header className="flex flex-col gap-4 border-b border-[var(--care-border)] pb-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--care-primary)]">
                    {eyebrow}
                </p>
                <h1 className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
                    {title}
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-secondary)]">
                    {description}
                </p>
            </div>
      {actions && (
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:w-auto w-full">
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
    icon?: ReactNode;
    href?: string;
}) {
    const Wrapper = href ? "a" : "div";
    return (
        <Wrapper
            className="rounded-lg border border-[var(--care-border)] bg-[var(--card-bg)] p-4 shadow-sm shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:shadow-md"
            href={href}
        >
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-[var(--text-primary)]">
                        {value}
                    </p>
                </div>
                {icon && (
                    <span className="flex size-10 items-center justify-center rounded-md bg-[var(--care-surface)] text-[var(--care-primary)]">
                        {icon}
                    </span>
                )}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <span className="font-semibold text-[var(--care-secondary)]">
                    {delta}
                </span>
                <span className="text-[var(--text-muted)]">{detail}</span>
            </div>
        </Wrapper>
    );
}
