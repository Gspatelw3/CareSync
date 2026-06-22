# Care Sync — Documentation

> Hospital & Clinic Management Platform  
> Version 0.1.0 | June 2026

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Folder Structure](#folder-structure)
4. [Installation](#installation)
5. [Build & Deployment](#build--deployment)
6. [Customization Guide](#customization-guide)
7. [Component Guide](#component-guide)
8. [Theme Customization Guide](#theme-customization-guide)
9. [Dependency Explanation](#dependency-explanation)
10. [FAQ](#faq)

---

## Project Overview

Care Sync is a comprehensive frontend application for hospital and clinic operations management. It provides dashboards and interfaces for patient registration, doctor scheduling, appointments, inpatient bed tracking, pharmacy inventory, laboratory test requests, billing, and compliance reporting.

Built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS 4**, and **Lucide React** icons. All UI components are custom-built — no third-party component library is used.

### Who Is This For?

- **Hospital administrators** managing day-to-day clinical workflows
- **Doctors and nurses** tracking patients, appointments, and lab results
- **Pharmacy staff** monitoring medication inventory and dispensing
- **Billing teams** handling invoices and insurance claims
- **ThemeForest buyers** looking for a clean, well-documented hospital management template to customize and integrate with their own backend

### Key Highlights

- Fully responsive across mobile, tablet, laptop, and desktop
- Light and dark mode with comprehensive design tokens
- All colors controlled via CSS custom properties — change once, apply everywhere
- 10 functional modules: Dashboard, Doctors, Patients, Appointments, Beds, Pharmacy, Laboratory, Billing, Reports, Settings
- Custom form system with searchable selects, text areas, date pickers, and number inputs
- Toast notification system
- Mobile slide-in navigation with hamburger menu
- Entrance animations for authentication pages (respects `prefers-reduced-motion`)

---

## Features

### Authentication Module
- **Login page** with email/password validation
- **Forgot password** flow with email recovery
- **OTP verification** with 6-digit code input
- Branded split-screen layout with animated gradient panel
- Theme toggle (light/dark) on auth pages

### Dashboard
- Command center with KPI stat cards (patients, doctors, appointments, beds)
- Revenue overview bar chart (Mon–Sun)
- Critical alerts panel (payments, stock, lab reports)
- Today's appointments table with status badges
- Recent activities feed
- Quick-action buttons for booking appointments and adding patients

### Patient Management
- Patient registry with sortable table (ID, name, gender, age, contact, department, doctor, status, last visit)
- Color-coded status badges (Active, Discharged, ICU)
- Add patient form with personal info and medical details
- Search input
- KPI stats: total patients, new this week, ICU/critical, avg. stay

### Doctor Directory
- Doctor table with specialization, department, patient load, schedule, status, contact
- On duty / On leave status tracking
- Add doctor form with personal info, professional details, and schedule
- Search input
- KPI stats: total doctors, on duty, on leave, avg. patients/day

### Appointment Scheduling
- Today's schedule table with time, patient, care type, doctor, status
- Weekly volume bar chart
- Calendar view modal (month grid with appointment indicators)
- Book appointment form (patient, date, time, type, department, doctor)
- Quick stats: avg. consultation time, peak hour, no-show rate, reschedule requests
- KPI stats: today's appointments, checked in, cancelled, next week

### Inpatient / Bed Management
- Ward overview with occupancy progress bars (8 wards)
- Color-coded occupancy indicators (red >85%, amber >65%, mint <65%)
- Current admissions list with patient, ward, bed, diagnosis, status
- Filter wards modal (by type, occupancy, status)
- Allocate bed form (patient, ward, diagnosis, doctor)
- KPI stats: total beds, ICU beds, admissions today, avg. stay

### Pharmacy Inventory
- Medication inventory table with stock levels, reorder thresholds, expiry dates
- Status badges: In stock, Low stock, Critical
- Dispensing queue with patient, medication, quantity, prescribing doctor
- Update inventory form (add stock, reorder level, batch, expiry)
- Search input
- KPI stats: total items, pending dispensing, expiring soon, monthly dispensed

### Laboratory
- Test requests table sorted by priority (STAT, Urgent, Normal)
- Dual status tracking: priority badge + workflow status badge
- Department summary with test counts, pending counts, turnaround times
- Completion progress bars per department
- Filter by department/priority/status modal
- Create test request form (patient, doctor, test name, department, priority, notes)
- KPI stats: total requests, awaiting collection, in progress, reports ready

### Billing & Insurance
- Invoice table with service, amount, insurance, paid/balance amounts
- Payment status badges: Paid, Partial, Pending
- Insurance claims panel with patient, insurer, amount, review status
- Filter invoices modal (by status, date range, insurance provider)
- Create invoice form (patient, service, amount, insurance covered, provider)
- KPI stats: total revenue MTD, pending payments, insurance claims, collection rate

### Reports
- 4 report categories: Clinical, Financial, Operational, Compliance
- 48 total report templates (12 per category)
- Status badges: Generated, Draft, Auto-generated
- "View All" modal per category showing full report list
- Generate report form (category, report type, date range, format: PDF/Excel/CSV)
- Search input
- KPI stats: report templates, generated this week, pending drafts, scheduled reports

### Settings
- Hospital profile (name, registration, address, phone, email, license)
- Departments with department heads
- Notification rules (stock alerts, lab results, bed occupancy, payments, no-shows)
- Access control (administrators, doctors, nurses, lab, pharmacy, billing)
- Read-only informational display

---

## Folder Structure

```
care-sync/
├── app/                              # Next.js App Router pages
│   ├── layout.tsx                    # Root layout (providers, fonts, metadata)
│   ├── page.tsx                      # Redirects "/" → "/login"
│   ├── globals.css                   # Global styles, CSS variables, theme definitions
│   ├── not-found.tsx                 # Custom 404 page
│   ├── (auth)/                       # Route group for authentication pages
│   │   ├── layout.tsx                # Auth layout (pass-through)
│   │   ├── login/page.tsx            # Login form
│   │   ├── forgot-password/page.tsx  # Forgot password request
│   │   └── otp-verification/page.tsx # OTP code entry
│   ├── dashboard/page.tsx            # Main operational dashboard
│   ├── patients/page.tsx             # Patient registry + add form
│   ├── doctors/page.tsx              # Doctor directory + add form
│   ├── appointments/page.tsx         # Appointments list, calendar, booking
│   ├── inpatient/page.tsx            # Bed/ward management, admissions
│   ├── pharmacy/page.tsx             # Inventory, dispensing queue
│   ├── laboratory/page.tsx           # Test requests, department workload
│   ├── billing/page.tsx              # Invoices, insurance claims
│   ├── reports/page.tsx              # Report categories and generation
│   └── settings/page.tsx             # Hospital profile, access control
│
├── components/                       # Reusable React components
│   ├── auth/
│   │   └── auth-shell.tsx            # Split-screen layout for auth pages
│   ├── layout/
│   │   ├── app-sidebar.tsx           # Sidebar + mobile nav, theme toggle
│   │   ├── page-shell.tsx            # Standard page layout (sidebar + content)
│   │   └── add-patient-button.tsx    # "Add patient" button + modal wrapper
│   ├── ui/
│   │   ├── button.tsx                # Base button (primary/secondary/ghost/danger)
│   │   ├── card.tsx                  # Section card with title, description, action
│   │   ├── modal.tsx                 # Generic modal dialog (overlay + panel)
│   │   ├── action-modal.tsx          # Modal with form and confirm/cancel footer
│   │   ├── action-buttons.tsx        # ActionButton, SecondaryButton, ToastLink
│   │   ├── search-input.tsx          # Search input with search icon
│   │   ├── view-all-button.tsx       # "View all" button that opens a modal
│   │   └── forms/
│   │       └── form-field.tsx        # FormField (text/select/textarea/date/number)
│   │                                 # + FormSection wrapper
│   ├── data-display/
│   │   ├── data-table.tsx            # Standard table with header row
│   │   └── status-badge.tsx          # Colored status pill (default/warning/danger/info)
│   ├── charts/
│   │   └── bar-chart.tsx             # BarChart + CompactBarChart components
│   ├── patients/
│   │   └── add-patient-form.tsx      # Patient intake form fields
│   └── dashboard/                    # Reserved for dashboard-specific widgets
│
├── lib/                              # Utilities and providers
│   ├── theme-provider.tsx            # Light/dark theme context + toggle
│   ├── use-toast.tsx                 # Toast notification context
│   └── config.ts                     # Central application configuration
│
├── types/
│   └── index.ts                      # Shared TypeScript type definitions
│
├── public/
│   ├── caresync.svg                  # Care Sync logo/brand mark
│   └── ...                           # Default Next.js static assets
│
├── .env.example                      # Environment variables template
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration (Tailwind)
├── eslint.config.mjs                 # ESLint flat config
├── design.md                         # Design notes and specifications
├── DOCUMENTATION.md                  # This file
└── README.md                         # Developer-focused README
```

---

## Installation

### Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later

### Step 1: Clone or Extract

```bash
# If using Git
git clone <repo-url>
cd care-sync

# If using a ZIP download
unzip care-sync.zip
cd care-sync
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment

```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local to configure your settings
# (No configuration is required for basic use)
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- The root page `/` redirects to `/login`
- Enter any email and password (6+ characters) — authentication is simulated
- Click **Login** to access the Dashboard

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Build & Deployment

### Production Build

```bash
npm run build
npm run start
```

The production server will start on port 3000.

### Deploying to Vercel (Recommended)

1. Push the repository to GitHub/GitLab/Bitbucket
2. Import the project in [Vercel](https://vercel.com)
3. Vercel auto-detects Next.js and configures the build
4. Deploy — no additional configuration needed

### Deploying to Other Platforms

For Docker, AWS, DigitalOcean, or any Node.js hosting:

```bash
npm run build
npm run start
```

The built application is in the `.next/` directory.

---

## Customization Guide

### Quick Branding Changes

Edit `lib/config.ts` to customize the application branding without touching any component code:

```typescript
export const BRAND = {
  name: "Care Sync",                    // Change to your hospital name
  tagline: "Hospital and clinic...",    // Change the description
  hospitalName: "Care Sync Medical...", // Appears in Settings page
  phone: "+91 1800 420 4242",          // Your contact number
  email: "contact@caresync.health",    // Your contact email
  // ...
};
```

### Changing the Logo

1. Replace `public/caresync.svg` with your own SVG logo
2. Update the logo dimensions in `lib/config.ts`:
   ```typescript
   export const LOGO = {
     src: "/your-logo.svg",
     width: 180,
     height: 42,
     // ...
   };
   ```

### Modifying Navigation

Edit the `NAVIGATION_ITEMS` array in `lib/config.ts` to add, remove, or reorder sidebar items. Each item needs:
- `label`: Display text in sidebar
- `href`: Route path
- `icon`: Lucide icon name (must match a named export from `lucide-react`)

### Customizing Colors

All colors are defined as CSS custom properties in `app/globals.css`. See the [Theme Customization Guide](#theme-customization-guide) for details.

### Replacing Mock Data

All pages currently use hardcoded TypeScript arrays. To connect a real backend:

1. Create a `services/` directory with API client modules
2. Replace the hardcoded arrays with API calls (using `fetch`, axios, or TanStack Query)
3. The UI components (DataTable, StatusBadge, Card, etc.) are data-agnostic — they render whatever data you pass in

### Adding a New Page

1. Create a new directory under `app/` with a `page.tsx`
2. Use the standard page pattern:
   ```tsx
   import { PageShell, PageHeader, StatCard } from "@/components/layout/page-shell";
   
   export default function NewPage() {
     return (
       <PageShell activeHref="/new-route">
         <PageHeader
           eyebrow="Section Label"
           title="Page Title"
           description="Page description"
         />
         {/* Your content */}
       </PageShell>
     );
   }
   ```
3. Add the route to `NAVIGATION_ITEMS` in `lib/config.ts` and the icon mappings in `components/layout/app-sidebar.tsx`

---

## Component Guide

### Layout Components

#### `PageShell`
Wraps every main application page with sidebar + scrollable content area.

```tsx
<PageShell activeHref="/patients">
  {/* Page content */}
</PageShell>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `activeHref` | `string` | Yes | Current route path, used to highlight the active nav item |
| `children` | `ReactNode` | Yes | Page content |

#### `PageHeader`
Standard page header with eyebrow label, title, description, and optional action buttons.

```tsx
<PageHeader
  eyebrow="Patient Management"
  title="Patients"
  description="Patient registry, intake, profiles, and medical history."
  actions={
    <>
      <SearchInput placeholder="Search patients..." />
      <ActionModal trigger={...} title="Add Patient">...</ActionModal>
    </>
  }
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `eyebrow` | `string` | Yes | Uppercase section label |
| `title` | `string` | Yes | Page heading (h1) |
| `description` | `string` | Yes | Page description text |
| `actions` | `ReactNode` | No | Action buttons / search input area |

#### `StatCard`
KPI metric card used in stat rows across all pages.

```tsx
<StatCard
  label="Total Patients"
  value="12,486"
  delta="+8.2%"
  detail="358 active today"
  icon={<Users className="size-5" />}
  href="/patients"
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | Yes | Card label |
| `value` | `string` | Yes | Main metric value |
| `delta` | `string` | Yes | Change indicator text |
| `detail` | `string` | Yes | Additional detail text |
| `icon` | `ReactNode` | No | Icon displayed in top-right corner |
| `href` | `string` | No | If provided, makes the card a link |

### UI Components

#### `Button`

```tsx
<Button variant="primary" size="md">Click me</Button>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `"primary" \| "secondary" \| "ghost" \| "danger"` | `"primary"` | Button style variant |
| `size` | `"sm" \| "md" \| "lg" \| "link"` | `"md"` | Button size |
| `className` | `string` | — | Additional CSS classes |
| All standard `<button>` attributes are also supported |

#### `Card`
Section container with title, description, optional action, and content.

```tsx
<Card 
  title="Patient Registry" 
  description="All registered patients."
  action={<Link href="/patients">View all</Link>}
>
  {/* Card content (table, list, chart, etc.) */}
</Card>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Card heading |
| `description` | `string` | No | Subtitle text |
| `action` | `ReactNode` | No | Action element in header (e.g., "View all" link) |
| `children` | `ReactNode` | Yes | Card body content |

#### `Modal`
Base modal dialog with overlay, header, scrollable body, and optional footer.

```tsx
<Modal open={isOpen} onClose={() => setOpen(false)} title="My Modal">
  {/* Modal body content */}
</Modal>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `open` | `boolean` | Yes | Whether the modal is visible |
| `onClose` | `() => void` | Yes | Close handler (also closes on Escape) |
| `title` | `string` | Yes | Modal heading |
| `subtitle` | `string` | No | Subtitle text |
| `children` | `ReactNode` | Yes | Modal body content |
| `footer` | `ReactNode` | No | Sticky footer content |

#### `ActionModal`
Extends `Modal` with a form, submit button, and cancel button. Used for all create/edit/filter actions.

```tsx
<ActionModal
  title="Add Patient"
  subtitle="Register a new patient."
  confirmLabel="Add patient"
  trigger={<ActionButton icon={<Plus />}>Add patient</ActionButton>}
>
  <FormSection title="Personal Info">
    <FormField label="First name" />
    <FormField label="Last name" />
  </FormSection>
</ActionModal>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `trigger` | `ReactNode` | Yes | Element that opens the modal on click |
| `title` | `string` | Yes | Modal heading |
| `subtitle` | `string` | No | Subtitle text |
| `children` | `ReactNode` | Yes | Form fields inside the modal |
| `onConfirm` | `() => void` | No | Called on form submit |
| `confirmLabel` | `string` | No (default: `"Submit"`) | Text for the submit button |
| `open` | `boolean` | No | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | No | Controlled change handler |

#### `SearchInput`

```tsx
<SearchInput placeholder="Search patients..." />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `"Search..."` | Placeholder text |

#### `ViewAllButton`

```tsx
<ViewAllButton
  label="View all"
  title="Clinical Reports"
  subtitle="All clinical reports"
  reports={reportsArray}
/>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `label` | `string` | Yes | Button text |
| `title` | `string` | Yes | Modal heading |
| `subtitle` | `string` | Yes | Modal subtitle |
| `reports` | `{ name, period, updated, status }[]` | Yes | Array of report items |

### Data Display Components

#### `DataTable`

```tsx
<DataTable headers={["ID", "Name", "Status"]}>
  {items.map(item => (
    <tr key={item.id}>
      <td>{item.id}</td>
      <td>{item.name}</td>
      <td><StatusBadge>{item.status}</StatusBadge></td>
    </tr>
  ))}
</DataTable>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `headers` | `string[]` | Yes | Column header labels |
| `children` | `ReactNode` | Yes | `<tr>` elements for table rows |

#### `StatusBadge`

```tsx
<StatusBadge variant="warning">Pending</StatusBadge>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Yes | Badge text |
| `variant` | `"default" \| "warning" \| "danger" \| "info"` | `"default"` | Color variant |

### Form Components

#### `FormField`

```tsx
{/* Text input */}
<FormField label="First name" placeholder="e.g. Meera" />

{/* Select dropdown */}
<FormField
  label="Department"
  type="select"
  options={[
    { label: "Cardiology", value: "cardiology" },
    { label: "Orthopedics", value: "orthopedics" },
  ]}
/>

{/* Date input */}
<FormField label="Date" type="date" />

{/* Number input */}
<FormField label="Age" type="number" placeholder="e.g. 38" />

{/* Textarea */}
<FormField label="Notes" type="textarea" placeholder="..." />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | Yes | Field label |
| `value` | `string` | No | Initial value |
| `placeholder` | `string` | No | Placeholder text |
| `type` | `"text" \| "select" \| "textarea" \| "number" \| "date"` | `"text"` | Input type |
| `options` | `{ label, value }[]` | No | Required when `type="select"` |
| `onChange` | `(value: string) => void` | No | Change handler |

#### `FormSection`
Groups form fields under a section heading.

```tsx
<FormSection title="Personal Information">
  <FormField label="First name" />
  <FormField label="Last name" />
</FormSection>
```

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Section heading (rendered as uppercase) |
| `children` | `ReactNode` | Yes | Form fields |

### Chart Components

#### `BarChart`

```tsx
<BarChart data={[
  { label: "Mon", value: "$42k", height: "48%" },
  { label: "Tue", value: "$58k", height: "66%" },
]} />
```

Each bar's height is specified as a percentage string (e.g., `"48%"`).

#### `CompactBarChart`

```tsx
<CompactBarChart
  data={[
    { label: "Mon", value: 312 },
    { label: "Tue", value: 298 },
  ]}
  maxValue={360}
  unit=""
/>
```

Heights are calculated automatically as `(value / maxValue) * 100%`.

---

## Theme Customization Guide

### Color System Overview

Care Sync uses a comprehensive design token system with CSS custom properties. All colors are defined in `app/globals.css` under `:root` (light mode) and `.dark` (dark mode). Every component references these variables — **change a variable once, and it applies everywhere**.

### Brand Colors

| Variable | Purpose | Light Value | Dark Value |
|----------|---------|-------------|------------|
| `--care-primary` | Primary brand color (buttons, links, nav) | `#1a6fa8` | Inherits light |
| `--care-primary-dark` | Darker variant (hover states) | `#104d73` | Inherits light |
| `--care-primary-deep` | Deeper variant (auth panel bg) | `#0b3046` | Inherits light |
| `--care-secondary` | Secondary accent (teal/green) | `#0e8e72` | Inherits light |
| `--care-secondary-dark` | Darker secondary variant | `#0a6b56` | Inherits light |
| `--care-accent` | Muted blue accent | `#6b9eb8` | Inherits light |
| `--care-mint` | Soft mint green | `#7ddbba` | Inherits light |
| `--care-surface` | Page background | `#eef7fa` | `#151d2b` |
| `--care-border` | Default border color | `#bfdde9` | `#334155` |

### Semantic Tokens

| Token | Purpose | Light Value | Dark Value |
|-------|---------|-------------|------------|
| `--card-bg` | Card backgrounds | `#ffffff` | `#1e293b` |
| `--text-primary` | Headings, primary text | `#020617` | `#f1f5f9` |
| `--text-secondary` | Body text, table cells | `#334155` | `#cbd5e1` |
| `--text-muted` | Secondary info | `#475569` | `#94a3b8` |
| `--text-muted-light` | Subtle details | `#64748b` | `#64748b` |
| `--border-default` | Structural borders | `#e2e8f0` | `#334155` |
| `--border-light` | Subtle borders | `#f1f5f9` | `#1e293b` |
| `--hover-bg` | Row hover state | `#f8fafc` | `#334155` |
| `--hover-bg-strong` | Stronger hover state | `#f1f5f9` | `#475569` |
| `--table-divide` | Table row dividers | `#f1f5f9` | `#334155` |
| `--overlay-bg` | Modal backdrop | `rgba(0,0,0,0.4)` | `rgba(0,0,0,0.6)` |
| `--input-bg` | Input background | `#ffffff` | `#1e293b` |
| `--input-border` | Input border | `#e2e8f0` | `#334155` |
| `--input-text` | Input text color | `#0f172a` | `#f1f5f9` |
| `--input-placeholder` | Input placeholder | `#94a3b8` | `#64748b` |
| `--sidebar-bg` | Sidebar background | `#ffffff` | `#0f172a` |

### Badge Colors

| Token | Purpose | Light | Dark |
|-------|---------|-------|------|
| `--badge-warning-bg` | Warning badge background | `#fffbeb` | `#451a03` |
| `--badge-warning-text` | Warning badge text | `#b45309` | `#fbbf24` |
| `--badge-warning-ring` | Warning badge border | `#fde68a` | `#78350f` |
| `--badge-danger-bg` | Danger badge background | `#fef2f2` | `#450a0a` |
| `--badge-danger-text` | Danger badge text | `#b91c1c` | `#fca5a5` |
| `--badge-danger-ring` | Danger badge border | `#fecaca` | `#7f1d1d` |
| `--badge-info-bg` | Info badge background | `#eff6ff` | `#0c1929` |
| `--badge-info-text` | Info badge text | `#1d4ed8` | `#93c5fd` |
| `--badge-info-ring` | Info badge border | `#bfdbfe` | `#1e3a5f` |
| `--badge-default-bg` | Default badge bg | `#e4eef5` | `rgba(5,150,105,0.15)` |
| `--badge-default-text` | Default badge text | `#1a6fa8` | `#6ee7b7` |
| `--badge-default-ring` | Default badge border | `#bad4e5` | `rgba(5,150,105,0.4)` |

### How to Change the Color Scheme

Here are common color customization scenarios and exactly which variables to change:

**Scenario 1: "I want the primary color to be purple instead of blue"**

In `app/globals.css`, change these variables:
```css
--care-primary: #7c3aed;      /* Purple-600 */
--care-primary-dark: #6d28d9;  /* Purple-700 */
--care-primary-deep: #4c1d95;  /* Purple-900 */
--care-accent: #a78bfa;        /* Purple-400 */
--care-surface: #f5f3ff;       /* Purple-50 */
--care-border: #ddd6fe;        /* Purple-200 */
```

**Scenario 2: "I want a dark sidebar in light mode"**

In `:root`, change:
```css
--sidebar-bg: #1e293b;
```

**Scenario 3: "I want softer text colors"**

Increase the lightness of `--text-secondary` and `--text-muted` in `:root`.

### Typography

The application uses **Geist Sans** for body text and **Geist Mono** for monospace (OTP input). To change fonts:

1. Replace the font import in `app/layout.tsx`
2. Update `--font-sans` and `--font-mono` in the `@theme inline` block in `globals.css`

### Gradients

| Class | Description | CSS |
|-------|-------------|-----|
| `.care-brand-gradient` | Diagonal blue-to-teal | `linear-gradient(135deg, var(--care-primary), var(--care-secondary))` |
| `.care-brand-gradient-vertical` | Vertical blue-to-teal | `linear-gradient(180deg, var(--care-primary), var(--care-secondary))` |

### Dark Mode

Dark mode is automatically supported for all components that use CSS variables. The theme preference is persisted in `localStorage` under the key `care-sync-theme`. The theme provider also respects the system preference (`prefers-color-scheme: dark`).

To add dark mode support to a new component:
1. Always use `var(--your-token)` instead of hardcoded colors
2. Add a dark mode override in the `.dark {}` block in `globals.css`

---

## Dependency Explanation

| Package | Version | Purpose | Why This One? |
|---------|---------|---------|---------------|
| **next** | 16.2.9 | React framework with App Router, server components, routing | Industry standard for React apps; Vercel deployment; file-system routing |
| **react** | 19.2.4 | UI library | Latest stable React with improved performance and server components |
| **react-dom** | 19.2.4 | DOM renderer for React | Required by React for web rendering |
| **lucide-react** | ^1.21.0 | Icon library | Clean, consistent icons; tree-shakeable (only ships used icons); MIT licensed |
| **react-select** | ^5.10.2 | Searchable select dropdowns | The most popular React select component; supports theming; accessible |
| **tailwindcss** | ^5 | Utility-first CSS framework | No runtime CSS; design token system via CSS variables; responsive utilities |
| **@tailwindcss/postcss** | ^5 | Tailwind PostCSS plugin | Required for Tailwind CSS v4 integration with Next.js |
| **typescript** | ^5 | Type safety | Compile-time error checking; better IDE support; easier refactoring |
| **eslint** | ^9 | Code linting | Catches bugs and enforces code style |
| **eslint-config-next** | 16.2.9 | Next.js ESLint rules | Core Web Vitals + TypeScript rules for Next.js projects |
| **@types/react** | ^19 | React TypeScript types | Type definitions for React |
| **@types/react-dom** | ^19 | React DOM TypeScript types | Type definitions for React DOM |
| **@types/node** | ^20 | Node.js TypeScript types | Type definitions for Node.js APIs |

### Licensing

All dependencies are **MIT licensed** or have equivalent permissive licenses suitable for commercial redistribution:

- **next, react, react-dom**: MIT
- **lucide-react**: ISC (equivalent to MIT)
- **react-select**: MIT
- **tailwindcss**: MIT
- **typescript**: Apache 2.0
- **eslint**: MIT
- **Geist font**: SIL Open Font License (free for commercial use)

The Care Sync logo (`public/caresync.svg`) should be replaced with the buyer's own branding before redistribution.

---

## FAQ

### General

**Q: Is this a full-stack application?**
A: No. Care Sync is a frontend-only template with mock data. You need to connect your own backend API for data persistence and real authentication.

**Q: Can I use this for a real hospital?**
A: Yes, but you must integrate a secure backend with proper authentication, authorization, data validation, and HIPAA/GDPR compliance before using it in production.

**Q: Is this mobile-responsive?**
A: Yes. The sidebar collapses into a hamburger menu on screens below 1024px. Tables scroll horizontally. Stat cards stack vertically on mobile and display in grids on larger screens.

### Customization

**Q: How do I change the brand name "Care Sync" everywhere?**
A: Edit the `BRAND` object in `lib/config.ts`. This changes the name across the entire app.

**Q: How do I change the color scheme?**
A: Edit the CSS custom properties in `app/globals.css` under `:root` (light mode) and `.dark` (dark mode). See the [Theme Customization Guide](#theme-customization-guide).

**Q: How do I add a new page to the sidebar?**
A: See the [Customization Guide](#customization-guide) section on adding new pages.

**Q: How do I remove a module I don't need?**
A: Remove the item from `NAVIGATION_ITEMS` in `lib/config.ts` and delete the corresponding route directory under `app/`.

### Technical

**Q: Why are all colors written as `var(--something)` instead of Tailwind classes?**
A: This is intentional. Using CSS custom properties ensures consistent theming and automatic dark mode support. Change a color once in `globals.css`, and every component updates.

**Q: Why doesn't the search bar filter anything?**
A: Search functionality is not yet implemented. The `SearchInput` component renders a styled input but has no filtering logic attached. You'll need to wire it up to your data source.

**Q: Why do forms not actually save data?**
A: Form submissions currently close the modal but don't persist data. This is by design — the app is a frontend template. Connect your API to make forms functional.

**Q: Can I use a component library like Shadcn/UI with this?**
A: Yes, but you'd need to adapt the styling approach. Care Sync uses CSS custom properties extensively, while Shadcn/UI uses Tailwind config-based theming.

**Q: Why is there both a `components/charts/bar-chart.tsx` and inline bar charts in pages?**
A: The `BarChart` and `CompactBarChart` components exist but are not yet used — the dashboard and appointments pages render bar charts inline. This is a known inconsistency. Feel free to refactor to use the chart components.

**Q: Does this support IE11?**
A: No. The application targets modern browsers (Chrome, Firefox, Safari, Edge). CSS custom properties and other modern features are required.

**Q: How do I deploy this to a server that isn't Vercel?**
A: Run `npm run build` followed by `npm run start`. The app runs on port 3000 by default. You can use a process manager like PM2, or containerize with Docker.

---

*Documentation generated for Care Sync v0.1.0 — June 2026*