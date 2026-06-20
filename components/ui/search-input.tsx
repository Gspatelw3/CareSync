"use client";

import { Search } from "lucide-react";

type SearchInputProps = {
  placeholder?: string;
};

export function SearchInput({ placeholder = "Search..." }: SearchInputProps) {
  return (
    <div className="relative w-full sm:w-auto self-stretch sm:self-auto">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
      <input
        className="h-10 w-full rounded-md border border-[var(--care-border)] bg-white pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[var(--care-primary)]"
        placeholder={placeholder}
        type="search"
      />
    </div>
  );
}