# Care Sync Design Notes

## Overview

Care Sync is a hospital and clinic management application focused on authentication, operational dashboards, patient workflows, doctor scheduling, appointments, inpatient care, billing, laboratory requests, pharmacy inventory, reports, and settings.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Lucide Icons
- Custom UI components (no third-party component library)

## Design System

### Color Tokens

The application uses a comprehensive design token system with CSS custom properties (`--care-*` and semantic tokens). All colors support both light and dark modes via `.dark` class on `<html>`.

**Brand Colors:**
- `--care-primary`: Primary blue (#1a6fa8)
- `--care-primary-dark`: Darker blue (#104d73)
- `--care-primary-deep`: Deepest blue (#0b3046)
- `--care-secondary`: Teal/green (#0e8e72)
- `--care-secondary-dark`: Darker teal (#0a6b56)
- `--care-accent`: Muted blue (#6b9eb8)
- `--care-mint`: Soft mint green (#7ddbba)

**Surface & Border:**
- `--care-surface`: Light blue-gray (#eef7fa) / dark mode (#151d2b)
- `--care-border`: Light border (#bfdde9) / dark mode (#334155)

**Semantic Tokens (14 total covering text, surfaces, borders, badges, shadows, inputs):**

| Token | Purpose |
|---|---|
| `--text-primary` | Headings, primary content |
| `--text-secondary` | Body text, table cells |
| `--text-muted` | Descriptions, secondary info |
| `--text-muted-light` | Subtle details |
| `--text-muted-lighter` | Placeholder text |
| `--card-bg` | Card backgrounds |
| `--hover-bg` | Row hover states |
| `--table-divide` | Table row dividers |
| `--sidebar-bg` | Sidebar background |
| `--overlay-bg` | Modal/overlay backdrop |
| `--input-bg`, `--input-border`, `--input-text`, `--input-placeholder` | Form input states |
| `--border-default`, `--border-light` | Structural borders |
| `--shadow-card`, `--shadow-sidebar` | Shadow tokens |

**Badge Variants (text + background + ring for each):**
- `default`: Green/mint (active, on-duty, paid, generated, reviewed)
- `warning`: Amber (waiting, pending, low stock, on leave, draft)
- `danger`: Red (critical, ICU, overdue)
- `info`: Blue (checked in, discharge soon, auto-generated)

### Gradients

- `.care-brand-gradient`: Diagonal blue-to-teal gradient (135deg)
- `.care-brand-gradient-vertical`: Vertical blue-to-teal gradient (180deg)

### Typography

- Font: Geist Sans (via Next.js font loader)
- Monospace: Geist Mono
- Page headings: `text-3xl font-semibold`
- Eyebrow labels: `text-sm font-semibold uppercase tracking-[0.14em]`
- Body text: `text-sm`
- Table headers: `text-xs uppercase tracking-[0.12em] font-semibold`

### Dark Mode

Dark mode is fully supported with a theme toggle (Sun/Moon icons) in the sidebar. All 50+ CSS custom properties have dark mode overrides in the `.dark` class. The theme provider persists the user's preference.

### Scrollbar Styling

Custom thin scrollbar (6px) with `--care-border` colored thumb, consistent across WebKit and Firefox.

### Animations

- Auth panel: Fade + slide-up entrance (`auth-panel-in`, 650ms)
- Auth card: Fade + slight scale entrance (`auth-card-in`, 520ms, 120ms delay)
- Both respect `prefers-reduced-motion: reduce`

## Authentication

Auth routes are grouped under `(auth)/` and remain separate from the main application shell.

- **Login** (`/login`): Email + password form with branded left panel
- **Forgot Password** (`/forgot-password`): Email recovery flow
- **OTP Verification** (`/otp-verification`): 6-digit OTP input

Auth pages use a split layout: branded gradient panel (left) with hospital branding, and a white card (right) with the form. Both use entrance animations. The `AuthShell` component (`components/auth/auth-shell.tsx`) wraps each auth page.

## Application Shell

After authentication, all pages use the `PageShell` component which provides:

```
┌──────────┬──────────────────────────────────────┐
│          │                                      │
│ Sidebar  │         Page Content                 │
│ 280px    │         (scrollable)                 │
│ fixed    │                                      │
│          │                                      │
└──────────┴──────────────────────────────────────┘
```

- **Desktop**: Sidebar is fixed (280px) on the left, content scrolls on the right
- **Mobile** (< `lg` breakpoint): Top header bar with hamburger menu that opens a slide-in sidebar overlay, with close button, navigation, theme toggle, and logout

### Sidebar (`AppSidebar`)

The sidebar contains:

1. **Logo**: Care Sync SVG logo (linked to `/dashboard`)
2. **Navigation**: 10 items with Lucide icons, active state highlighting
3. **Theme toggle**: Sun/Moon icon button at the bottom
4. **Logout**: Red-highlighted link to `/login`
5. **Bed utilization widget**: Progress bar showing occupancy (77%), with helper text (only on desktop)

**Navigation Items (in order):**

| Label | Icon (Lucide) | Route |
|---|---|---|
| Dashboard | `Home` | `/dashboard` |
| Doctors | `UserPlus` | `/doctors` |
| Patients | `Users` | `/patients` |
| Appointments | `Calendar` | `/appointments` |
| Beds | `Bed` | `/inpatient` |
| Pharmacy | `Pill` | `/pharmacy` |
| Laboratory | `FlaskConical` | `/laboratory` |
| Billing | `Wallet` | `/billing` |
| Reports | `BarChart3` | `/reports` |
| Settings | `Settings` | `/settings` |

Active nav item receives `--care-surface` background and `--text-primary` text color. Inactive items use `--text-secondary` with hover effects.

### Page Header Pattern

Every page uses the `PageHeader` component with three required text elements:
1. **Eyebrow**: Uppercase, tracked-out, brand-colored label (e.g., "HOSPITAL COMMAND CENTER")
2. **Title**: Large heading (e.g., "Dashboard")
3. **Description**: Secondary text explaining the page's purpose

Optional `actions` slot in the top-right for buttons, search inputs, and modal triggers.

## Component Library

All components live in `components/` and are built from scratch with Tailwind CSS (no Shadcn/UI).

### Layout Components

| Component | Location | Purpose |
|---|---|---|
| `AppSidebar` | `components/layout/app-sidebar.tsx` | Desktop sidebar + mobile navigation |
| `PageShell` | `components/layout/page-shell.tsx` | Page wrapper with sidebar + content area |
| `PageHeader` | `components/layout/page-shell.tsx` | Page title, description, and action bar |
| `StatCard` | `components/layout/page-shell.tsx` | Metric card with icon, value, delta, and detail |
| `AddPatientButton` | `components/layout/add-patient-button.tsx` | Quick-add patient modal trigger |

### UI Components

| Component | Location | Purpose |
|---|---|---|
| `Button` | `components/ui/button.tsx` | Base button |
| `Card` | `components/ui/card.tsx` | Content card with title, description, and optional action |
| `ActionButton` | `components/ui/action-buttons.tsx` | Primary action button (brand-colored) |
| `SecondaryButton` | `components/ui/action-buttons.tsx` | Outline/secondary action button |
| `ActionModal` | `components/ui/action-modal.tsx` | Modal dialog with title, subtitle, submit button |
| `Modal` | `components/ui/modal.tsx` | Base modal component |
| `SearchInput` | `components/ui/search-input.tsx` | Search input with icon |
| `ViewAllButton` | `components/ui/view-all-button.tsx` | "View all" button that opens a modal with full list |

### Form Components

| Component | Location | Purpose |
|---|---|---|
| `FormField` | `components/ui/forms/form-field.tsx` | Form input supporting text, number, date, select, textarea types |
| `FormSection` | `components/ui/forms/form-field.tsx` | Grouped section within forms with a heading |
| `AddPatientForm` | `components/patients/add-patient-form.tsx` | Complete patient registration form |

### Data Display Components

| Component | Location | Purpose |
|---|---|---|
| `DataTable` | `components/data-display/data-table.tsx` | Table with header row and scrollable body |
| `StatusBadge` | `components/data-display/status-badge.tsx` | Status pill with variant support (default, warning, danger, info) |
| `BarChart` | `components/charts/bar-chart.tsx` | Vertical bar chart |

### Auth Components

| Component | Location | Purpose |
|---|---|---|
| `AuthShell` | `components/auth/auth-shell.tsx` | Branded auth page layout |

## Page Designs

### Dashboard (`/dashboard`)

The command center view with three sections:

1. **Stats Row (4 cards)**:
   - Total Patients (12,486, +8.2%)
   - Total Doctors (186, 42 on duty)
   - Today's Appointments (324, 71 pending)
   - Available Beds (58, 77% occupancy)

2. **Revenue + Alerts (2-column)**:
   - Revenue Overview: Vertical bar chart (Mon–Sun), weekly total $378k
   - Critical Alerts: Pending payments ($28.4k, amber), critical stock alerts (9 items, red), lab reports pending (31, blue)

3. **Appointments Table + Recent Activities (2-column)**:
   - Today's Appointments: 4-row table with Time, Patient, Care, Assigned to, Status
   - Recent Activities: 4 operational updates with mint dot indicators

### Doctors (`/doctors`)

1. **Stats Row**: Total Doctors (186), On Duty Now (42), On Leave (8), Avg. Patients/Day (24)
2. **Doctor Directory Table**: ID, Name, Specialization, Department, Patients, Schedule, Status, Contact
3. **Add Doctor Modal**: Personal info, professional details (specialization, department, license), schedule
4. **Search**: Search bar in the header

### Patients (`/patients`)

1. **Stats Row**: Total Patients (12,486), New This Week (147), ICU/Critical (23), Avg. Stay (4.2 days)
2. **Patient Registry Table**: ID, Name, Gender, Age, Contact, Department, Doctor, Status, Last Visit
3. **Add Patient Modal**: Full patient registration form via `AddPatientForm`
4. **Search**: Search bar in the header

### Appointments (`/appointments`)

1. **Stats Row**: Today's Appointments (324), Checked In (42), Cancelled Today (8), Next Week (418)
2. **Today's Schedule Table**: Time, Patient, Care, Doctor, Type, Status (10 rows)
3. **Side Column**:
   - Weekly Volume bar chart (Mon–Sun)
   - Quick Stats: Avg. consultation time (18 min), Peak hour (10:00–11:00), No-show rate (4.2%), Reschedule requests (12)
4. **Actions**:
   - Calendar View modal: June 2026 month grid with appointment dots
   - Book Appointment modal: Patient, date, time, type, department, doctor

### Inpatient / Beds (`/inpatient`)

1. **Stats Row**: Total Beds (174), ICU Beds (24), Admissions Today (7), Avg. Stay (5.8 days)
2. **Ward Overview**: Progress bars for 8 wards (ICU, Emergency, General A/B, Maternity, Pediatrics, Isolation, Recovery) with occupancy percentages, color-coded (red >85%, amber >65%, mint otherwise)
3. **Current Admissions**: Compact list with patient, ward, bed, diagnosis, status badge, and admission date
4. **Actions**: Filter wards modal, Allocate bed modal

### Pharmacy (`/pharmacy`)

1. **Stats Row**: Total Items (1,284), Pending Dispensing (18), Expiring < 6 mo (23), Monthly Dispensed (4,280)
2. **Inventory Table**: ID, Name, Category, Stock, Reorder At, Expiry, Status (10 items)
3. **Dispensing Queue**: Compact list of 5 pending/recent dispensations
4. **Actions**: Search inventory, Update inventory modal (add stock, reorder level, batch, expiry)

### Laboratory (`/laboratory`)

1. **Stats Row**: Total Requests (187), Awaiting Collection (24), In Progress (42), Reports Ready (28)
2. **Test Requests Table**: ID, Patient, Test, Doctor, Requested, Priority (STAT/Urgent/Normal), Status
3. **Department Summary**: 5 departments (Hematology, Microbiology, Biochemistry, Radiology, Pathology) with test counts, pending counts, turnaround times, and completion progress bars
4. **Actions**: Filter by department/priority/status modal, Create test request modal

### Billing (`/billing`)

1. **Stats Row**: Total Revenue MTD ($1.28M), Pending Payments ($48.6k), Insurance Claims (24), Avg. Collection Rate (87.3%)
2. **Invoices Table**: Invoice ID, Patient, Service, Amount, Insurance, Paid, Balance, Date, Status (8 rows)
3. **Insurance Claims**: Compact list of 5 claims with patient, insurer, amount, status
4. **Actions**: Filter by status/date/insurance modal, Create invoice modal

### Reports (`/reports`)

1. **Stats Row**: Report Templates (64), Generated This Week (18), Pending Drafts (7), Scheduled Reports (24)
2. **Report Categories (4 sections)**:
   - **Clinical Reports** (12 reports): Patient outcomes, diagnosis trends, treatment efficacy
   - **Financial Reports** (12 reports): Revenue summaries, billing trends, insurance analytics
   - **Operational Reports** (12 reports): Bed occupancy, staff allocation, workflow efficiency
   - **Compliance Reports** (12 reports): Regulatory filings, audit trails, quality metrics
3. Each category card shows 4 reports with name, period, updated date, and status badge (Generated/Draft/Auto-generated)
4. **"View All" modal** per category showing all 12 reports in that category
5. **Actions**: Search reports, Generate report modal (select category, report type, date range, format)

### Settings (`/settings`)

Read-only settings page showing current system configuration across 4 sections:

1. **Hospital Profile**: Name, registration number, address, phone, email, license type
2. **Departments**: 8 departments with their heads
3. **Notification Rules**: 5 alert rules (low stock, critical labs, bed occupancy, pending payments, appointment no-show)
4. **Access Control**: 6 role-based access levels with user counts

No edit functionality — purely informational display.

## Folder Structure

```
care-sync/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   ├── otp-verification/page.tsx
│   ├── dashboard/page.tsx
│   ├── doctors/page.tsx
│   ├── patients/page.tsx
│   ├── appointments/page.tsx
│   ├── inpatient/page.tsx
│   ├── pharmacy/page.tsx
│   ├── laboratory/page.tsx
│   ├── billing/page.tsx
│   ├── reports/page.tsx
│   ├── settings/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│
├── components/
│   ├── layout/
│   │   ├── app-sidebar.tsx
│   │   ├── page-shell.tsx
│   │   ├── add-patient-button.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── action-buttons.tsx
│   │   ├── action-modal.tsx
│   │   ├── search-input.tsx
│   │   ├── view-all-button.tsx
│   │   └── forms/
│   │       └── form-field.tsx
│   ├── data-display/
│   │   ├── data-table.tsx
│   │   └── status-badge.tsx
│   ├── charts/
│   │   └── bar-chart.tsx
│   ├── auth/
│   │   └── auth-shell.tsx
│   ├── patients/
│   │   └── add-patient-form.tsx
│   └── dashboard/          (reserved for future dashboard widgets)
│
├── lib/
│   ├── theme-provider.tsx
│   └── use-toast.tsx
│
├── public/
│   ├── caresync.svg
│   └── ... (Next.js boilerplate SVGs)
│
├── package.json
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── eslint.config.mjs
```

## Navigation Model

- Primary navigation exposes Dashboard, Doctors, Patients, Appointments, Beds (Inpatient), Pharmacy, Laboratory, Billing, Reports, and Settings via the sidebar.
- Authentication routes are grouped under the `(auth)` route group and are separate from the main application shell.
- The sidebar is always visible on desktop (≥1024px). On mobile, a hamburger menu opens a slide-in drawer.
- Dashboard widgets provide quick links into related operational modules via `StatCard` click-throughs.
- Bed utilization is surfaced directly in the sidebar as a persistent awareness widget.

## Design Direction

- Use a clean, clinical interface with high readability and fast scanning.
- Keep dashboards dense but organized, prioritizing operational clarity over decorative layouts.
- Use tables for lists, forms for creation and updates, and detail pages for profiles and histories.
- Surface critical states clearly using color-coded badges: red for critical/overdue, amber for pending/warning, blue for informational, green/mint for positive/active.
- Support both light and dark modes with full color token coverage.
- All interactive elements (buttons, nav items, table rows) have hover states for clarity.
- Modal dialogs are used for create/filter actions rather than navigating to separate pages, keeping the user in context.
- Forms are organized into `FormSection` groups with `FormField` inputs supporting text, number, date, select, and textarea types.