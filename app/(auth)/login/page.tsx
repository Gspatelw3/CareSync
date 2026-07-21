"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/lib/stores";
import { useToast } from "@/lib/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useAuthStore();
  const { addToast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    setIsLoading(true);

    try {
      const success = await login(email, password, rememberMe);
      
      if (success) {
        addToast("Login successful! Welcome back.", "success");
        router.push("/dashboard");
      } else {
        addToast("Invalid credentials. Please try again.", "error");
      }
    } catch (error) {
      addToast("An error occurred during login.", "error");
    } finally {
      setIsLoading(false);
    }
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
            className="h-10 rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] px-3 text-sm placeholder:text-[var(--input-placeholder)] outline-none transition focus:border-[var(--care-primary)] focus:ring-2 focus:ring-[var(--care-primary)]/20"
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
            className="h-10 rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--input-text)] px-3 text-sm outline-none transition focus:border-[var(--care-primary)] focus:ring-2 focus:ring-[var(--care-primary)]/20 placeholder:text-[var(--input-placeholder)]"
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-4 rounded border-[var(--border-default)]"
            />
            <label htmlFor="remember" className="text-sm text-[var(--text-secondary)]">
              Remember me
            </label>
          </div>

          <Button type="submit" isLoading={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
      </form>
    </AuthShell>
  );
}
