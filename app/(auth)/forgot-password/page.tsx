import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

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
        <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
          Forgot Password
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          We will send a one-time verification code to your email.
        </p>
      </div>

      <form action="/otp-verification" className="mt-8 grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]" htmlFor="email">
            Registered email
          </label>
          <input
            autoComplete="email"
            className="h-10 rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] px-3 text-sm outline-none transition focus:border-[var(--care-primary)] focus:ring-2 focus:ring-[var(--care-primary)]/20 placeholder:text-[var(--input-placeholder)]"
            id="email"
            name="email"
            placeholder="name@hospital.com"
            required
            type="email"
          />
        </div>

        <Button type="submit">Send OTP</Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
        Remembered your password?{" "}
          <Link
            className="font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            href="/login"
        >
          Back to login
        </Link>
      </p>
    </AuthShell>
  );
}
