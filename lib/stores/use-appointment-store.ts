"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Appointment } from "@/types";

type AppointmentStore = {
  appointments: Appointment[];
  isLoading: boolean;
  searchQuery: string;
  filterStatus: string;
  filterType: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  currentPage: number;
  itemsPerPage: number;
  selectedIds: string[];

  // Actions
  setSearchQuery: (query: string) => void;
  setFilterStatus: (status: string) => void;
  setFilterType: (type: string) => void;
  setSortBy: (field: string) => void;
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (count: number) => void;
  toggleSelectId: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  addAppointment: (appointment: Omit<Appointment, "id">) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateStatus: (ids: string[], status: Appointment["status"]) => void;
  getFilteredAppointments: () => Appointment[];
  getPaginatedAppointments: () => Appointment[];
};

export const useAppointmentStore = create<AppointmentStore>()(
  persist(
    (set, get) => ({
      appointments: [],
      isLoading: false,
      searchQuery: "",
      filterStatus: "all",
      filterType: "all",
      sortBy: "time",
      sortOrder: "asc",
      currentPage: 1,
      itemsPerPage: 10,
      selectedIds: [],

      setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
      setFilterStatus: (status) => set({ filterStatus: status, currentPage: 1 }),
      setFilterType: (type) => set({ filterType: type, currentPage: 1 }),
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

      addAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: `APT-${Date.now()}`,
        };
        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }));
        return newAppointment;
      },

      updateAppointment: (id, updates) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => a.id !== id),
          selectedIds: state.selectedIds.filter((i) => i !== id),
        })),

      bulkDelete: (ids) =>
        set((state) => ({
          appointments: state.appointments.filter((a) => !ids.includes(a.id)),
          selectedIds: state.selectedIds.filter((i) => !ids.includes(i)),
        })),

      bulkUpdateStatus: (ids, status) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            ids.includes(a.id) ? { ...a, status } : a
          ),
          selectedIds: [],
        })),

      getFilteredAppointments: () => {
        const { appointments, searchQuery, filterStatus, filterType, sortBy, sortOrder } = get();
        let filtered = [...appointments];

        // Search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (a) =>
              a.patient.toLowerCase().includes(query) ||
              a.doctor.toLowerCase().includes(query) ||
              a.care.toLowerCase().includes(query) ||
              a.type.toLowerCase().includes(query)
          );
        }

        // Filter by status
        if (filterStatus !== "all") {
          filtered = filtered.filter((a) => a.status === filterStatus);
        }

        // Filter by type
        if (filterType !== "all") {
          filtered = filtered.filter((a) => a.type === filterType);
        }

        // Sort
        filtered.sort((a, b) => {
          const aVal = a[sortBy as keyof Appointment];
          const bVal = b[sortBy as keyof Appointment];
          if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
          if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
          return 0;
        });

        return filtered;
      },

      getPaginatedAppointments: () => {
        const { currentPage, itemsPerPage } = get();
        const filtered = get().getFilteredAppointments();
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return filtered.slice(start, end);
      },
    }),
    {
      name: "care-sync-appointments",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Initialize with mock data if empty
export function initializeMockAppointments() {
  const store = useAppointmentStore.getState();
  if (store.appointments.length === 0) {
    const mockAppointments: Appointment[] = [
      {
        id: "APT-001",
        time: "09:00",
        patient: "Ravi Kumar",
        care: "Cardiology",
        doctor: "Dr. Kavya Rao",
        type: "Follow-up",
        status: "Checked in",
      },
      {
        id: "APT-002",
        time: "09:30",
        patient: "Neha Joshi",
        care: "Dermatology",
        doctor: "Dr. Sunita Reddy",
        type: "Consultation",
        status: "Waiting",
      },
      {
        id: "APT-003",
        time: "10:00",
        patient: "Mohan Das",
        care: "Orthopedics",
        doctor: "Dr. Neil Shah",
        type: "Surgery prep",
        status: "Confirmed",
      },
      {
        id: "APT-004",
        time: "10:30",
        patient: "Sita Verma",
        care: "General",
        doctor: "Dr. Amina Khan",
        type: "Check-up",
        status: "Checked in",
      },
      {
        id: "APT-005",
        time: "11:00",
        patient: "Aisha Patel",
        care: "Pediatrics",
        doctor: "Dr. Sneha Kapoor",
        type: "Vaccination",
        status: "Waiting",
      },
      {
        id: "APT-006",
        time: "11:30",
        patient: "Vikram Singh",
        care: "Neurology",
        doctor: "Dr. Amit Verma",
        type: "Follow-up",
        status: "Confirmed",
      },
      {
        id: "APT-007",
        time: "13:00",
        patient: "Lakshmi Nair",
        care: "Obstetrics",
        doctor: "Dr. Priya Mehta",
        type: "Check-up",
        status: "Confirmed",
      },
      {
        id: "APT-008",
        time: "14:00",
        patient: "Deepak Kumar",
        care: "Orthopedics",
        doctor: "Dr. Neil Shah",
        type: "Physiotherapy",
        status: "Sample due",
      },
      {
        id: "APT-009",
        time: "15:00",
        patient: "Priya Iyer",
        care: "Cardiology",
        doctor: "Dr. Kavya Rao",
        type: "ECG",
        status: "Confirmed",
      },
      {
        id: "APT-010",
        time: "16:00",
        patient: "Arun Mehta",
        care: "Pulmonology",
        doctor: "Dr. Rajesh Gupta",
        type: "Consultation",
        status: "Waiting",
      },
    ];
    store.appointments = mockAppointments;
  }
}
