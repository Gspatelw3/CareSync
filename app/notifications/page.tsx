"use client";

import { PageShell, PageHeader } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Bell, Check, Trash2 } from "lucide-react";
import { useNotificationStore, initializeMockNotifications } from "@/lib/stores";
import { useToast } from "@/lib/use-toast";
import { useEffect, useState } from "react";

export default function NotificationsPage() {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const { notifications, markAsRead, markAllAsRead, deleteNotification, getFilteredNotifications } = useNotificationStore();
  const { addToast } = useToast();

  useEffect(() => {
    initializeMockNotifications();
  }, []);

  const filteredNotifications = getFilteredNotifications(filter);

  // Format timestamp
  function formatTime(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  const handleMarkAsRead = (id: string) => {
    markAsRead(id);
    addToast("Notification marked as read", "success");
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this notification?")) {
      deleteNotification(id);
      addToast("Notification deleted", "success");
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    addToast("All notifications marked as read", "success");
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <PageShell activeHref="/notifications">
      <PageHeader
        eyebrow="Alerts & Updates"
        title="Notifications"
        description="System alerts, appointment reminders, and operational updates."
        actions={
          unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="inline-flex items-center gap-2 rounded-md border border-[var(--border-default)] bg-[var(--card-bg)] px-4 py-2 text-sm font-medium text-[var(--care-primary)] hover:bg-[var(--care-surface)]"
            >
              <Check className="size-4" />
              Mark all as read
            </button>
          )
        }
      />

      <div className="mt-6">
        <Card title="All Notifications" description="System alerts and updates">
          <div className="flex items-center justify-between border-b border-[var(--border-default)] px-5 py-3">
            <div className="flex items-center gap-2">
              <Bell className="size-5 text-[var(--care-primary)]" />
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All notifications"}
              </h3>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  filter === "all"
                    ? "bg-[var(--care-primary)] text-white"
                    : "bg-[var(--care-surface)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("unread")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  filter === "unread"
                    ? "bg-[var(--care-primary)] text-white"
                    : "bg-[var(--care-surface)] text-[var(--text-secondary)] hover:bg-[var(--hover-bg)]"
                }`}
              >
                Unread
              </button>
            </div>
          </div>

          <div className="divide-y divide-[var(--table-divide)]">
            {filteredNotifications.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <Bell className="size-12 mx-auto text-[var(--text-muted)] mb-3" />
                <p className="text-sm text-[var(--text-muted)]">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 px-5 py-4 hover:bg-[var(--hover-bg)] transition ${
                    !notification.read ? "bg-[var(--care-mint)]/5" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[var(--text-primary)]">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <span className="size-2 rounded-full bg-[var(--care-primary)]" />
                          )}
                        </div>
                        <p className="mt-1 text-sm text-[var(--text-secondary)]">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-muted)]">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="p-2 text-[var(--text-muted)] hover:text-[var(--care-primary)] transition"
                            title="Mark as read"
                          >
                            <Check className="size-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="p-2 text-[var(--text-muted)] hover:text-red-600 transition"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}