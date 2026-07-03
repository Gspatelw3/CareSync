"use client";

import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/forms/form-field";
import { useSettingsStore } from "@/lib/stores";
import { useToast } from "@/lib/use-toast";
import { useTheme } from "@/lib/theme-provider";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function SettingsPage() {
  const { organization, notifications, updateOrganization, updateNotificationSettings, resetToDefaults } = useSettingsStore();
  const { addToast } = useToast();
  const { theme, toggleTheme, mounted } = useTheme();
  const [activeTab, setActiveTab] = useState<"organization" | "notifications">("organization");

  const [orgForm, setOrgForm] = useState(organization);
  const [notifForm, setNotifForm] = useState(notifications);

  useEffect(() => {
    setOrgForm(organization);
    setNotifForm(notifications);
  }, [organization, notifications]);

  function handleSaveOrganization() {
    updateOrganization(orgForm);
    addToast("Organization settings saved successfully", "success");
  }

  function handleSaveNotifications() {
    updateNotificationSettings(notifForm);
    addToast("Notification preferences saved successfully", "success");
  }

  function handleReset() {
    if (confirm("Are you sure you want to reset all settings to defaults?")) {
      resetToDefaults();
      addToast("Settings reset to defaults", "success");
    }
  }

  return (
    <PageShell activeHref="/settings">
      <PageHeader
        eyebrow="Configuration"
        title="Settings"
        description="Manage organization settings, preferences, and system configuration."
        actions={
          <Button variant="secondary" onClick={handleReset}>
            Reset to Defaults
          </Button>
        }
      />

      <div className="mt-6">
        <Card title="Settings" description="Manage your organization and notification preferences">
          <div className="flex border-b border-[var(--border-default)]">
            <button
              onClick={() => setActiveTab("organization")}
              className={`px-6 py-3 text-sm font-medium transition ${
                activeTab === "organization"
                  ? "border-b-2 border-[var(--care-primary)] text-[var(--care-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Organization
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`px-6 py-3 text-sm font-medium transition ${
                activeTab === "notifications"
                  ? "border-b-2 border-[var(--care-primary)] text-[var(--care-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              Notifications
            </button>
          </div>

          <div className="p-6">
            {activeTab === "organization" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">Organization Information</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">Basic information about your healthcare facility.</p>
                </div>

                <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-4">
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)]">Theme</p>
                    <p className="text-xs text-[var(--text-muted)]">Switch between light and dark mode</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium text-[var(--care-primary)] hover:bg-[var(--care-surface)]"
                  >
                    {mounted && theme === "dark" ? (
                      <>
                        < Sun className="size-4" />
                        Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="size-4" />
                        Dark Mode
                      </>
                    )}
                  </button>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Organization Name</label>
                    <input
                      type="text"
                      value={orgForm.name}
                      onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                      className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Address</label>
                    <textarea
                      value={orgForm.address}
                      onChange={(e) => setOrgForm({ ...orgForm, address: e.target.value })}
                      rows={3}
                      className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Phone</label>
                      <input
                        type="text"
                        value={orgForm.phone}
                        onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
                        className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Email</label>
                      <input
                        type="email"
                        value={orgForm.email}
                        onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
                        className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Timezone"
                      type="select"
                      value={orgForm.timezone}
                      onChange={(value) => setOrgForm({ ...orgForm, timezone: value })}
                      options={[
                        { label: "Asia/Kolkata (IST)", value: "Asia/Kolkata" },
                        { label: "America/New_York (EST)", value: "America/New_York" },
                        { label: "America/Los_Angeles (PST)", value: "America/Los_Angeles" },
                        { label: "Europe/London (GMT)", value: "Europe/London" },
                      ]}
                    />
                    <FormField
                      label="Currency"
                      type="select"
                      value={orgForm.currency}
                      onChange={(value) => setOrgForm({ ...orgForm, currency: value })}
                      options={[
                        { label: "INR (₹)", value: "INR" },
                        { label: "USD ($)", value: "USD" },
                        { label: "EUR (€)", value: "EUR" },
                        { label: "GBP (£)", value: "GBP" },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Working Hours Start</label>
                      <input
                        type="time"
                        value={orgForm.workingHoursStart}
                        onChange={(e) => setOrgForm({ ...orgForm, workingHoursStart: e.target.value })}
                        className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Working Hours End</label>
                      <input
                        type="time"
                        value={orgForm.workingHoursEnd}
                        onChange={(e) => setOrgForm({ ...orgForm, workingHoursEnd: e.target.value })}
                        className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Registration Number</label>
                    <input
                      type="text"
                      value={orgForm.registrationNo}
                      onChange={(e) => setOrgForm({ ...orgForm, registrationNo: e.target.value })}
                      className="w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveOrganization}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">Notification Preferences</h3>
                  <p className="mt-1 text-sm text-[var(--text-secondary)]">Configure how you receive notifications and alerts.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Email Notifications</p>
                      <p className="text-xs text-[var(--text-muted)]">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={notifForm.emailNotifications}
                        onChange={(e) => setNotifForm({ ...notifForm, emailNotifications: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="size-11 rounded-full bg-[var(--border-default)] peer-checked:bg-[var(--care-primary)] after:absolute after:left-1 after:top-1 after:size-9 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">SMS Notifications</p>
                      <p className="text-xs text-[var(--text-muted)]">Receive notifications via SMS</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={notifForm.smsNotifications}
                        onChange={(e) => setNotifForm({ ...notifForm, smsNotifications: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="size-11 rounded-full bg-[var(--border-default)] peer-checked:bg-[var(--care-primary)] after:absolute after:left-1 after:top-1 after:size-9 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Appointment Reminders</p>
                      <p className="text-xs text-[var(--text-muted)]">Send reminders for upcoming appointments</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={notifForm.appointmentReminders}
                        onChange={(e) => setNotifForm({ ...notifForm, appointmentReminders: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="size-11 rounded-full bg-[var(--border-default)] peer-checked:bg-[var(--care-primary)] after:absolute after:left-1 after:top-1 after:size-9 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Lab Result Alerts</p>
                      <p className="text-xs text-[var(--text-muted)]">Notify when lab results are ready</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={notifForm.labResultAlerts}
                        onChange={(e) => setNotifForm({ ...notifForm, labResultAlerts: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="size-11 rounded-full bg-[var(--border-default)] peer-checked:bg-[var(--care-primary)] after:absolute after:left-1 after:top-1 after:size-9 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Billing Alerts</p>
                      <p className="text-xs text-[var(--text-muted)]">Notify for payment and billing events</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={notifForm.billingAlerts}
                        onChange={(e) => setNotifForm({ ...notifForm, billingAlerts: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="size-11 rounded-full bg-[var(--border-default)] peer-checked:bg-[var(--care-primary)] after:absolute after:left-1 after:top-1 after:size-9 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between rounded-md border border-[var(--border-default)] p-4">
                    <div>
                      <p className="text-sm font-medium text-[var(--text-primary)]">Inventory Alerts</p>
                      <p className="text-xs text-[var(--text-muted)]">Notify for low stock and inventory issues</p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={notifForm.inventoryAlerts}
                        onChange={(e) => setNotifForm({ ...notifForm, inventoryAlerts: e.target.checked })}
                        className="peer sr-only"
                      />
                      <div className="size-11 rounded-full bg-[var(--border-default)] peer-checked:bg-[var(--care-primary)] after:absolute after:left-1 after:top-1 after:size-9 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}