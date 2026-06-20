export type BarChartItem = {
  label: string;
  value: string;
  height: string;
};

export function BarChart({
  data,
  maxLabel,
}: {
  data: BarChartItem[];
  maxLabel?: string;
}) {
  return (
    <div className="mt-6 flex h-64 items-end gap-3 border-b border-l border-slate-200 px-2 pb-4 sm:gap-5">
      {data.map((item) => (
        <div
          className="flex h-full flex-1 flex-col items-center justify-end gap-2"
          key={item.label}
        >
          <span className="text-xs font-semibold text-slate-500">
            {item.value}
          </span>
          <div
            className="care-brand-gradient-vertical w-full rounded-t-md"
            style={{ height: item.height }}
          />
          <span className="text-xs font-medium text-slate-500">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function CompactBarChart({
  data,
  maxValue,
  unit,
}: {
  data: { label: string; value: number }[];
  maxValue: number;
  unit?: string;
}) {
  return (
    <div className="mt-5 flex h-48 items-end gap-2 border-b border-l border-slate-200 px-1 pb-3">
      {data.map((item) => (
        <div
          className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
          key={item.label}
        >
          <span className="text-[11px] font-semibold text-slate-500">
            {item.value}{unit ?? ""}
          </span>
          <div
            className="care-brand-gradient-vertical w-full rounded-t-md"
            style={{ height: `${(item.value / maxValue) * 100}%` }}
          />
          <span className="text-[11px] font-medium text-slate-500">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}