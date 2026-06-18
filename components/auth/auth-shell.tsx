import type { ReactNode } from "react";
import Image from "next/image";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

const trustSignals = [
  "Role-aware access for clinical teams",
  "OTP verification for sensitive workflows",
  "Built for patient and hospital operations",
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
}: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[var(--care-surface)] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="auth-panel flex flex-col justify-between px-6 py-8 text-white sm:px-10 lg:px-12">
          <div className="auth-logo-mark w-fit">
            <Image
              alt="Care Sync"
              height={48}
              priority
              src="/caresync.svg"
              width={162}
            />
          </div>

          <div className="my-14 max-w-xl lg:my-0">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[var(--care-accent)]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[var(--care-panel-text)]">
              {description}
            </p>
          </div>

          <div className="grid gap-3 text-sm text-[var(--care-soft-text)]">
            {trustSignals.map((item) => (
              <div
                className="flex items-center gap-3 rounded-lg border border-[color:var(--care-mint)]/25 bg-white/5 px-4 py-3 transition duration-300 hover:border-[color:var(--care-accent)]/50 hover:bg-white/10"
                key={item}
              >
                <span className="size-2 rounded-full bg-[var(--care-mint)]" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="auth-card w-full max-w-md rounded-lg border border-[var(--care-border)] bg-white p-6 shadow-sm shadow-[var(--care-primary)]/10 sm:p-8">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
