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
        <thead className="bg-[var(--care-surface)] text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
          <tr>
            {headers.map((header) => (
              <th className="px-5 py-3 font-semibold" key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--table-divide)]">{children}</tbody>
      </table>
    </div>
  );
}