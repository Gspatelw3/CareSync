"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";

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

const statusColor: Record<string, string> = {
  Generated: "bg-[color:var(--care-mint)]/20 text-[var(--care-secondary-dark)] ring-1 ring-[color:var(--care-mint)]/60",
  "Auto-generated": "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  Draft: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
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
              <span
                className={[
                  "inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold",
                  statusColor[report.status] || "bg-slate-50 text-slate-700 ring-1 ring-slate-200",
                ].join(" ")}
              >
                {report.status}
              </span>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}