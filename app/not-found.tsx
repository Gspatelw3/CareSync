import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--care-surface)] text-[var(--text-primary)] px-6">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--care-primary)]">
          404
        </p>
        <h1 className="mt-3 text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
          The page you are looking for does not exist or has been moved. Please
          check the URL or return to the dashboard.
        </p>
        <div className="mt-8">
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}