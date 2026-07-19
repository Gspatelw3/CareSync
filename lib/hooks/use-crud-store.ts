// ── Generic CRUD Store Factory ──
// Eliminates 90% duplication across all entity stores

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type SortOrder = "asc" | "desc";

export interface CrudState<T> {
  items: T[];
  isLoading: boolean;
  searchQuery: string;
  sortBy: string;
  sortOrder: SortOrder;
  currentPage: number;
  itemsPerPage: number;
  selectedIds: string[];
}

export interface CrudActions<T> {
  setSearchQuery: (query: string) => void;
  setSortBy: (field: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  toggleSelectId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  addItem: (item: Omit<T, "id">) => T;
  updateItem: (id: string, updates: Partial<T>) => void;
  deleteItem: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: <K extends keyof T>(ids: string[], field: K, value: T[K]) => void;
  getFilteredItems: (searchFields: (keyof T)[]) => T[];
  getPaginatedItems: () => T[];
}

export type CrudStore<T> = CrudState<T> & CrudActions<T>;

export function createCrudStore<T extends { id: string }>(
  initialState: CrudState<T>,
  storageName: string,
  searchFields: (keyof T)[],
  idPrefix: string
) {
  type StoreState = CrudState<T> & CrudActions<T>;

  return create<StoreState>()(
    persist(
      (set, get) => ({
        ...initialState,

        setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),

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

        addItem: (itemData) => {
          const newItem = { ...itemData, id: `${idPrefix}-${Date.now()}` } as T;
          set((state) => ({
            items: [newItem, ...state.items],
          }));
          return newItem;
        },

        updateItem: (id, updates) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
          })),

        deleteItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            selectedIds: state.selectedIds.filter((i) => i !== id),
          })),

        bulkDelete: (ids) =>
          set((state) => ({
            items: state.items.filter((item) => !ids.includes(item.id)),
            selectedIds: state.selectedIds.filter((i) => !ids.includes(i)),
          })),

        bulkUpdateStatus: (ids, field, value) =>
          set((state) => ({
            items: state.items.map((item) =>
              ids.includes(item.id) ? { ...item, [field]: value } : item
            ),
            selectedIds: [],
          })),

        getFilteredItems: () => {
          const { items, searchQuery, sortBy, sortOrder } = get();
          let filtered = [...items];

          // Search
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((item) =>
              searchFields.some((field) => {
                const value = item[field];
                return typeof value === "string" && value.toLowerCase().includes(query);
              })
            );
          }

          // Sort
          filtered.sort((a, b) => {
            const aVal = a[sortBy as keyof T];
            const bVal = b[sortBy as keyof T];
            if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
            if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
            return 0;
          });

          return filtered;
        },

        getPaginatedItems: () => {
          const { currentPage, itemsPerPage } = get();
          const filtered = get().getFilteredItems(searchFields);
          const start = (currentPage - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          return filtered.slice(start, end);
        },
      }),
      {
        name: storageName,
        storage: createJSONStorage(() => localStorage),
      }
    )
  );
}