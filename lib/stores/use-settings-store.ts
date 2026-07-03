"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type OrganizationSettings = {
  name: string;
  address: string;
  phone: string;
  email: string;
  registrationNo: string;
  licenseType: string;
  timezone: string;
  currency: string;
  language: string;
  workingHoursStart: string;
  workingHoursEnd: string;
  logoUrl: string;
};

type NotificationSettings = {
  emailNotifications: boolean;
  smsNotifications: boolean;
  appointmentReminders: boolean;
  labResultAlerts: boolean;
  billingAlerts: boolean;
  inventoryAlerts: boolean;
};

type SettingsStore = {
  organization: OrganizationSettings;
  notifications: NotificationSettings;
  isLoading: boolean;

  // Actions
  updateOrganization: (settings: Partial<OrganizationSettings>) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  resetToDefaults: () => void;
};

// TODO: Replace LocalStorage with API calls to backend
// TODO: Connect to /api/settings endpoint
// TODO: Add multi-tenant support

const defaultOrganization: OrganizationSettings = {
  name: "Care Sync Medical Centre",
  address: "42 Health Avenue, Medical District",
  phone: "+91 1800 420 4242",
  email: "contact@caresync.health",
  registrationNo: "HSM-42-1987-06",
  licenseType: "Multi-specialty (Level 3)",
  timezone: "Asia/Kolkata",
  currency: "INR",
  language: "en",
  workingHoursStart: "09:00",
  workingHoursEnd: "18:00",
  logoUrl: "/caresync.svg",
};

const defaultNotifications: NotificationSettings = {
  emailNotifications: true,
  smsNotifications: true,
  appointmentReminders: true,
  labResultAlerts: true,
  billingAlerts: true,
  inventoryAlerts: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      organization: defaultOrganization,
      notifications: defaultNotifications,
      isLoading: false,

      updateOrganization: (settings) =>
        set((state) => ({
          organization: { ...state.organization, ...settings },
        })),

      updateNotificationSettings: (settings) =>
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        })),

      resetToDefaults: () =>
        set({
          organization: defaultOrganization,
          notifications: defaultNotifications,
        }),
    }),
    {
      name: "care-sync-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize with default settings
export function initializeMockSettings() {
  const store = useSettingsStore.getState();
  // Settings are already initialized with defaults via the store
}