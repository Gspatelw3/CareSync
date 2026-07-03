"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Invoice } from "@/types";

type BillingStore = {
  invoices: Invoice[];
  isLoading: boolean;
  searchQuery: string;
  filterStatus: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  selectedIds: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setSortBy: (field: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  toggleSelectId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  addInvoice: (invoice: Omit<Invoice, "id">) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: Invoice["status"]) => void;
  getFilteredInvoices: () => Invoice[];
  getPaginatedInvoices: () => Invoice[];
};

// TODO: Replace LocalStorage with API calls to backend
// TODO: Connect to /api/billing/invoices endpoint
// TODO: Integrate with payment gateway

export const useBillingStore = create<BillingStore>()(
  persist(
    (set, get) => ({
      invoices: [],
      isLoading: false,
      searchQuery: "",
      filterStatus: "all",
      sortBy: "date",
      sortOrder: "desc",
      currentPage: 1,
      itemsPerPage: 10,
      selectedIds: [],

      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setFilterStatus: (status) => set({ filterStatus: status, currentPage: 1 }),
      setSortBy: (field) =>
        set((state) => ({
          sortBy: field,
          sortOrder: state.sortBy === field && state.sortOrder === "asc" ? "desc" : "asc",
          currentPage: 1,
        })),
      setCurrentPage: (page) => set({ currentPage: page }),
      setItemsPerPage: (count) => set({ itemsPerPage: count, currentPage: 1 }),
      toggleSelectId: (id) =>
        set((state) => ({
          selectedIds: state.selectedIds.includes(id)
            ? state.selectedIds.filter((i) => i !== id)
            : [...state.selectedIds, id],
        })),
      selectAll: (ids) => set({ selectedIds: ids }),
      clearSelection: () => set({ selectedIds: [] }),

      addInvoice: (invoiceData) => {
        const newInvoice: Invoice = {
          ...invoiceData,
          id: `INV-${Date.now()}`,
        };
        set((state) => ({
          invoices: [newInvoice, ...state.invoices],
        }));
        return newInvoice;
      },

      updateInvoice: (id, updates) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            inv.id === id ? { ...inv, ...updates } : inv
          ),
        })),

      deleteInvoice: (id) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => inv.id !== id),
          selectedIds: state.selectedIds.filter((i) => i !== id),
        })),

      bulkDelete: (ids) =>
        set((state) => ({
          invoices: state.invoices.filter((inv) => !ids.includes(inv.id)),
          selectedIds: state.selectedIds.filter((i) => !ids.includes(i)),
        })),

      bulkUpdateStatus: (ids, status) =>
        set((state) => ({
          invoices: state.invoices.map((inv) =>
            ids.includes(inv.id) ? { ...inv, status } : inv
          ),
          selectedIds: [],
        })),

      getFilteredInvoices: () => {
        const { invoices, searchQuery, filterStatus, sortBy, sortOrder } = get();
        let filtered = [...invoices];

        // Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (inv) =>
              inv.patient.toLowerCase().includes(query) ||
              inv.id.toLowerCase().includes(query) ||
              inv.service.toLowerCase().includes(query)
          );
        }

        // Filter by status
        if (filterStatus !== "all") {
          filtered = filtered.filter((inv) => inv.status === filterStatus);
        }

        // Sort
        filtered.sort((a, b) => {
          const aVal = a[sortBy as keyof Invoice];
          const bVal = b[sortBy as keyof Invoice];
          if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
          if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getPaginatedInvoices: () => {
        const { currentPage, itemsPerPage } = get();
        const filtered = get().getFilteredInvoices();
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filtered.slice(start, end);
      },
    }),
    {
      name: "care-sync-invoices",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize with mock data if empty
export function initializeMockInvoices() {
  const store = useBillingStore.getState();
  if (store.invoices.length === 0) {
    const mockInvoices: Invoice[] = [
      {
        id: "INV-2026-001",
        patient: "Meera Iyer",
        service: "Cardiology Consultation + ECG",
        amount: "₹4,500",
        insurance: "Star Health",
        paid: "₹4,500",
        balance: "₹0",
        date: "2026-06-19",
        status: "Paid",
      },
      {
        id: "INV-2026-002",
        patient: "Arjun Menon",
        service: "Orthopedic Surgery",
        amount: "₹85,000",
        insurance: "HDFC Ergo",
        paid: "₹50,000",
        balance: "₹35,000",
        date: "2026-06-18",
        status: "Partial",
      },
      {
        id: "INV-2026-003",
        patient: "Priya Nair",
        service: "General Check-up",
        amount: "₹1,200",
        insurance: "None",
        paid: "₹0",
        balance: "₹1,200",
        date: "2026-06-19",
        status: "Pending",
      },
      {
        id: "INV-2026-004",
        patient: "Vikram Singh",
        service: "ICU Care (3 days)",
        amount: "₹45,000",
        insurance: "ICICI Lombard",
        paid: "₹45,000",
        balance: "₹0",
        date: "2026-06-17",
        status: "Paid",
      },
      {
        id: "INV-2026-005",
        patient: "Sneha Patel",
        service: "Pediatric Vaccination",
        amount: "₹2,800",
        insurance: "Star Health",
        paid: "₹1,400",
        balance: "₹1,400",
        date: "2026-06-19",
        status: "Partial",
      },
    ];
    store.invoices = mockInvoices;
  }
}