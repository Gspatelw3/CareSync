"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Admission } from "@/types";

type AdmissionStore = {
  admissions: Admission[];
  isLoading: boolean;
  searchQuery: string;
  filterStatus: string;
  filterWard: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  selectedIds: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterWard: (ward: string) => void;
  setSortBy: (field: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  toggleSelectId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  addAdmission: (admission: Omit<Admission, "id">) => Admission;
  updateAdmission: (id: string, updates: Partial<Admission>) => void;
  deleteAdmission: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: Admission["status"]) => void;
  getFilteredAdmissions: () => Admission[];
  getPaginatedAdmissions: () => Admission[];
};

export const useAdmissionStore = create<AdmissionStore>()(
  persist(
    (set, get) => ({
      admissions: [],
      isLoading: false,
      searchQuery: "",
      filterStatus: "all",
      filterWard: "all",
      sortBy: "admitted",
      sortOrder: "desc",
      currentPage: 1,
      itemsPerPage: 10,
      selectedIds: [],

      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setFilterStatus: (status) => set({ filterStatus: status, currentPage: 1 }),
      setFilterWard: (ward) => set({ filterWard: ward, currentPage: 1 }),
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

      addAdmission: (admissionData) => {
        const newAdmission: Admission = {
          ...admissionData,
          id: `ADM-${Date.now()}`,
        };
        set((state) => ({
          admissions: [newAdmission, ...state.admissions],
        }));
        return newAdmission;
      },

      updateAdmission: (id, updates) =>
        set((state) => ({
          admissions: state.admissions.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      deleteAdmission: (id) =>
        set((state) => ({
          admissions: state.admissions.filter((a) => a.id !== id),
          selectedIds: state.selectedIds.filter((i) => i !== id),
        })),

      bulkDelete: (ids) =>
        set((state) => ({
          admissions: state.admissions.filter((a) => !ids.includes(a.id)),
          selectedIds: state.selectedIds.filter((i) => !ids.includes(i)),
        })),

      bulkUpdateStatus: (ids, status) =>
        set((state) => ({
          admissions: state.admissions.map((a) =>
            ids.includes(a.id) ? { ...a, status } : a
          ),
          selectedIds: [],
        })),

      getFilteredAdmissions: () => {
        const { admissions, searchQuery, filterStatus, filterWard, sortBy, sortOrder } = get();
        let filtered = [...admissions];

        // Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (a) =>
              a.patient.toLowerCase().includes(query) ||
              a.doctor.toLowerCase().includes(query) ||
              a.ward.toLowerCase().includes(query) ||
              a.diagnosis.toLowerCase().includes(query)
          );
        }

        // Filter by status
        if (filterStatus !== "all") {
          filtered = filtered.filter((a) => a.status === filterStatus);
        }

        // Filter by ward
        if (filterWard !== "all") {
          filtered = filtered.filter((a) => a.ward.toLowerCase() === filterWard.toLowerCase());
        }

        // Sort
        filtered.sort((a, b) => {
          const aVal = a[sortBy as keyof Admission];
          const bVal = b[sortBy as keyof Admission];
          if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
          if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getPaginatedAdmissions: () => {
        const { currentPage, itemsPerPage } = get();
        const filtered = get().getFilteredAdmissions();
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filtered.slice(start, end);
      },
    }),
    {
      name: "care-sync-admissions",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize with mock data if empty
export function initializeMockAdmissions() {
  const store = useAdmissionStore.getState();
  if (store.admissions.length === 0) {
    const mockAdmissions: Admission[] = [
      {
        id: "ADM-241",
        patient: "Vikram Singh",
        ward: "ICU",
        bed: "ICU-07",
        doctor: "Dr. Kavya Rao",
        admitted: "2026-06-14",
        diagnosis: "Myocardial infarction",
        status: "Critical",
      },
      {
        id: "ADM-240",
        patient: "Sita Verma",
        ward: "General A",
        bed: "GA-12",
        doctor: "Dr. Amina Khan",
        admitted: "2026-06-16",
        diagnosis: "Pneumonia",
        status: "Stable",
      },
      {
        id: "ADM-239",
        patient: "Lakshmi Nair",
        ward: "Maternity",
        bed: "MT-04",
        doctor: "Dr. Priya Mehta",
        admitted: "2026-06-17",
        diagnosis: "Antenatal monitoring",
        status: "Stable",
      },
      {
        id: "ADM-238",
        patient: "Rohan Das",
        ward: "General B",
        bed: "GB-08",
        doctor: "Dr. Amit Verma",
        admitted: "2026-06-16",
        diagnosis: "Migraine",
        status: "Observation",
      },
      {
        id: "ADM-237",
        patient: "Aisha Patel",
        ward: "Pediatrics",
        bed: "PD-03",
        doctor: "Dr. Sneha Kapoor",
        admitted: "2026-06-18",
        diagnosis: "Viral fever",
        status: "Recovering",
      },
      {
        id: "ADM-236",
        patient: "Mohan Das",
        ward: "Recovery",
        bed: "RC-02",
        doctor: "Dr. Neil Shah",
        admitted: "2026-06-15",
        diagnosis: "Post-surgery recovery",
        status: "Discharge soon",
      },
    ];
    store.admissions = mockAdmissions;
  }
}
