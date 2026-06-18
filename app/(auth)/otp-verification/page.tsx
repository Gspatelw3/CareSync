import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";

export default function OtpVerificationPage() {
  return (
    <AuthShell
      eyebrow="Two-step verification"
      title="Verify the code before entering Care Sync."
      description="OTP verification adds a second check for patient data, billing workflows, pharmacy stock, and operational reports."
    >
      <div>
        <p className="text-sm font-medium text-[var(--care-primary)]">
          Authentication
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-slate-950">
          OTP Verification
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Enter the 6-digit code sent to your registered email or mobile number.
        </p>
      </div>

      <form className="mt-8 grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-800" htmlFor="otp">
            Verification code
          </label>
          <input
            autoComplete="one-time-code"
            className="h-12 rounded-md border border-[var(--care-border)] px-3 text-center font-mono text-xl tracking-[0.35em] outline-none transition focus:border-[var(--care-primary)] focus:ring-4 focus:ring-[var(--care-accent)]/30"
            id="otp"
            inputMode="numeric"
            maxLength={6}
            name="otp"
            pattern="[0-9]{6}"
            placeholder="000000"
            required
            type="text"
          />
        </div>

        <button
          className="h-11 rounded-md bg-[var(--care-primary)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--care-primary-dark)] focus:outline-none focus:ring-4 focus:ring-[var(--care-accent)]/35"
          type="submit"
        >
          Verify OTP
        </button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <button
          className="font-medium text-[var(--care-primary)] hover:text-[var(--care-primary-dark)]"
          type="button"
        >
          Resend code
        </button>
        <Link
          className="font-medium text-slate-600 hover:text-slate-950"
          href="/login"
        >
          Back to login
        </Link>
      </div>
    </AuthShell>
  );
}
