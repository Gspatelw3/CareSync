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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
    { label: "Settings", href: "/settings", icon: Settings },
] satisfies {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}[];

export function AppSidebar({ activeHref }: { activeHref: string }) {
    function renderNavigation() {
        return (
            <nav aria-label="Primary navigation" className="grid gap-2">
                {navigationItems.map((item) => {
                    const isActive = item.href === activeHref;
                    const IconComponent = item.icon;

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
            <header className="border-b border-[var(--care-border)] bg-white px-4 py-4 sm:px-6 lg:hidden sticky top-0 z-30">
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
                    </label>
                    <label
                        aria-hidden="true"
                        className="pointer-events-none fixed inset-0 z-20 bg-slate-950/30 opacity-0 transition peer-checked:pointer-events-auto peer-checked:opacity-100"
                        htmlFor="mobile-navigation-toggle"
                    />
                    <aside
                        aria-label="Mobile navigation"
                        className="flex flex-col  fixed inset-y-0 right-0 z-30 w-[min(86vw,340px)] translate-x-full border-l border-[var(--care-border)] bg-white  shadow-2xl shadow-slate-900/20 transition-transform duration-300 ease-out peer-checked:translate-x-0"
                    >
                        <div className="p-5 flex items-center justify-end gap-4 border-b border-[var(--care-border)] pb-4">
                            <label
                                className="flex size-9 cursor-pointer items-center justify-center rounded-md border border-[var(--care-border)] text-slate-600 transition hover:bg-[var(--care-surface)] hover:text-slate-950"
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
                            <a
                                className="flex min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700"
                                href="/login"
                            >
                                <LogOut className="size-5 shrink-0" />
                                Log out
                            </a>
                        </div>
                    </aside>
                </div>
            </header>

            <aside className="hidden h-screen border-r border-[var(--care-border)] lg:flex flex-col bg-white py-5">
                <Link className="block w-fit mx-5" href="/dashboard">
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

                <div className="mt-6 px-5 ">
                    <a
                        className="flex min-w-fit items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-700"
                        href="/login"
                    >
                        <LogOut className="size-5 shrink-0" />
                        Log out
                    </a>
                </div>

                <section className="mt-6 rounded-lg border border-[var(--care-border)] bg-[var(--care-surface)] p-4 mx-5">
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
