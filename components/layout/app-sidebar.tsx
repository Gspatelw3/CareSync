"use client";

import {
    X,
    Bed,
    Calendar,
    BarChart3,
    UserPlus,
    FlaskConical,
    Home,
    Users,
    Pill,
    Settings,
    Wallet,
    LogOut,
    Moon,
    Sun,
    Bell,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "@/lib/theme-provider";

const navigationItems = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Doctors", href: "/doctors", icon: UserPlus },
    { label: "Patients", href: "/patients", icon: Users },
    { label: "Appointments", href: "/appointments", icon: Calendar },
    { label: "Beds", href: "/inpatient", icon: Bed },
    { label: "Pharmacy", href: "/pharmacy", icon: Pill },
    { label: "Laboratory", href: "/laboratory", icon: FlaskConical },
    { label: "Billing", href: "/billing", icon: Wallet },
    { label: "Reports", href: "/reports", icon: BarChart3 },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
] satisfies {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}[];

export function AppSidebar({ 
  activeHref, 
  onNavigate 
}: { 
  activeHref: string;
  onNavigate?: (href: string) => void;
}) {
    const { theme, toggleTheme, mounted } = useTheme();

    function renderThemeToggle() {
        return (
            <button
                className="flex w-full min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--hover-bg-strong)] hover:text-[var(--text-primary)]"
                onClick={toggleTheme}
                type="button"
                aria-label="Toggle theme"
                title={mounted ? (theme === "dark" ? "Switch to light mode" : "Switch to dark mode") : "Toggle theme"}
            >
                {mounted ? (
                    theme === "dark" ? (
                        <>
                            <Sun className="size-5 shrink-0" aria-hidden="true" />
                            Light mode
                        </>
                    ) : (
                        <>
                            <Moon className="size-5 shrink-0" aria-hidden="true" />
                            Dark mode
                        </>
                    )
                ) : (
                    <>
                        <span className="size-5 shrink-0" aria-hidden="true" />
                        Toggle theme
                    </>
                )}
            </button>
        );
    }

    function renderNavigation() {
        return (
            <nav aria-label="Primary navigation" className="grid gap-2">
                {navigationItems.map((item) => {
                    const isActive = item.href === activeHref;
                    const IconComponent = item.icon;

                    const handleClick = (e: React.MouseEvent) => {
                        if (onNavigate) {
                            e.preventDefault();
                            onNavigate(item.href);
                        }
                    };

                    if (onNavigate) {
                        return (
                            <button
                                type="button"
                                className={[
                                    "flex min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition w-full text-left",
                                    isActive
                                        ? "bg-[var(--care-surface)] text-[var(--text-primary)]"
                                        : "text-[var(--text-secondary)] hover:bg-[var(--care-surface)] hover:text-[var(--text-primary)]",
                                ].join(" ")}
                                key={item.label}
                                onClick={handleClick}
                            >
                                <IconComponent className="size-5 shrink-0" />
                                {item.label}
                            </button>
                        );
                    }

                    return (
                        <Link
                            className={[
                                "flex min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition",
                                isActive
                                    ? "bg-[var(--care-surface)] text-[var(--text-primary)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--care-surface)] hover:text-[var(--text-primary)]",
                            ].join(" ")}
                            href={item.href}
                            key={item.label}
                        >
                            <IconComponent className="size-5 shrink-0" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        );
    }

    return (
        <>
            <header className="border-b border-[var(--care-border)] bg-[var(--card-bg)] px-4 py-4 sm:px-6 lg:hidden sticky top-0 z-30">
                <div className="flex items-center justify-between gap-4">
                    <Link className="block w-fit text-[var(--text-primary)]" href="/dashboard">
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
                        className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-[var(--care-border)] bg-[var(--card-bg)] px-3 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--care-surface)]"
                        htmlFor="mobile-navigation-toggle"
                    >
                        <span className="grid gap-1">
                            <span className="h-0.5 w-4 rounded-full bg-current" />
                            <span className="h-0.5 w-4 rounded-full bg-current" />
                            <span className="h-0.5 w-4 rounded-full bg-current" />
                        </span>
                    </label>
                    <label
                        aria-hidden="true"
                        className="pointer-events-none fixed inset-0 z-20 bg-[var(--overlay-bg)] opacity-0 transition peer-checked:pointer-events-auto peer-checked:opacity-100"
                        htmlFor="mobile-navigation-toggle"
                    />
                    <aside
                        aria-label="Mobile navigation"
                        className="flex flex-col  fixed inset-y-0 right-0 z-30 w-[min(86vw,340px)] translate-x-full border-l border-[var(--care-border)] bg-[var(--card-bg)]  shadow-2xl shadow-[var(--shadow-sidebar)] transition-transform duration-300 ease-out peer-checked:translate-x-0"
                    >
                        <div className="p-5 flex items-center justify-end gap-4 border-b border-[var(--care-border)] pb-4">
                            <label
                                className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-[var(--care-border)] text-[var(--text-secondary)] transition hover:bg-[var(--care-surface)] hover:text-[var(--text-primary)]"
                                htmlFor="mobile-navigation-toggle"
                            >
                                <span className="sr-only">Close menu</span>
                                <span
                                    aria-hidden="true"
                                    className="text-xl leading-none"
                                >
                                    <X size={20} />
                                </span>
                            </label>
                        </div>
                        <div className="flex-auto overflow-y-auto p-4">
                            {renderNavigation()}
                            {renderThemeToggle()}
                            <a
                                className="flex min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--badge-danger-bg)] hover:text-[var(--badge-danger-text)]"
                                href="/login"
                            >
                                <LogOut className="size-5 shrink-0" />
                                Log out
                            </a>
                        </div>
                    </aside>
                </div>
            </header>

            <aside className="hidden h-screen border-r border-[var(--care-border)] lg:flex flex-col bg-[var(--sidebar-bg)] py-5">
                <Link className="block w-fit mx-5 text-[var(--text-primary)]" href="/dashboard">
                    <Image
                        alt="Care Sync"
                        className="h-auto"
                        height={42}
                        priority
                        src="/caresync.svg"
                        width={180}
                    />
                </Link>

                <div className="mt-6 flex-auto overflow-y-auto px-5">
                    {renderNavigation()}
                </div>

                <div className="mt-6 space-y-1 px-5">
                    {renderThemeToggle()}
                    <a
                        className="flex min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--badge-danger-bg)] hover:text-[var(--badge-danger-text)]"
                        href="/login"
                    >
                        <LogOut className="size-5 shrink-0" />
                        Log out
                    </a>
                </div>

                <section className="mt-6 rounded-lg border border-[var(--care-border)] bg-[var(--care-surface)] p-4 mx-5">
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                        Bed utilization
                    </p>
                    <div className="mt-4 h-2 rounded-full bg-[var(--card-bg)]">
                        <div className="h-2 w-[77%] rounded-full bg-[var(--care-mint)]" />
                    </div>
                    <p className="mt-3 text-xs leading-5 text-[var(--text-muted)]">
                        58 beds open across ICU, emergency, and general wards.
                    </p>
                </section>
            </aside>
        </>
    );
}
