"use client";

import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import {
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Trash2,
    CheckSquare,
    Pencil,
} from "lucide-react";
import { useToast } from "@/lib/use-toast";
import Select from "react-select";

type Column = {
    key: string;
    label: string;
    sortable?: boolean;
};

type EnhancedDataTableProps<T> = {
    columns: Column[];
    data: T[];
    onRowClick?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (id: string) => void;
    onBulkDelete?: (ids: string[]) => void;
    onBulkStatusUpdate?: (ids: string[], status: string) => void;
    getRowId: (row: T) => string;
    renderCell: (row: T, column: Column) => React.ReactNode;
    searchPlaceholder?: string;
    filterOptions?: { label: string; value: string }[];
    currentFilter?: string;
    onFilterChange?: (value: string) => void;
    departmentFilterOptions?: { label: string; value: string }[];
    currentDepartmentFilter?: string;
    onDepartmentFilterChange?: (value: string) => void;
    emptyMessage?: string;
    isLoading?: boolean;
};

// Memoize Checkbox component to prevent unnecessary re-renders
const Checkbox = memo(function Checkbox({
    checked,
    onChange,
    ariaLabel,
}: {
    checked: boolean;
    onChange: () => void;
    ariaLabel: string;
}) {
    return (
        <div className="relative inline-flex items-center">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="peer size-4 cursor-pointer appearance-none rounded border-2 border-[var(--border-default)] bg-transparent transition-all checked:border-[var(--care-primary)] checked:bg-[var(--care-primary)]"
                aria-label={ariaLabel}
            />
            <svg
                className="pointer-events-none absolute left-1/2 top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M2 6l3 3 5-5" />
            </svg>
        </div>
    );
});

const selectStyles = {
    control: (base: any) => ({
        ...base,
        backgroundColor: "var(--input-bg)",
        borderColor: "var(--border-default)",
        borderRadius: "0.5rem",
        minHeight: "42px",
        color: "var(--text-primary)",
    }),
    menu: (base: any) => ({
        ...base,
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-default)",
        borderRadius: "0.5rem",
    }),
    option: (base: any, state: any) => ({
        ...base,
        backgroundColor: state.isFocused
            ? "var(--care-primary)"
            : "var(--card-bg)",
        color: state.isFocused ? "white" : "var(--text-primary)",
    }),
    singleValue: (base: any) => ({
        ...base,
        color: "var(--text-primary)",
    }),
    placeholder: (base: any) => ({
        ...base,
        color: "var(--text-muted)",
    }),
    dropdownIndicator: (base: any) => ({
        ...base,
        color: "var(--text-muted)",
    }),
    indicatorSeparator: (base: any) => ({
        ...base,
        backgroundColor: "var(--border-default)",
    }),
};

const compactSelectStyles = {
    ...selectStyles,
    control: (base: any) => ({
        ...selectStyles.control(base),
        minHeight: "32px",
    }),
};

const statusSelectStyles = {
    ...selectStyles,
    control: (base: any) => ({
        ...selectStyles.control(base),
        whiteSpace: "nowrap",
    }),
    placeholder: (base: any) => ({
        ...selectStyles.placeholder(base),
        whiteSpace: "nowrap",
    }),
};

const bulkStatusOptions = [
    { value: "On duty", label: "On Duty" },
    { value: "Off duty", label: "Off Duty" },
    { value: "On leave", label: "On Leave" },
    { value: "Available", label: "Available" },
];

const pageSizeOptions = [
    { value: "5", label: "5" },
    { value: "10", label: "10" },
    { value: "25", label: "25" },
    { value: "50", label: "50" },
];

// Client-only wrapper for react-select to prevent hydration mismatches
function ClientSelect(props: any) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        // Return a placeholder during SSR to prevent hydration mismatch
        return (
            <div className="h-[42px] w-full rounded-lg border border-[var(--border-default)] bg-[var(--input-bg)]" />
        );
    }

    return <Select {...props} />;
}

// Export a memoized generic table component
export const EnhancedDataTable = memo(function EnhancedDataTable<T>({
    columns,
    data,
    onRowClick,
    onEdit,
    onDelete,
    onBulkDelete,
    onBulkStatusUpdate,
    getRowId,
    renderCell,
    searchPlaceholder = "Search...",
    filterOptions,
    currentFilter,
    onFilterChange,
    departmentFilterOptions,
    currentDepartmentFilter,
    onDepartmentFilterChange,
    emptyMessage = "No data found",
    isLoading = false,
}: EnhancedDataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const { addToast } = useToast();

    const filteredData = useMemo(() => data.filter((row) => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        const rowValues = Object.values(row as Record<string, unknown>);
        return rowValues.some((value) =>
            String(value).toLowerCase().includes(query),
        );
    }), [data, searchQuery]);

    const sortedData = useMemo(() => [...filteredData].sort((a, b) => {
        if (!sortBy) return 0;
        const aVal = a[sortBy as keyof T];
        const bVal = b[sortBy as keyof T];
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
    }), [filteredData, sortBy, sortOrder]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = useMemo(
        () => sortedData.slice(startIndex, startIndex + itemsPerPage),
        [sortedData, startIndex, itemsPerPage],
    );
    const paginatedIds = useMemo(
        () => paginatedData.map((row) => getRowId(row)),
        [getRowId, paginatedData],
    );
    const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    useEffect(() => {
        setCurrentPage((page) => Math.min(Math.max(page, 1), totalPages || 1));
    }, [totalPages]);

    const handleSort = useCallback((key: string) => {
        if (sortBy === key) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(key);
            setSortOrder("asc");
        }
    }, [sortBy, sortOrder]);

    const handleSelectAll = useCallback(() => {
        if (selectedIds.length === paginatedIds.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(paginatedIds);
        }
    }, [paginatedIds, selectedIds.length]);

    const handleSelectRow = useCallback((id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    }, []);

    const handleBulkDelete = useCallback(() => {
        if (onBulkDelete && selectedIds.length > 0) {
            onBulkDelete(selectedIds);
            setSelectedIds([]);
            addToast(
                `Deleted ${selectedIds.length} items successfully`,
                "success",
            );
        }
    }, [addToast, onBulkDelete, selectedIds]);

    const isAllSelected =
        paginatedData.length > 0 && selectedIds.length === paginatedData.length;
    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="h-10 bg-[var(--care-surface)] animate-pulse rounded" />
                <div className="h-64 bg-[var(--care-surface)] animate-pulse rounded" />
            </div>
        );
    }

    return (
        <div className="">
            {/* Search, Filter, and Actions Bar */}
            <div className="flex flex-col gap-3 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <SearchInput
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder={searchPlaceholder}
                        className="w-full sm:flex-1 sm:max-w-sm"
                    />
                    {filterOptions && onFilterChange && (
                        <div className="w-full sm:w-40">
                            <ClientSelect
                                value={filterOptions.find(
                                    (opt) => opt.value === currentFilter,
                                )}
                                onChange={(selected: any) =>
                                    selected && onFilterChange(selected.value)
                                }
                                options={filterOptions}
                                styles={selectStyles}
                            />
                        </div>
                    )}
                    {departmentFilterOptions && onDepartmentFilterChange && (
                        <div className="w-full sm:w-48">
                            <ClientSelect
                                value={departmentFilterOptions.find(
                                    (opt) =>
                                        opt.value === currentDepartmentFilter,
                                )}
                                onChange={(selected: any) =>
                                    selected &&
                                    onDepartmentFilterChange(selected.value)
                                }
                                options={departmentFilterOptions}
                                styles={selectStyles}
                            />
                        </div>
                    )}
                </div>
                {selectedIds.length > 0 && (
                    <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-default)]">
                        {onBulkStatusUpdate && (
                            <div className="w-56">
                                <ClientSelect
                                    onChange={(selected: any) => {
                                        if (selected) {
                                            onBulkStatusUpdate(
                                                selectedIds,
                                                selected.value,
                                            );
                                            setSelectedIds([]);
                                            addToast(
                                                `Updated ${selectedIds.length} items`,
                                                "success",
                                            );
                                        }
                                    }}
                                    options={bulkStatusOptions}
                                    placeholder="Update Status"
                                    isClearable
                                    styles={statusSelectStyles}
                                />
                            </div>
                        )}
                        {onBulkDelete && (
                            <Button
                                variant="danger"
                                size="sm"
                                onClick={handleBulkDelete}
                                icon={<Trash2 className="size-4" />}
                            >
                                Delete ({selectedIds.length})
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-[var(--care-border)]">
                <table className="w-full text-left text-sm">
                    <thead className="bg-[var(--care-surface)] text-xs uppercase tracking-[0.12em] text-[var(--text-muted)]">
                        <tr>
                            <th className="px-4 py-3">
                                <Checkbox
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                    ariaLabel="Select all"
                                />
                            </th>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`px-5 py-3 font-semibold ${column.sortable !== false ? "cursor-pointer hover:text-[var(--text-primary)]" : ""}`}
                                    onClick={() =>
                                        column.sortable !== false &&
                                        handleSort(column.key)
                                    }
                                >
                                    <div className="flex items-center gap-2">
                                        {column.label}
                                        {column.sortable !== false &&
                                            sortBy === column.key && (
                                                <span className="text-[var(--care-primary)]">
                                                    {sortOrder === "asc" ? (
                                                        <ChevronUp className="size-4" />
                                                    ) : (
                                                        <ChevronDown className="size-4" />
                                                    )}
                                                </span>
                                            )}
                                    </div>
                                </th>
                            ))}
                            {(onEdit || onDelete) && (
                                <th className="px-5 py-3 text-right">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--table-divide)]">
                        {paginatedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="px-5 py-12 text-center"
                                >
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <CheckSquare className="size-12 text-[var(--text-muted)]" />
                                        <p className="text-sm text-[var(--text-muted)]">
                                            {emptyMessage}
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row) => {
                                const id = getRowId(row);
                                const isSelected = selectedIdSet.has(id);
                                return (
                                    <tr
                                        key={id}
                                        className="hover:bg-[var(--hover-bg)]"
                                        onClick={() => onRowClick?.(row)}
                                    >
                                        <td className="px-4 py-4">
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() =>
                                                    handleSelectRow(id)
                                                }
                                                ariaLabel={`Select row ${id}`}
                                            />
                                        </td>
                                        {columns.map((column) => (
                                            <td
                                                key={column.key}
                                                className="px-5 py-4"
                                            >
                                                {renderCell(row, column)}
                                            </td>
                                        ))}
                                        {(onEdit || onDelete) && (
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    {onEdit && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onEdit(row);
                                                            }}
                                                            icon={<Pencil className="size-4" />}
                                                            aria-label="Edit"
                                                        />
                                                    )}
                                                    {onDelete && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onDelete(id);
                                                            }}
                                                            icon={<Trash2 className="size-4 text-red-600" />}
                                                            aria-label="Delete"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-[var(--text-secondary)]">
                            Show
                        </span>
                        <div className="w-20">
                            <ClientSelect
                                value={{
                                    value: itemsPerPage.toString(),
                                    label: itemsPerPage.toString(),
                                }}
                                onChange={(selected: any) => {
                                    if (selected) {
                                        setItemsPerPage(Number(selected.value));
                                        setCurrentPage(1);
                                    }
                                }}
                                options={pageSizeOptions}
                                styles={compactSelectStyles}
                            />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">
                            of {sortedData.length} entries
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                            }
                            disabled={currentPage === 1}
                            icon={<ChevronLeft className="size-4" />}
                        >
                            Previous
                        </Button>
                        <span className="text-sm text-[var(--text-secondary)]">
                            Page {currentPage} of {totalPages}
                        </span>
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={() =>
                                setCurrentPage((p) =>
                                    Math.min(totalPages, p + 1),
                                )
                            }
                            disabled={currentPage === totalPages}
                            icon={<ChevronRight className="size-4" />}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}) as <T>(props: EnhancedDataTableProps<T>) => React.ReactElement;
