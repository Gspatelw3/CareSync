"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { LabTestRequest } from "@/types";

type LabStore = {
  labTests: LabTestRequest[];
  isLoading: boolean;
  searchQuery: string;
  filterStatus: string;
  filterPriority: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  selectedIds: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterPriority: (priority: string) => void;
  setSortBy: (field: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  toggleSelectId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  addLabTest: (test: Omit<LabTestRequest, "id">) => LabTestRequest;
  updateLabTest: (id: string, updates: Partial<LabTestRequest>) => void;
  deleteLabTest: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: LabTestRequest["status"]) => void;
  getFilteredLabTests: () => LabTestRequest[];
  getPaginatedLabTests: () => LabTestRequest[];
};

// TODO: Replace LocalStorage with API calls to backend
// TODO: Connect to /api/laboratory/tests endpoint
// TODO: Add real-time lab result updates via WebSocket

export const useLabStore = create<LabStore>()(
  persist(
    (set, get) => ({
      labTests: [],
      isLoading: false,
      searchQuery: "",
      filterStatus: "all",
      filterPriority: "all",
      sortBy: "requested",
      sortOrder: "desc",
      currentPage: 1,
      itemsPerPage: 10,
      selectedIds: [],

      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setFilterStatus: (status) => set({ filterStatus: status, currentPage: 1 }),
      setFilterPriority: (priority) => set({ filterPriority: priority, currentPage: 1 }),
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

      addLabTest: (testData) => {
        const newTest: LabTestRequest = {
          ...testData,
          id: `LAB-${Date.now()}`,
        };
        set((state) => ({
          labTests: [newTest, ...state.labTests],
        }));
        return newTest;
      },

      updateLabTest: (id, updates) =>
        set((state) => ({
          labTests: state.labTests.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        })),

      deleteLabTest: (id) =>
        set((state) => ({
          labTests: state.labTests.filter((t) => t.id !== id),
          selectedIds: state.selectedIds.filter((i) => i !== id),
        })),

      bulkDelete: (ids) =>
        set((state) => ({
          labTests: state.labTests.filter((t) => !ids.includes(t.id)),
          selectedIds: state.selectedIds.filter((i) => !ids.includes(i)),
        })),

      bulkUpdateStatus: (ids, status) =>
        set((state) => ({
          labTests: state.labTests.map((t) =>
            ids.includes(t.id) ? { ...t, status } : t
          ),
          selectedIds: [],
        })),

      getFilteredLabTests: () => {
        const { labTests, searchQuery, filterStatus, filterPriority, sortBy, sortOrder } = get();
        let filtered = [...labTests];

        // Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.patient.toLowerCase().includes(query) ||
              t.doctor.toLowerCase().includes(query) ||
              t.test.toLowerCase().includes(query)
          );
        }

        // Filter by status
        if (filterStatus !== "all") {
          filtered = filtered.filter((t) => t.status === filterStatus);
        }

        // Filter by priority
        if (filterPriority !== "all") {
          filtered = filtered.filter((t) => t.priority === filterPriority);
        }

        // Sort
        filtered.sort((a, b) => {
          const aVal = a[sortBy as keyof LabTestRequest];
          const bVal = b[sortBy as keyof LabTestRequest];
          if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
          if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getPaginatedLabTests: () => {
        const { currentPage, itemsPerPage } = get();
        const filtered = get().getFilteredLabTests();
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filtered.slice(start, end);
      },
    }),
    {
      name: "care-sync-lab-tests",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize with mock data if empty
export function initializeMockLabTests() {
  const store = useLabStore.getState();
  if (store.labTests.length === 0) {
    const mockLabTests: LabTestRequest[] = [
      {
        id: "LAB-001",
        patient: "Vikram Singh",
        test: "Complete Blood Count",
        doctor: "Dr. Kavya Rao",
        requested: "2026-06-19",
        priority: "STAT",
        status: "In progress",
      },
      {
        id: "LAB-002",
        patient: "Sita Verma",
        test: "Chest X-Ray",
        doctor: "Dr. Amina Khan",
        requested: "2026-06-19",
        priority: "Urgent",
        status: "Awaiting sample",
      },
      {
        id: "LAB-003",
        patient: "Lakshmi Nair",
        test: "Blood Glucose",
        doctor: "Dr. Priya Mehta",
        requested: "2026-06-18",
        priority: "Normal",
        status: "Report ready",
      },
      {
        id: "LAB-004",
        patient: "Rohan Das",
        test: "MRI Brain",
        doctor: "Dr. Amit Verma",
        requested: "2026-06-18",
        priority: "Urgent",
        status: "In progress",
      },
      {
        id: "LAB-005",
        patient: "Aisha Patel",
        test: "Urine Culture",
        doctor: "Dr. Sneha Kapoor",
        requested: "2026-06-17",
        priority: "Normal",
        status: "Sample collected",
      },
    ];
    store.labTests = mockLabTests;
  }
}