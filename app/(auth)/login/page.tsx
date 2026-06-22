"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  function validate() {
    const next: { email?: string; password?: string } = {};

    if (!email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      next.email = "Enter a valid email address.";
    }

    if (!password) {
      next.password = "Password is required.";
    } else if (password.length < 6) {
      next.password = "Password must be at least 6 characters.";
    }

    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    router.push("/dashboard");
  }

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
        <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">Login</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          Enter your hospital account details to continue.
        </p>
      </div>

      <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
        <div className="grid gap-2">
          <label className="text-sm font-medium text-[var(--text-secondary)]" htmlFor="email">
            Email address
          </label>
          <input
            autoComplete="email"
            className="h-11 rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] px-3 text-sm outline-none transition focus:border-[var(--care-primary)] focus:ring-4 focus:ring-[var(--care-accent)]/30 placeholder:text-[var(--input-placeholder)]"
            id="email"
            name="email"
            placeholder="admin@caresync.com"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <p className="text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        <div className="grid gap-2">
          <div className="flex items-center justify-between gap-4">
              <label
                className="text-sm font-medium text-[var(--text-secondary)]"
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
            className="h-11 rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] px-3 text-sm outline-none transition focus:border-[var(--care-primary)] focus:ring-4 focus:ring-[var(--care-accent)]/30 placeholder:text-[var(--input-placeholder)]"
            id="password"
            name="password"
            placeholder="Enter password"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <p className="text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        <Button type="submit">Login</Button>
      </form>
    </AuthShell>
  );
}
