"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/forms/form-field";
import { useToast } from "@/lib/use-toast";

type Department = {
  name: string;
  head: string;
};

type NotificationRule = {
  id: string;
  label: string;
  enabled: boolean;
  description: string;
};

type SettingsData = {
  hospitalName: string;
  registrationNo: string;
  address: string;
  phone: string;
  email: string;
  licenseType: string;
  departments: Department[];
  notifications: NotificationRule[];
  language: string;
  timezone: string;
  dateFormat: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
};

const initialSettings: SettingsData = {
  hospitalName: "Care Sync Medical Centre",
  registrationNo: "HSM-42-1987-06",
  address: "42 Health Avenue, Medical District",
  phone: "+91 1800 420 4242",
  email: "contact@caresync.health",
  licenseType: "Multi-specialty (Level 3)",
  departments: [
    { name: "Cardiology", head: "Dr. Kavya Rao" },
    { name: "Orthopedics", head: "Dr. Neil Shah" },
    { name: "General Medicine", head: "Dr. Amina Khan" },
    { name: "Neurology", head: "Dr. Amit Verma" },
    { name: "Pediatrics", head: "Dr. Sneha Kapoor" },
    { name: "Obstetrics", head: "Dr. Priya Mehta" },
    { name: "Pulmonology", head: "Dr. Rajesh Gupta" },
    { name: "Dermatology", head: "Dr. Sunita Reddy" },
  ],
  notifications: [
    {
      id: "low-stock",
      label: "Low Stock Alerts",
      enabled: true,
      description: "Threshold: 20% of reorder level",
    },
    {
      id: "critical-lab",
      label: "Critical Lab Results",
      enabled: true,
      description: "Push to attending + HOD",
    },
    {
      id: "bed-occupancy",
      label: "Bed Occupancy Warning",
      enabled: true,
      description: "Alert at 85% occupancy",
    },
    {
      id: "pending-payments",
      label: "Pending Payments Reminder",
      enabled: true,
      description: "Daily at 9 AM",
    },
    {
      id: "appointment-no-show",
      label: "Appointment No-show Flag",
      enabled: true,
      description: "After 15 min grace period",
    },
  ],
  language: "en",
  timezone: "Asia/Kolkata",
  dateFormat: "DD/MM/YYYY",
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: false,
};

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<SettingsData>(initialSettings);
  const [originalSettings, setOriginalSettings] = useState<SettingsData>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const { addToast } = useToast();

  const hasChanges = JSON.stringify(settings) !== JSON.stringify(originalSettings);

  // Navigation guard for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges && !isSaving) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges, isSaving]);

  // Handle internal navigation
  const handleNavigation = useCallback((href: string) => {
    if (hasChanges && !isSaving) {
      setPendingNavigation(href);
      setShowLeaveDialog(true);
    } else {
      router.push(href);
    }
  }, [hasChanges, isSaving, router]);

  const confirmLeave = () => {
    setShowLeaveDialog(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const cancelLeave = () => {
    setShowLeaveDialog(false);
    setPendingNavigation(null);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!settings.hospitalName.trim()) {
      newErrors.hospitalName = "Hospital name is required";
    }

    if (!settings.registrationNo.trim()) {
      newErrors.registrationNo = "Registration number is required";
    }

    if (!settings.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!settings.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(settings.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    if (!settings.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!settings.licenseType.trim()) {
      newErrors.licenseType = "License type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      addToast("Please fix the validation errors", "warning");
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call with potential failure
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 10% chance of failure for demonstration
          if (Math.random() < 0.1) {
            reject(new Error("Network error"));
          } else {
            resolve(true);
          }
        }, 1000);
      });

      setOriginalSettings(settings);
      addToast("Settings updated successfully.", "success");
    } catch (error) {
      addToast("Failed to save settings. Please try again.", "error");
      console.error("Save error:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSettings(originalSettings);
    setErrors({});
    addToast("Changes discarded", "info");
  };

  const updateField = <K extends keyof SettingsData>(field: K, value: SettingsData[K]) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as string]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  };

  const updateDepartment = (index: number, field: keyof Department, value: string) => {
    setSettings((prev) => ({
      ...prev,
      departments: prev.departments.map((dept, i) =>
        i === index ? { ...dept, [field]: value } : dept
      ),
    }));
  };

  const toggleNotification = (id: string) => {
    setSettings((prev) => ({
      ...prev,
      notifications: prev.notifications.map((notif) =>
        notif.id === id ? { ...notif, enabled: !notif.enabled } : notif
      ),
    }));
  };

  const languageOptions = [
    { label: "English", value: "en" },
    { label: "Hindi", value: "hi" },
    { label: "Tamil", value: "ta" },
    { label: "Telugu", value: "te" },
    { label: "Marathi", value: "mr" },
  ];

  const timezoneOptions = [
    { label: "India Standard Time (IST)", value: "Asia/Kolkata" },
    { label: "UTC", value: "UTC" },
    { label: "US Eastern Time", value: "America/New_York" },
    { label: "US Pacific Time", value: "America/Los_Angeles" },
  ];

  const dateFormatOptions = [
    { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
    { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
    { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
  ];

  return (
    <PageShell activeHref="/settings">
        <PageHeader
          eyebrow="Administration"
          title="Settings"
          description="Role access, hospital profile, departments, notification rules, and account preferences."
        />

      <div className="mt-6 grid gap-6">
        {/* Hospital Profile */}
        <Card
          title="Hospital Profile"
          description="Hospital name, address, contact, and branding details."
        >
          <div className="grid gap-6 p-5 sm:grid-cols-2">
            <FormField
              label="Hospital Name"
              value={settings.hospitalName}
              onChange={(value) => updateField("hospitalName", value)}
              placeholder="Enter hospital name"
              error={errors.hospitalName}
            />
            <FormField
              label="Registration No."
              value={settings.registrationNo}
              onChange={(value) => updateField("registrationNo", value)}
              placeholder="Enter registration number"
              error={errors.registrationNo}
            />
            <FormField
              label="Address"
              value={settings.address}
              onChange={(value) => updateField("address", value)}
              placeholder="Enter hospital address"
              error={errors.address}
              type="textarea"
            />
            <FormField
              label="Phone"
              value={settings.phone}
              onChange={(value) => updateField("phone", value)}
              placeholder="+91 1800 420 4242"
              type="tel"
              error={errors.phone}
            />
            <FormField
              label="Email"
              value={settings.email}
              onChange={(value) => updateField("email", value)}
              placeholder="contact@hospital.com"
              type="email"
              error={errors.email}
            />
            <FormField
              label="License Type"
              value={settings.licenseType}
              onChange={(value) => updateField("licenseType", value)}
              placeholder="Select license type"
              type="select"
              options={[
                { label: "Multi-specialty (Level 3)", value: "Multi-specialty (Level 3)" },
                { label: "Single Specialty", value: "Single Specialty" },
                { label: "Teaching Hospital", value: "Teaching Hospital" },
                { label: "Research Hospital", value: "Research Hospital" },
              ]}
              error={errors.licenseType}
            />
          </div>
        </Card>

        {/* Departments */}
        <Card
          title="Departments"
          description="Active clinical departments and their heads."
        >
          <div className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {settings.departments.map((dept, index) => (
                <div
                  key={dept.name}
                  className="flex flex-col gap-3 rounded-lg border border-[var(--border-default)] bg-[var(--card-bg)] p-4"
                >
                  <FormField
                    label="Department Name"
                    value={dept.name}
                    onChange={(value) => updateDepartment(index, "name", value)}
                    placeholder="Department name"
                  />
                  <FormField
                    label="Department Head"
                    value={dept.head}
                    onChange={(value) => updateDepartment(index, "head", value)}
                    placeholder="Dr. Name"
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Notification Rules */}
        <Card
          title="Notification Rules"
          description="System alerts and notification preferences."
        >
          <div className="p-5">
            <div className="grid gap-4">
              {settings.notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start justify-between gap-4 rounded-lg border border-[var(--border-default)] bg-[var(--card-bg)] p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                        {notification.label}
                      </h3>
                      <span className="text-xs text-[var(--text-muted)]">
                        {notification.description}
                      </span>
                    </div>
                  </div>
                  <Toggle
                    checked={notification.enabled}
                    onChange={() => toggleNotification(notification.id)}
                    label={`${notification.label} toggle`}
                  />
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Account Preferences */}
        <Card
          title="Account Preferences"
          description="Language, timezone, and notification channels."
        >
          <div className="grid gap-6 p-5 sm:grid-cols-2">
            <FormField
              label="Language"
              value={settings.language}
              onChange={(value) => updateField("language", value)}
              type="select"
              options={languageOptions}
            />
            <FormField
              label="Timezone"
              value={settings.timezone}
              onChange={(value) => updateField("timezone", value)}
              type="select"
              options={timezoneOptions}
            />
            <FormField
              label="Date Format"
              value={settings.dateFormat}
              onChange={(value) => updateField("dateFormat", value)}
              type="select"
              options={dateFormatOptions}
            />
            <div className="sm:col-span-2">
              <h3 className="mb-3 text-sm font-semibold text-[var(--text-secondary)]">
                Notification Channels
              </h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex items-center justify-between rounded-lg border border-[var(--border-default)] bg-[var(--card-bg)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Email Notifications
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Receive updates via email
                    </p>
                  </div>
                  <Toggle
                    checked={settings.emailNotifications}
                    onChange={() => updateField("emailNotifications", !settings.emailNotifications)}
                    label="Email notifications toggle"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[var(--border-default)] bg-[var(--card-bg)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      SMS Notifications
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Receive updates via SMS
                    </p>
                  </div>
                  <Toggle
                    checked={settings.smsNotifications}
                    onChange={() => updateField("smsNotifications", !settings.smsNotifications)}
                    label="SMS notifications toggle"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-[var(--border-default)] bg-[var(--card-bg)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      Push Notifications
                    </p>
                    <p className="text-xs text-[var(--text-muted)]">
                      Browser push alerts
                    </p>
                  </div>
                  <Toggle
                    checked={settings.pushNotifications}
                    onChange={() => updateField("pushNotifications", !settings.pushNotifications)}
                    label="Push notifications toggle"
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end gap-3 border-t border-[var(--border-default)] pt-6">
          <Button
            variant="secondary"
            size="md"
            onClick={handleCancel}
            disabled={!hasChanges || isSaving}
          >
            Cancel
          </Button>
          <Button size="md" onClick={handleSave} disabled={!hasChanges || isSaving}>
            {isSaving ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      {/* Leave Confirmation Dialog */}
      {showLeaveDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={cancelLeave}
          />
          <div className="relative z-10 mx-4 w-full max-w-md rounded-xl border border-[var(--border-default)] bg-[var(--card-bg)] p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Unsaved Changes
            </h3>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={cancelLeave}
              >
                Stay
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={confirmLeave}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={[
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--care-primary)] focus-visible:ring-offset-2",
        checked ? "bg-[var(--care-primary)]" : "bg-[var(--border-default)]",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out",
          checked ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}