import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Recover access without slowing hospital work."
      description="Request a secure verification code for your registered email and return to your clinical workspace quickly."
    >
      <div>
        <p className="text-sm font-medium text-[var(--care-primary)]">
          Authentication
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          Forgot Password
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          We will send a one-time verification code to your email.
        </p>
      </div>

      <form action="/otp-verification" className="mt-8 grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="email">
            Registered email
          </label>
          <input
            autoComplete="email"
            className="h-11 rounded-md border border-[var(--care-border)] px-3 text-sm outline-none transition focus:border-[var(--care-primary)] focus:ring-4 focus:ring-[var(--care-accent)]/30"
            id="email"
            name="email"
            placeholder="name@hospital.com"
            required
            type="email"
          />
        </div>

        <button
          className="h-11 rounded-md bg-[var(--care-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--care-primary-dark)] focus:outline-none focus:ring-4 focus:ring-[var(--care-accent)]/35"
          type="submit"
        >
          Send OTP
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Remembered your password?{" "}
        <Link
          className="font-medium text-[var(--care-primary)] hover:text-[var(--care-primary-dark)]"
          href="/login"
        >
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
