"use client";

import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { TOAST } from "@/lib/config";

type Toast = {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
};

type ToastContextType = {
  toasts: Toast[];
  addToast: (message: string, type?: Toast["type"]) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idCounter = useRef(0);
  const timeoutIds = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = `toast-${Date.now()}-${idCounter.current++}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    const timeoutId = setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timeoutIds.current.delete(timeoutId);
    }, TOAST.durationMs);
    timeoutIds.current.add(timeoutId);
  }, []);

  useEffect(() => {
    const ids = timeoutIds.current;
    return () => {
      ids.forEach(clearTimeout);
      ids.clear();
    };
  }, []);

  const contextValue = useMemo(() => ({ toasts, addToast }), [addToast, toasts]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={[
                "animate-in slide-in-from-right rounded-lg border px-4 py-3 text-sm font-semibold shadow-lg",
                "bg-[var(--card-bg)]",
                t.type === "success" && "border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300",
                t.type === "info" && "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300",
                t.type === "warning" && "border-amber-200 text-amber-700 dark:border-amber-800 dark:text-amber-300",
                t.type === "error" && "border-red-200 text-red-700 dark:border-red-800 dark:text-red-300",
              ].filter(Boolean).join(" ")}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toasts: [] as Toast[],
      addToast: () => {},
    };
  }
  return ctx;
}
