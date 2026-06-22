// ── Care Sync Application Configuration ──
// Central configuration file. Buyers can customize branding, navigation,
// and other application settings by editing values here.

// ── Branding ──
export const BRAND = {
  name: "Care Sync",
  tagline: "Hospital and clinic management platform",
  hospitalName: "Care Sync Medical Centre",
  registrationNo: "HSM-42-1987-06",
  address: "42 Health Avenue, Medical District",
  phone: "+91 1800 420 4242",
  email: "contact@caresync.health",
  licenseType: "Multi-specialty (Level 3)",
} as const;

// ── Navigation ──
// Reorder, add, or remove items to customize the sidebar navigation.
export const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "Home" },
  { label: "Doctors", href: "/doctors", icon: "UserPlus" },
  { label: "Patients", href: "/patients", icon: "Users" },
  { label: "Appointments", href: "/appointments", icon: "Calendar" },
  { label: "Beds", href: "/inpatient", icon: "Bed" },
  { label: "Pharmacy", href: "/pharmacy", icon: "Pill" },
  { label: "Laboratory", href: "/laboratory", icon: "FlaskConical" },
  { label: "Billing", href: "/billing", icon: "Wallet" },
  { label: "Reports", href: "/reports", icon: "BarChart3" },
  { label: "Settings", href: "/settings", icon: "Settings" },
] as const;

// ── Feature Flags ──
export const FEATURES = {
  enableDarkMode: true,
  enableNotifications: true,
  enableToasts: true,
} as const;

// ── Theme ──
export const THEME = {
  storageKey: "care-sync-theme",
  default: "light" as const,
} as const;

// ── Toast ──
export const TOAST = {
  durationMs: 3000,
} as const;

// ── Logo ──
export const LOGO = {
  src: "/caresync.svg",
  alt: "Care Sync",
  width: 180,
  height: 42,
  mobileWidth: 160,
  mobileHeight: 40,
  authWidth: 162,
  authHeight: 48,
} as const;