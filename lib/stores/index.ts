// ── Care Sync Store Initialization ──
// This file initializes all mock data for the application.
// Call initializeAllStores() in your app entry point to load mock data.

import { initializeMockPatients } from "./use-patient-store";
import { initializeMockDoctors } from "./use-doctor-store";
import { initializeMockAppointments } from "./use-appointment-store";
import { initializeMockInventory } from "./use-inventory-store";
import { initializeMockAdmissions } from "./use-admission-store";
import { initializeMockLabTests } from "./use-lab-store";
import { initializeMockInvoices } from "./use-billing-store";
import { initializeMockNotifications } from "./use-notification-store";

export function initializeAllStores() {
  // Initialize all stores with mock data
  // This ensures the application has realistic data on first load
  initializeMockPatients();
  initializeMockDoctors();
  initializeMockAppointments();
  initializeMockInventory();
  initializeMockAdmissions();
  initializeMockLabTests();
  initializeMockInvoices();
  initializeMockNotifications();

  console.log("✅ All stores initialized with mock data");
}

export { usePatientStore } from "./use-patient-store";
export { useDoctorStore } from "./use-doctor-store";
export { useAppointmentStore } from "./use-appointment-store";
export { useInventoryStore } from "./use-inventory-store";
export { useAdmissionStore } from "./use-admission-store";
export { useLabStore } from "./use-lab-store";
export { useBillingStore } from "./use-billing-store";
export { useAuthStore, initializeMockAuth } from "./use-auth-store";
export { useNotificationStore, initializeMockNotifications } from "./use-notification-store";
export { useSettingsStore, initializeMockSettings } from "./use-settings-store";