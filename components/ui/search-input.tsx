"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function SearchInput({ placeholder = "Search...", value, onChange, className }: SearchInputProps) {
  return (
    <div className={`relative w-full sm:w-auto self-stretch sm:self-auto ${className || ""}`}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted-light)]" />
      <input
        className="h-10 w-full rounded-md border border-[var(--input-border)] bg-[var(--input-bg)] pl-9 pr-3 text-sm text-[var(--input-text)] outline-none placeholder:text-[var(--input-placeholder)] focus:border-[var(--care-primary)] focus:ring-2 focus:ring-[var(--care-primary)]/20"
        placeholder={placeholder}
        type="search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
