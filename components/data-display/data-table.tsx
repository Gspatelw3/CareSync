import type { ReactNode } from "react";

export type ColumnDef = {
  key: string;
  label: string;
};

export function DataTable({
  headers,
  children,
}: {
  headers: string[];
  children: ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left text-sm [&_th]:whitespace-nowrap [&_td]:whitespace-nowrap">
        <thead className="bg-[var(--care-surface)] text-xs uppercase tracking-[0.12em] text-slate-500">
          <tr>
            {headers.map((header) => (
              <th className="px-5 py-3 font-semibold" key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
    </div>
  );
}