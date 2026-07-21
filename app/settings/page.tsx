"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock,
  Camera,
  Globe2,
  KeyRound,
  Languages,
  Mail,
  Monitor,
  Pencil,
  Phone,
  ShieldCheck,
  UserCircle,
} from "lucide-react";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/data-display/status-badge";
import { useAuthStore } from "@/lib/stores";
import { useTheme } from "@/lib/theme-provider";

const APP_VERSION = "0.1.0";
const PROFILE_PREFERENCES_KEY = "care-sync-profile-preferences";

type AccountPreferences = {
  language: string;
  timeZone: string;
};

const languageOptions = [
  { label: "English", value: "en" },
  { label: "Hindi", value: "hi" },
];

const timeZoneOptions = [
  { label: "Asia/Kolkata (IST)", value: "Asia/Kolkata" },
  { label: "America/New_York (EST)", value: "America/New_York" },
  { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles" },
  { label: "Europe/London (GMT)", value: "Europe/London" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getDefaultPreferences(): AccountPreferences {
  const resolvedTimeZone =
    typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : undefined;
  const timeZone =
    resolvedTimeZone &&
    timeZoneOptions.some((option) => option.value === resolvedTimeZone)
      ? resolvedTimeZone
      : "Asia/Kolkata";

  return {
    language: "en",
    timeZone,
  };
}

function loadPreferences(): AccountPreferences {
  if (typeof window === "undefined") return getDefaultPreferences();

  const stored = window.localStorage.getItem(PROFILE_PREFERENCES_KEY);
  if (!stored) return getDefaultPreferences();

  try {
    return { ...getDefaultPreferences(), ...JSON.parse(stored) };
  } catch {
    return getDefaultPreferences();
  }
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 rounded-md border border-[var(--border-default)] bg-[var(--care-surface)] p-4">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-[var(--card-bg)] text-[var(--care-primary)]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
          {label}
        </p>
        <div className="mt-1 text-sm font-medium text-[var(--text-primary)]">
          {value}
        </div>
      </div>
    </div>
  );
}

function PreferenceSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
        htmlFor={id}
      >
        {label}
      </label>
      <select
        id={id}
        className="h-10 w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--care-primary)] focus:ring-2 focus:ring-[var(--care-primary)]/20"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function EditableField({
  icon,
  label,
  value,
  onSave,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(value);
    setEditing(false);
  };

  return (
    <div className="flex items-start gap-3 rounded-md border border-[var(--border-default)] bg-[var(--care-surface)] p-4">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-[var(--card-bg)] text-[var(--care-primary)]">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
          {label}
        </p>
        {editing ? (
          <div className="mt-1 flex flex-col gap-2">
            <input
              className="h-9 w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 text-sm text-[var(--input-text)] outline-none transition focus:border-[var(--care-primary)] focus:ring-2 focus:ring-[var(--care-primary)]/20"
              value={draft}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setDraft(e.target.value)}
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") handleCancel();
              }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="inline-flex h-7 items-center justify-center rounded bg-[var(--care-primary)] px-2.5 text-xs font-medium text-white transition hover:opacity-90"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                type="button"
                className="inline-flex h-7 items-center justify-center rounded border border-[var(--border-default)] bg-[var(--card-bg)] px-2.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--care-surface)]"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="group mt-1 flex items-center gap-2">
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {value}
            </span>
            <button
              type="button"
              className="inline-flex size-6 items-center justify-center rounded text-[var(--text-muted)] opacity-0 transition hover:bg-[var(--card-bg)] hover:text-[var(--care-primary)] group-hover:opacity-100"
              onClick={() => setEditing(true)}
              title={`Edit ${label}`}
            >
              <Pencil className="size-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const { mounted, preference, setThemePreference } = useTheme();
  const [preferences, setPreferences] = useState<AccountPreferences>(
    getDefaultPreferences,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    setPreferences(loadPreferences());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      PROFILE_PREFERENCES_KEY,
      JSON.stringify(preferences),
    );
  }, [preferences]);

  const [savedPhone, setSavedPhone] = useState<string>("+91 1800 420 4242");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("care-sync-profile-phone");
    if (stored) setSavedPhone(stored);
  }, []);

  const profile = useMemo(
    () => ({
      fullName: user?.name ?? "Care Sync Admin",
      email: user?.email ?? "admin@caresync.com",
      phone: savedPhone,
      role: user?.role
        ? user.role[0].toUpperCase() + user.role.slice(1)
        : "Admin",
      department: user?.department ?? "Administration",
      employeeId: user?.id ?? "USR-001",
      lastLogin: "Current session",
      accountStatus: "Active",
      memberSince: "June 2026",
    }),
    [user],
  );

  const initials = getInitials(profile.fullName);

  const handleAvatarUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <PageShell activeHref="/settings">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="View your account details, security status, and personal preferences."
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(360px,0.9fr)]">
        <Card
          title="Profile Information"
          description="Personal details for the currently signed-in user."
        >
          <div className="space-y-6 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative group shrink-0">
                <div
                  aria-label={`${profile.fullName} profile avatar`}
                  className="flex size-20 items-center justify-center rounded-full care-brand-gradient text-2xl font-semibold text-white shadow-sm overflow-hidden"
                >
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt={profile.fullName}
                      className="size-full object-cover"
                    />
                  ) : (
                    initials || <UserCircle className="size-10" />
                  )}
                </div>
                <button
                  type="button"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  title="Change photo"
                >
                  <Camera className="size-6 text-white" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                  {profile.fullName}
                </h2>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                  {profile.role} · {profile.department}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <EditableField
                icon={<UserCircle className="size-4" />}
                label="Full Name"
                value={profile.fullName}
                onSave={(name) => updateUser({ name })}
              />
              <EditableField
                icon={<Mail className="size-4" />}
                label="Email"
                value={profile.email}
                onSave={(email) => updateUser({ email })}
              />
              <EditableField
                icon={<Phone className="size-4" />}
                label="Phone"
                value={profile.phone}
                onSave={(phone) => {
                  if (typeof window !== "undefined") {
                    window.localStorage.setItem("care-sync-profile-phone", phone);
                  }
                  setSavedPhone(phone);
                }}
              />
              <DetailItem
                icon={<ShieldCheck className="size-4" />}
                label="Role"
                value={profile.role}
              />
              <DetailItem
                icon={<Building2 className="size-4" />}
                label="Department"
                value={profile.department}
              />
              <DetailItem
                icon={<BadgeCheck className="size-4" />}
                label="Employee ID"
                value={profile.employeeId}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-6">
          <Card
            title="Preferences"
            description="These preferences are saved on this device."
          >
            <div className="grid gap-4 p-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">
                  Theme
                </label>
                <div
                  className="grid grid-cols-3 gap-2"
                  role="group"
                  aria-label="Theme preference"
                >
                  {(["light", "dark", "system"] as const).map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={mounted && preference === option}
                      className={[
                        "flex h-10 items-center justify-center gap-2 rounded-md border px-3 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--care-primary)]",
                        mounted && preference === option
                          ? "border-[var(--care-primary)] bg-[var(--care-surface)] text-[var(--care-primary)]"
                          : "border-[var(--border-default)] bg-[var(--card-bg)] text-[var(--text-secondary)] hover:bg-[var(--care-surface)]",
                      ].join(" ")}
                      onClick={() => setThemePreference(option)}
                    >
                      <Monitor className="size-4" />
                      {option[0].toUpperCase() + option.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <PreferenceSelect
                id="account-language"
                label="Language"
                value={preferences.language}
                options={languageOptions}
                onChange={(language) =>
                  setPreferences((current) => ({ ...current, language }))
                }
              />

              <PreferenceSelect
                id="account-time-zone"
                label="Time Zone"
                value={preferences.timeZone}
                options={timeZoneOptions}
                onChange={(timeZone) =>
                  setPreferences((current) => ({ ...current, timeZone }))
                }
              />
            </div>
          </Card>

          <Card
            title="Security"
            description="Access and account protection details."
          >
            <div className="space-y-4 p-5">
              <div className="flex flex-col gap-3 rounded-md border border-[var(--border-default)] bg-[var(--care-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-[var(--card-bg)] text-[var(--care-primary)]">
                    <KeyRound className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      Change Password
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      Use the account recovery flow to update your password.
                    </p>
                  </div>
                </div>
                <Link
                  className="inline-flex h-9 items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-3 text-sm font-semibold text-[var(--care-primary)] transition hover:bg-[var(--care-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--care-primary)]"
                  href="/forgot-password"
                >
                  Change password
                </Link>
              </div>

              <DetailItem
                icon={<Clock className="size-4" />}
                label="Last Login"
                value={profile.lastLogin}
              />
              <DetailItem
                icon={<ShieldCheck className="size-4" />}
                label="Account Status"
                value={
                  <StatusBadge variant="success">
                    {profile.accountStatus}
                  </StatusBadge>
                }
              />
            </div>
          </Card>

          <Card
            title="Account Information"
            description="Membership and app metadata."
          >
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <DetailItem
                icon={<CalendarDays className="size-4" />}
                label="Member Since"
                value={profile.memberSince}
              />
              <DetailItem
                icon={<Globe2 className="size-4" />}
                label="App Version"
                value={APP_VERSION}
              />
              <DetailItem
                icon={<Languages className="size-4" />}
                label="Language"
                value={
                  languageOptions.find(
                    (option) => option.value === preferences.language,
                  )?.label ?? "English"
                }
              />
              <DetailItem
                icon={<Clock className="size-4" />}
                label="Time Zone"
                value={
                  timeZoneOptions.find(
                    (option) => option.value === preferences.timeZone,
                  )?.label ?? preferences.timeZone
                }
              />
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
