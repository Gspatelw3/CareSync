import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export default function LoginPage() {
  return (
    <AuthShell
      eyebrow="Secure login"
      title="Sign in to coordinate care with confidence."
      description="Access dashboards, appointments, patient records, pharmacy alerts, billing, and clinical operations from one protected workspace."
    >
      <div>
        <p className="text-sm font-medium text-[var(--care-primary)]">
          Authentication
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">Login</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter your hospital account details to continue.
        </p>
      </div>

      <form action="/otp-verification" className="mt-8 grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="email">
            Email address
          </label>
          <input
            autoComplete="email"
            className="h-11 rounded-md border border-[var(--care-border)] px-3 text-sm outline-none transition focus:border-[var(--care-primary)] focus:ring-4 focus:ring-[var(--care-accent)]/30"
            id="email"
            name="email"
            placeholder="admin@caresync.com"
            required
            type="email"
          />
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-4">
            <label
              className="text-sm font-medium text-slate-800"
              htmlFor="password"
            >
              Password
            </label>
            <Link
              className="text-sm font-medium text-[var(--care-primary)] hover:text-[var(--care-primary-dark)]"
              href="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <input
            autoComplete="current-password"
            className="h-11 rounded-md border border-[var(--care-border)] px-3 text-sm outline-none transition focus:border-[var(--care-primary)] focus:ring-4 focus:ring-[var(--care-accent)]/30"
            id="password"
            name="password"
            placeholder="Enter password"
            required
            type="password"
          />
        </div>

        <button
          className="h-11 rounded-md bg-[var(--care-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--care-primary-dark)] focus:outline-none focus:ring-4 focus:ring-[var(--care-accent)]/35"
          type="submit"
        >
          Continue
        </button>
      </form>
    </AuthShell>
  );
}
