import Link from "next/link";
import { AppSidebar } from "@/components/layout/app-sidebar";

type PlaceholderPageProps = {
  activeHref: string;
  title: string;
  eyebrow: string;
  description: string;
  primaryAction: string;
};

export function PlaceholderPage({
  activeHref,
  title,
  eyebrow,
  description,
  primaryAction,
}: PlaceholderPageProps) {
  return (
    <main className="min-h-screen bg-[var(--care-surface)] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <AppSidebar activeHref={activeHref} />

        <section className="flex min-h-[calc(100vh-96px)] items-center px-4 py-8 sm:px-6 lg:min-h-screen lg:px-8">
          <div className="w-full max-w-5xl rounded-lg border border-[var(--care-border)] bg-white p-6 shadow-sm shadow-[var(--care-primary)]/10 sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--care-primary)]">
              {eyebrow}
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              {description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                className="care-brand-gradient inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold text-white transition hover:brightness-95"
                href="/dashboard"
              >
                Back to dashboard
              </Link>
              <button
                className="inline-flex h-10 cursor-not-allowed items-center justify-center rounded-md border border-[var(--care-border)] bg-white px-4 text-sm font-semibold text-slate-400"
                disabled
                type="button"
              >
                {primaryAction}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
