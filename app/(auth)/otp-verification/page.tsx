import Link from "next/link";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

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
        <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
          OTP Verification
        </h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Enter the 6-digit code sent to your registered email or mobile number.
        </p>
      </div>

      <form className="mt-8 grid gap-5">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]" htmlFor="otp">
            Verification code
          </label>
          <input
            autoComplete="one-time-code"
            className="h-12 rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] px-3 text-center font-mono text-xl tracking-[0.35em] outline-none transition focus:border-[var(--care-primary)] focus:ring-4 focus:ring-[var(--care-accent)]/30 placeholder:text-[var(--input-placeholder)]"
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

        <Button type="submit">Verify OTP</Button>
      </form>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <Button className="font-medium" size="link" variant="ghost">
          Resend code
        </Button>
          <Link
            className="font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            href="/login"
        >
          Back to login
        </Link>
      </div>
    </AuthShell>
  );
}
