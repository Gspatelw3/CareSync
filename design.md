# Care Sync Design Notes

## Overview

Care Sync is a hospital and clinic management application focused on authentication, operational dashboards, patient workflows, doctor scheduling, appointments, inpatient care, billing, laboratory requests, and pharmacy inventory.

## Tech Stack

- Next.js
- Tailwind CSS
- Shadcn/UI
- Lucide Icons

## Authentication

- Login
- Forgot Password
- OTP Verification

## Dashboard

- Total Patients
- Total Doctors
- Today's Appointments
- Available Beds
- Revenue Overview
- Recent Activities

## Patient Management

- Patient List
- Add Patient
- Patient Profile
- Medical History

## Doctor Management

- Doctor Directory
- Doctor Profile
- Schedule Management

## Appointment Management

- Calendar View
- Appointment List
- Book Appointment

## Inpatient Management

- Bed Allocation
- Ward Management
- Admission & Discharge

## Billing

- Invoice List
- Payment History
- Insurance Claims

## Laboratory

- Test Requests
- Reports

## Pharmacy

- Inventory
- Stock Alerts

## Folder Structure

```text
src/
├── app/
│   ├── dashboard/
│   ├── patients/
│   ├── doctors/
│   ├── appointments/
│   ├── billing/
│   ├── pharmacy/
│   └── settings/
│
├── components/
│   ├── layout/
│   ├── dashboard/
│   ├── tables/
│   ├── forms/
│   └── ui/
│
├── lib/
├── hooks/
├── types/
└── services/
```

## Navigation Model

- Primary navigation should expose Dashboard, Patients, Doctors, Appointments, Inpatient, Billing, Laboratory, Pharmacy, and Settings.
- Authentication routes should remain separate from the main application shell.
- Dashboard widgets should provide quick links into the related operational modules.

## Sidebar Menu

- 🏥 Dashboard
- 👨‍⚕️ Doctors
- 🧑 Patients
- 📅 Appointments
- 🛏 Beds
- 💊 Pharmacy
- 🧪 Laboratory
- 💰 Billing
- 📊 Reports
- ⚙️ Settings

## Design Direction

- Use a clean, clinical interface with high readability and fast scanning.
- Keep dashboards dense but organized, prioritizing operational clarity over decorative layouts.
- Use tables for lists, forms for creation and updates, and detail pages for profiles and histories.
- Surface critical states clearly, including stock alerts, available beds, pending payments, and today's appointments.
