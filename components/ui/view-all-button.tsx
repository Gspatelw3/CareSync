"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { StatusBadge } from "@/components/data-display/status-badge";

type ReportItem = {
  name: string;
  period: string;
  updated: string;
  status: string;
};

type ViewAllButtonProps = {
  label: string;
  title: string;
  subtitle: string;
  reports: ReportItem[];
};

const statusVariant: Record<string, "default" | "warning" | "danger" | "info"> = {
  Generated: "default",
  "Auto-generated": "info",
  Draft: "warning",
};

export function ViewAllButton({ label, title, subtitle, reports }: ViewAllButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="text-sm font-semibold text-[var(--care-primary)] hover:text-[var(--care-primary-dark)] cursor-pointer"
        onClick={() => setOpen(true)}
        type="button"
      >
        {label}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        subtitle={subtitle}
      >
        <div className="grid gap-px bg-slate-100 rounded-lg overflow-hidden sm:grid-cols-2">
          {reports.map((report) => (
            <div
              className="flex items-center justify-between gap-4 bg-white px-5 py-4 hover:bg-slate-50"
              key={report.name}
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-950">{report.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {report.period} · Updated {report.updated}
                </p>
              </div>
              <StatusBadge variant={statusVariant[report.status] || "default"}>
                {report.status}
              </StatusBadge>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
