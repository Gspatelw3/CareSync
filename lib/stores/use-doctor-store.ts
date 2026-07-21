"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Doctor } from "@/types";

type DoctorStore = {
  doctors: Doctor[];
  isLoading: boolean;
  searchQuery: string;
  filterStatus: string;
  filterDepartment: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  selectedIds: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterDepartment: (dept: string) => void;
  setSortBy: (field: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  toggleSelectId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  addDoctor: (doctor: Omit<Doctor, "id">) => Doctor;
  updateDoctor: (id: string, updates: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: Doctor["status"]) => void;
  getFilteredDoctors: () => Doctor[];
  getPaginatedDoctors: () => Doctor[];
};

export const useDoctorStore = create<DoctorStore>()(
  persist(
    (set, get) => ({
      doctors: [],
      isLoading: false,
      searchQuery: "",
      filterStatus: "all",
      filterDepartment: "all",
      sortBy: "name",
      sortOrder: "asc",
      currentPage: 1,
      itemsPerPage: 10,
      selectedIds: [],

      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setFilterStatus: (status) => set({ filterStatus: status, currentPage: 1 }),
      setFilterDepartment: (dept) => set({ filterDepartment: dept, currentPage: 1 }),
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

      addDoctor: (doctorData) => {
        const newDoctor: Doctor = {
          ...doctorData,
          id: `D-${Date.now()}`,
        };
        set((state) => ({
          doctors: [newDoctor, ...state.doctors],
        }));
        return newDoctor;
      },

      updateDoctor: (id, updates) =>
        set((state) => ({
          doctors: state.doctors.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),

      deleteDoctor: (id) =>
        set((state) => ({
          doctors: state.doctors.filter((d) => d.id !== id),
          selectedIds: state.selectedIds.filter((i) => i !== id),
        })),

      bulkDelete: (ids) =>
        set((state) => ({
          doctors: state.doctors.filter((d) => !ids.includes(d.id)),
          selectedIds: state.selectedIds.filter((i) => !ids.includes(i)),
        })),

      bulkUpdateStatus: (ids, status) =>
        set((state) => ({
          doctors: state.doctors.map((d) =>
            ids.includes(d.id) ? { ...d, status } : d
          ),
          selectedIds: [],
        })),

      getFilteredDoctors: () => {
        const { doctors, searchQuery, filterStatus, filterDepartment, sortBy, sortOrder } = get();
        let filtered = [...doctors];

        // Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (d) =>
              d.name.toLowerCase().includes(query) ||
              d.id.toLowerCase().includes(query) ||
              d.specialization.toLowerCase().includes(query) ||
              d.department.toLowerCase().includes(query)
          );
        }

        // Filter by status
        if (filterStatus !== "all") {
          filtered = filtered.filter((d) => d.status === filterStatus);
        }

        // Filter by department
        if (filterDepartment !== "all") {
          filtered = filtered.filter((d) => d.department === filterDepartment);
        }

        // Sort
        filtered.sort((a, b) => {
          const aVal = a[sortBy as keyof Doctor];
          const bVal = b[sortBy as keyof Doctor];
          if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
          if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getPaginatedDoctors: () => {
        const { currentPage, itemsPerPage } = get();
        const filtered = get().getFilteredDoctors();
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filtered.slice(start, end);
      },
    }),
    {
      name: "care-sync-doctors",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize with mock data if empty
export function initializeMockDoctors() {
  const store = useDoctorStore.getState();
  if (store.doctors.length === 0) {
    const mockDoctors: Doctor[] = [
      {
        id: "D-042",
        name: "Dr. Kavya Rao",
        specialization: "Cardiology",
        department: "Cardiology",
        patients: 184,
        schedule: "Mon–Fri 9 AM–5 PM",
        status: "On duty",
        phone: "+91 99887 76655",
        email: "kavya.rao@caresync.com",
      },
      {
        id: "D-041",
        name: "Dr. Neil Shah",
        specialization: "Orthopedics",
        department: "Orthopedics",
        patients: 127,
        schedule: "Mon–Sat 10 AM–6 PM",
        status: "On duty",
        phone: "+91 88776 65544",
        email: "neil.shah@caresync.com",
      },
      {
        id: "D-040",
        name: "Dr. Amina Khan",
        specialization: "General Medicine",
        department: "General",
        patients: 210,
        schedule: "Mon–Fri 8 AM–4 PM",
        status: "On duty",
        phone: "+91 77665 54433",
        email: "amina.khan@caresync.com",
      },
      {
        id: "D-039",
        name: "Dr. Amit Verma",
        specialization: "Neurology",
        department: "Neurology",
        patients: 96,
        schedule: "Tue–Sat 10 AM–7 PM",
        status: "On leave",
        phone: "+91 66554 43322",
        email: "amit.verma@caresync.com",
      },
      {
        id: "D-038",
        name: "Dr. Sneha Kapoor",
        specialization: "Pediatrics",
        department: "Pediatrics",
        patients: 152,
        schedule: "Mon–Fri 9 AM–5 PM",
        status: "On duty",
        phone: "+91 55443 32211",
        email: "sneha.kapoor@caresync.com",
      },
      {
        id: "D-037",
        name: "Dr. Priya Mehta",
        specialization: "Obstetrics",
        department: "Obstetrics",
        patients: 138,
        schedule: "Mon–Sat 9 AM–4 PM",
        status: "On duty",
        phone: "+91 44332 21100",
        email: "priya.mehta@caresync.com",
      },
      {
        id: "D-036",
        name: "Dr. Rajesh Gupta",
        specialization: "Pulmonology",
        department: "Respiratory",
        patients: 74,
        schedule: "Wed–Sun 10 AM–6 PM",
        status: "On duty",
        phone: "+91 33221 10099",
        email: "rajesh.gupta@caresync.com",
      },
      {
        id: "D-035",
        name: "Dr. Sunita Reddy",
        specialization: "Dermatology",
        department: "Dermatology",
        patients: 89,
        schedule: "Mon–Fri 11 AM–7 PM",
        status: "On leave",
        phone: "+91 22110 09988",
        email: "sunita.reddy@caresync.com",
      },
    ];
    store.doctors = mockDoctors;
  }
}
