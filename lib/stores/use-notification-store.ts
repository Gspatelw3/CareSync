"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
  link?: string;
};

type NotificationStore = {
  notifications: Notification[];
  isLoading: boolean;
  unreadCount: number;

  // Actions
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getUnreadNotifications: () => Notification[];
  getFilteredNotifications: (filter: "all" | "unread") => Notification[];
};

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      isLoading: false,
      unreadCount: 0,

      addNotification: (notificationData) => {
        const newNotification: Notification = {
          ...notificationData,
          id: `NOTIF-${Date.now()}`,
          createdAt: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }));
      },

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: state.notifications.filter((n) => !n.read && n.id !== id).length,
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      deleteNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);
          const wasUnread = notification && !notification.read;
          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
          };
        }),

      clearAll: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),

      getUnreadNotifications: () => {
        return get().notifications.filter((n) => !n.read);
      },

      getFilteredNotifications: (filter) => {
        if (filter === "unread") {
          return get().notifications.filter((n) => !n.read);
        }
        return get().notifications;
      },
    }),
    {
      name: "care-sync-notifications",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize with mock notifications
export function initializeMockNotifications() {
  const store = useNotificationStore.getState();
  if (store.notifications.length === 0) {
    const mockNotifications: Notification[] = [
      {
        id: "NOTIF-001",
        title: "New Patient Registered",
        message: "Meera Iyer has been registered in Cardiology department.",
        type: "info",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
        link: "/patients",
      },
      {
        id: "NOTIF-002",
        title: "Appointment Confirmed",
        message: "Appointment with Ravi Kumar confirmed for 09:00 AM.",
        type: "success",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
        link: "/appointments",
      },
      {
        id: "NOTIF-003",
        title: "Low Stock Alert",
        message: "Insulin Glargine stock is critically low (45 vials remaining).",
        type: "warning",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
        link: "/pharmacy",
      },
      {
        id: "NOTIF-004",
        title: "Lab Report Ready",
        message: "Blood Glucose test report for Lakshmi Nair is ready for review.",
        type: "success",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
        link: "/laboratory",
      },
      {
        id: "NOTIF-005",
        title: "Payment Received",
        message: "Payment of ₹4,500 received from Meera Iyer.",
        type: "success",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
        link: "/billing",
      },
      {
        id: "NOTIF-006",
        title: "Critical Patient Admission",
        message: "Vikram Singh admitted to ICU with Myocardial infarction.",
        type: "error",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
        link: "/inpatient",
      },
    ];
    store.notifications = mockNotifications;
    store.unreadCount = mockNotifications.filter((n) => !n.read).length;
  }
}
