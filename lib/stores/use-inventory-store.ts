"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { InventoryItem } from "@/types";

type InventoryStore = {
  inventory: InventoryItem[];
  isLoading: boolean;
  searchQuery: string;
  filterStatus: string;
  filterCategory: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  selectedIds: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterCategory: (category: string) => void;
  setSortBy: (field: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  toggleSelectId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  addInventoryItem: (item: Omit<InventoryItem, "id">) => InventoryItem;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: InventoryItem["status"]) => void;
  getFilteredInventory: () => InventoryItem[];
  getPaginatedInventory: () => InventoryItem[];
};

export const useInventoryStore = create<InventoryStore>()(
  persist(
    (set, get) => ({
      inventory: [],
      isLoading: false,
      searchQuery: "",
      filterStatus: "all",
      filterCategory: "all",
      sortBy: "name",
      sortOrder: "asc",
      currentPage: 1,
      itemsPerPage: 10,
      selectedIds: [],

      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setFilterStatus: (status) => set({ filterStatus: status, currentPage: 1 }),
      setFilterCategory: (category) => set({ filterCategory: category, currentPage: 1 }),
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

      addInventoryItem: (itemData) => {
        const newItem: InventoryItem = {
          ...itemData,
          id: `INV-${Date.now()}`,
        };
        set((state) => ({
          inventory: [newItem, ...state.inventory],
        }));
        return newItem;
      },

      updateInventoryItem: (id, updates) =>
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      deleteInventoryItem: (id) =>
        set((state) => ({
          inventory: state.inventory.filter((item) => item.id !== id),
          selectedIds: state.selectedIds.filter((i) => i !== id),
        })),

      bulkDelete: (ids) =>
        set((state) => ({
          inventory: state.inventory.filter((item) => !ids.includes(item.id)),
          selectedIds: state.selectedIds.filter((i) => !ids.includes(i)),
        })),

      bulkUpdateStatus: (ids, status) =>
        set((state) => ({
          inventory: state.inventory.map((item) =>
            ids.includes(item.id) ? { ...item, status } : item
          ),
          selectedIds: [],
        })),

      getFilteredInventory: () => {
        const { inventory, searchQuery, filterStatus, filterCategory, sortBy, sortOrder } = get();
        let filtered = [...inventory];

        // Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (item) =>
              item.name.toLowerCase().includes(query) ||
              item.id.toLowerCase().includes(query) ||
              item.category.toLowerCase().includes(query)
          );
        }

        // Filter by status
        if (filterStatus !== "all") {
          filtered = filtered.filter((item) => item.status === filterStatus);
        }

        // Filter by category
        if (filterCategory !== "all") {
          filtered = filtered.filter((item) => item.category === filterCategory);
        }

        // Sort
        filtered.sort((a, b) => {
          const aVal = a[sortBy as keyof InventoryItem];
          const bVal = b[sortBy as keyof InventoryItem];
          if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
          if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getPaginatedInventory: () => {
        const { currentPage, itemsPerPage } = get();
        const filtered = get().getFilteredInventory();
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filtered.slice(start, end);
      },
    }),
    {
      name: "care-sync-inventory",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize with mock data if empty
export function initializeMockInventory() {
  const store = useInventoryStore.getState();
  if (store.inventory.length === 0) {
    const mockInventory: InventoryItem[] = [
      {
        id: "INV-001",
        name: "Paracetamol 500mg",
        category: "Pain Relief",
        stock: 1500,
        reorder: 500,
        unit: "tablets",
        expiry: "2027-03-15",
        status: "In stock",
      },
      {
        id: "INV-002",
        name: "Amoxicillin 250mg",
        category: "Antibiotics",
        stock: 120,
        reorder: 200,
        unit: "capsules",
        expiry: "2026-11-20",
        status: "Low stock",
      },
      {
        id: "INV-003",
        name: "Insulin Glargine",
        category: "Diabetes",
        stock: 45,
        reorder: 100,
        unit: "vials",
        expiry: "2026-09-10",
        status: "Critical",
      },
      {
        id: "INV-004",
        name: "Normal Saline 500ml",
        category: "IV Fluids",
        stock: 800,
        reorder: 300,
        unit: "bags",
        expiry: "2027-06-25",
        status: "In stock",
      },
      {
        id: "INV-005",
        name: "Masks N95",
        category: "PPE",
        stock: 2500,
        reorder: 1000,
        unit: "pieces",
        expiry: "2028-01-30",
        status: "In stock",
      },
    ];
    store.inventory = mockInventory;
  }
}
