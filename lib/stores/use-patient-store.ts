"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Patient } from "@/types";

type PatientStore = {
  patients: Patient[];
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
  addPatient: (patient: Omit<Patient, "id">) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: Patient["status"]) => void;
  getFilteredPatients: () => Patient[];
  getPaginatedPatients: () => Patient[];
};

export const usePatientStore = create<PatientStore>()(
  persist(
    (set, get) => ({
      patients: [],
      isLoading: false,
      searchQuery: "",
      filterStatus: "all",
      sortBy: "lastVisit",
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

      addPatient: (patientData) => {
        const newPatient: Patient = {
          ...patientData,
          id: `P-${Date.now()}`,
        };
        set((state) => ({
          patients: [newPatient, ...state.patients],
        }));
        return newPatient;
      },

      updatePatient: (id, updates) =>
        set((state) => ({
          patients: state.patients.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deletePatient: (id) =>
        set((state) => ({
          patients: state.patients.filter((p) => p.id !== id),
          selectedIds: state.selectedIds.filter((i) => i !== id),
        })),

      bulkDelete: (ids) =>
        set((state) => ({
          patients: state.patients.filter((p) => !ids.includes(p.id)),
          selectedIds: state.selectedIds.filter((i) => !ids.includes(i)),
        })),

      bulkUpdateStatus: (ids, status) =>
        set((state) => ({
          patients: state.patients.map((p) =>
            ids.includes(p.id) ? { ...p, status } : p
          ),
          selectedIds: [],
        })),

      getFilteredPatients: () => {
        const { patients, searchQuery, filterStatus, sortBy, sortOrder } = get();
        let filtered = [...patients];

        // Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (p) =>
              p.name.toLowerCase().includes(query) ||
              p.id.toLowerCase().includes(query) ||
              p.doctor.toLowerCase().includes(query) ||
              p.department.toLowerCase().includes(query)
          );
        }

        // Filter
        if (filterStatus !== "all") {
          filtered = filtered.filter((p) => p.status === filterStatus);
        }

        // Sort
        filtered.sort((a, b) => {
          const aVal = a[sortBy as keyof Patient];
          const bVal = b[sortBy as keyof Patient];
          if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
          if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getPaginatedPatients: () => {
        const { currentPage, itemsPerPage } = get();
        const filtered = get().getFilteredPatients();
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filtered.slice(start, end);
      },
    }),
    {
      name: "care-sync-patients",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize with mock data if empty
export function initializeMockPatients() {
  const store = usePatientStore.getState();
  if (store.patients.length === 0) {
    const mockPatients: Patient[] = [
      {
        id: "P-1024",
        name: "Meera Iyer",
        gender: "F",
        age: 38,
        contact: "+91 98765 43210",
        department: "Cardiology",
        doctor: "Dr. Kavya Rao",
        status: "Active",
        lastVisit: "2026-06-19",
      },
      {
        id: "P-1023",
        name: "Arjun Menon",
        gender: "M",
        age: 52,
        contact: "+91 87654 32109",
        department: "Orthopedics",
        doctor: "Dr. Neil Shah",
        status: "Active",
        lastVisit: "2026-06-18",
      },
      {
        id: "P-1022",
        name: "Priya Nair",
        gender: "F",
        age: 29,
        contact: "+91 76543 21098",
        department: "General",
        doctor: "Dr. Amina Khan",
        status: "Discharged",
        lastVisit: "2026-06-17",
      },
      {
        id: "P-1021",
        name: "Rohan Das",
        gender: "M",
        age: 45,
        contact: "+91 65432 10987",
        department: "Neurology",
        doctor: "Dr. Amit Verma",
        status: "Active",
        lastVisit: "2026-06-16",
      },
      {
        id: "P-1020",
        name: "Sneha Patel",
        gender: "F",
        age: 34,
        contact: "+91 54321 09876",
        department: "Pediatrics",
        doctor: "Dr. Sneha Kapoor",
        status: "Active",
        lastVisit: "2026-06-15",
      },
      {
        id: "P-1019",
        name: "Vikram Singh",
        gender: "M",
        age: 61,
        contact: "+91 43210 98765",
        department: "Cardiology",
        doctor: "Dr. Kavya Rao",
        status: "ICU",
        lastVisit: "2026-06-14",
      },
      {
        id: "P-1018",
        name: "Anita Sharma",
        gender: "F",
        age: 27,
        contact: "+91 32109 87654",
        department: "Obstetrics",
        doctor: "Dr. Priya Mehta",
        status: "Discharged",
        lastVisit: "2026-06-13",
      },
      {
        id: "P-1017",
        name: "Deepak Kumar",
        gender: "M",
        age: 48,
        contact: "+91 21098 76543",
        department: "Orthopedics",
        doctor: "Dr. Neil Shah",
        status: "Active",
        lastVisit: "2026-06-12",
      },
    ];
    store.patients = mockPatients;
  }
}