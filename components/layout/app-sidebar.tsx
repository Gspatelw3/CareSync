import Image from "next/image";
import Link from "next/link";

type IconName =
  | "bed"
  | "calendar"
  | "chart"
  | "doctor"
  | "flask"
  | "home"
  | "patient"
  | "pill"
  | "settings"
  | "wallet";

const iconPaths: Record<IconName, string[]> = {
  bed: ["M4 7v10", "M4 13h16v4", "M7 10h4", "M14 10h3a3 3 0 0 1 3 3"],
  calendar: [
    "M7 3v4",
    "M17 3v4",
    "M4 8h16",
    "M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2",
  ],
  chart: ["M4 19V5", "M4 19h16", "M8 16v-5", "M12 16V8", "M16 16v-8"],
  doctor: [
    "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
    "M5 21a7 7 0 0 1 14 0",
    "M16 18h4",
    "M18 16v4",
  ],
  flask: ["M10 3h4", "M11 3v5l-5 9a3 3 0 0 0 3 4h6a3 3 0 0 0 3-4l-5-9V3", "M8 16h8"],
  home: ["M4 11 12 4l8 7", "M6 10v10h12V10", "M10 20v-6h4v6"],
  patient: ["M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8", "M4 21a8 8 0 0 1 16 0"],
  pill: ["M10 21 21 10a4.2 4.2 0 0 0-6-6L4 15a4.2 4.2 0 0 0 6 6", "M8 12l4 4"],
  settings: [
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6",
    "M19 12a7.2 7.2 0 0 0-.1-1l2-1.5-2-3.5-2.4 1a7.8 7.8 0 0 0-1.8-1L14.4 3h-4.8l-.3 3a7.8 7.8 0 0 0-1.8 1l-2.4-1-2 3.5 2 1.5a7.2 7.2 0 0 0 0 2l-2 1.5 2 3.5 2.4-1a7.8 7.8 0 0 0 1.8 1l.3 3h4.8l.3-3a7.8 7.8 0 0 0 1.8-1l2.4 1 2-3.5-2-1.5c.1-.3.1-.7.1-1",
  ],
  wallet: ["M4 7h16v12H4z", "M4 7l3-4h10l3 4", "M15 13h5"],
};

const navigationItems = [
  { label: "Dashboard", href: "/dashboard", icon: "home" },
  { label: "Doctors", href: "/doctors", icon: "doctor" },
  { label: "Patients", href: "/patients", icon: "patient" },
  { label: "Appointments", href: "/appointments", icon: "calendar" },
  { label: "Beds", href: "/inpatient", icon: "bed" },
  { label: "Pharmacy", href: "/pharmacy", icon: "pill" },
  { label: "Laboratory", href: "/laboratory", icon: "flask" },
  { label: "Billing", href: "/billing", icon: "wallet" },
  { label: "Reports", href: "/reports", icon: "chart" },
  { label: "Settings", href: "/settings", icon: "settings" },
] satisfies { label: string; href: string; icon: IconName }[];

function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {iconPaths[name].map((path) => (
        <path d={path} key={path} />
      ))}
    </svg>
  );
}

export function AppSidebar({ activeHref }: { activeHref: string }) {
  function renderNavigation() {
    return (
      <nav aria-label="Primary navigation" className="grid gap-2">
        {navigationItems.map((item) => {
          const isActive = item.href === activeHref;

          return (
            <Link
              className={[
                "flex min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-[var(--care-surface)] text-slate-950"
                  : "text-slate-600 hover:bg-[var(--care-surface)] hover:text-slate-950",
              ].join(" ")}
              href={item.href}
              key={item.label}
            >
              <Icon className="size-5 shrink-0" name={item.icon} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      <header className="border-b border-[var(--care-border)] bg-white px-4 py-4 sm:px-6 lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <Link className="block w-fit" href="/dashboard">
            <Image
              alt="Care Sync"
              className="h-auto"
              height={40}
              priority
              src="/caresync.svg"
              width={160}
            />
          </Link>
          <input
            className="peer sr-only"
            id="mobile-navigation-toggle"
            type="checkbox"
          />
          <label
            className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[var(--care-border)] bg-white px-3 text-sm font-semibold text-slate-700 transition hover:bg-[var(--care-surface)]"
            htmlFor="mobile-navigation-toggle"
          >
            <span className="grid gap-1">
              <span className="h-0.5 w-4 rounded-full bg-current" />
              <span className="h-0.5 w-4 rounded-full bg-current" />
              <span className="h-0.5 w-4 rounded-full bg-current" />
            </span>
            Menu
          </label>
          <label
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-20 bg-slate-950/30 opacity-0 transition peer-checked:pointer-events-auto peer-checked:opacity-100"
            htmlFor="mobile-navigation-toggle"
          />
          <aside
            aria-label="Mobile navigation"
            className="fixed inset-y-0 right-0 z-30 w-[min(86vw,340px)] translate-x-full border-l border-[var(--care-border)] bg-white p-4 shadow-2xl shadow-slate-900/20 transition-transform duration-300 ease-out peer-checked:translate-x-0"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[var(--care-border)] pb-4">
              <p className="text-sm font-semibold text-slate-950">Menu</p>
              <label
                className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-[var(--care-border)] text-slate-600 transition hover:bg-[var(--care-surface)] hover:text-slate-950"
                htmlFor="mobile-navigation-toggle"
              >
                <span className="sr-only">Close menu</span>
                <span aria-hidden="true" className="text-xl leading-none">
                  x
                </span>
              </label>
            </div>
            <div className="mt-4">
              {renderNavigation()}
            </div>
          </aside>
        </div>
      </header>

      <aside className="hidden border-r border-[var(--care-border)] bg-white px-5 py-5 lg:block">
        <Link className="block w-fit" href="/dashboard">
          <Image
            alt="Care Sync"
            className="h-auto"
            height={42}
            priority
            src="/caresync.svg"
            width={180}
          />
        </Link>

        <div className="mt-6">{renderNavigation()}</div>

        <section className="mt-6 rounded-lg border border-[var(--care-border)] bg-[var(--care-surface)] p-4">
          <p className="text-sm font-semibold text-slate-950">
            Bed utilization
          </p>
          <div className="mt-4 h-2 rounded-full bg-white">
            <div className="h-2 w-[77%] rounded-full bg-[var(--care-mint)]" />
          </div>
          <p className="mt-3 text-xs leading-5 text-slate-600">
            58 beds open across ICU, emergency, and general wards.
          </p>
        </section>
      </aside>
    </>
  );
}
