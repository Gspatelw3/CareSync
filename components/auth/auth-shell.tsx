"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useTheme } from "@/lib/theme-provider";

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
  const { theme, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen bg-[var(--care-surface)] text-[var(--text-primary)]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="auth-panel flex flex-col justify-between px-6 py-8 text-white sm:px-10 lg:px-12">
          <div className="auth-logo-mark w-fit">
            <Image
              alt="Care Sync"
              height={48}
              priority
              src="/caresync-light.svg"
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
          <div className="auth-card relative w-full max-w-md rounded-lg border border-[var(--care-border)] bg-[var(--card-bg)] p-6 shadow-sm shadow-[var(--care-primary)]/10 sm:p-8">
            <button
              aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--hover-bg)] text-[var(--text-muted)] transition hover:border-[var(--care-primary)] hover:text-[var(--care-primary)]"
              onClick={toggleTheme}
              type="button"
            >
              {theme === "light" ? (
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg
                  className="size-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
