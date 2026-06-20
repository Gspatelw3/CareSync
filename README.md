# Care Sync — Hospital & Clinic Management Platform

A comprehensive frontend application for hospital operations management, covering patient registration, doctor scheduling, appointments, inpatient bed tracking, pharmacy inventory, laboratory test requests, billing, and compliance reporting.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Quick Start](#quick-start)
4. [Folder & File Structure](#folder--file-structure)
5. [Application Architecture](#application-architecture)
6. [Routing & Page Organization](#routing--page-organization)
7. [Component Hierarchy](#component-hierarchy)
8. [State Management](#state-management)
9. [Styling Approach](#styling-approach)
10. [Custom Hooks & Utilities](#custom-hooks--utilities)
11. [Shared Modules & Reusable Components](#shared-modules--reusable-components)
12. [Authentication Flow](#authentication-flow)
13. [API Integration & Data Patterns](#api-integration--data-patterns)
14. [Environment Variables](#environment-variables)
15. [Development Workflow](#development-workflow)
16. [Build & Deployment](#build--deployment)
17. [Naming Conventions & Coding Standards](#naming-conventions--coding-standards)
18. [Common Patterns & Best Practices](#common-patterns--best-practices)
19. [Potential Confusion Points for New Developers](#potential-confusion-points-for-new-developers)
20. [Areas for Improvement](#areas-for-improvement)

---

## Project Overview

Care Sync is a frontend web application designed for hospital administrators, clinicians, and staff to manage day-to-day operations. It provides dashboards and CRUD interfaces for:

- **Patient Management** — registry, intake forms, and visit history
- **Doctor Directory** — profiles, specialization tracking, and schedule management
- **Appointment Scheduling** — calendar views, booking, and check-in tracking
- **Inpatient/Bed Management** — ward occupancy, bed allocation, and admissions
- **Pharmacy Inventory** — medication stock levels, dispensing queues, and reorder alerts
- **Laboratory** — test request creation, sample tracking, and report status
- **Billing & Insurance** — invoice generation, payment tracking, and claims
- **Reports** — clinical, financial, operational, and compliance reports
- **Settings** — hospital profile, departments, notification rules, and access control

> **Current State**: The application uses hardcoded mock data across all pages. No backend API or database integration has been implemented yet. Authentication forms exist but do not perform real validation against any service.

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| **Framework** | [Next.js](https://nextjs.org) (App Router) | 16.2.9 |
| **UI Library** | [React](https://react.dev) | 19.2.4 |
| **Language** | [TypeScript](https://www.typescriptlang.org) | 5.x |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | 4.x |
| **Icons** | [Lucide React](https://lucide.dev) | 1.21.0 |
| **Select Component** | [react-select](https://react-select.com) | 5.10.2 |
| **Font** | [Geist](https://vercel.com/font) | (via next/font) |
| **Linting** | [ESLint](https://eslint.org) | 9.x |
| **Package Manager** | npm | — |

### Key Dependencies Explained

- **`lucide-react`**: The sole icon library. Every icon used in the app comes from here. Icons are imported individually for tree-shaking.
- **`react-select`**: Used for all `<select>` dropdowns in forms. Provides searchable, styled select inputs with light/dark theme support.
- **`next/font`**: The `Geist` and `Geist_Mono` fonts are loaded with `next/font/google`, providing automatic optimization.

No state management library (Redux, Zustand, etc.) or UI component library (besides Tailwind) is used.

---

## Quick Start

### Prerequisites

- **Node.js** 18.x or later
- **npm** 9.x or later

### Setup

```bash
# Clone the repository
git clone <repo-url>
cd care-sync

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- The root page `/` redirects to `/login`.
- Enter any email and password (6+ characters) and click **Continue** — authentication is simulated.
- You will land on the **Dashboard** at `/dashboard`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Next.js development server with Turbopack |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint across the project |

---

## Folder & File Structure

```
care-sync/
├── app/                              # Next.js App Router pages
│   ├── layout.tsx                    # Root layout (providers, fonts, metadata)
│   ├── page.tsx                      # Redirects "/" → "/login"
│   ├── globals.css                   # Global styles, CSS variables, theme definitions
│   ├── favicon.ico
│   ├── (auth)/                       # Route group for authentication pages
│   │   ├── layout.tsx                # Auth layout (pass-through)
│   │   ├── login/
│   │   │   └── page.tsx              # Login form
│   │   ├── forgot-password/
│   │   │   └── page.tsx              # Forgot password request form
│   │   └── otp-verification/
│   │       └── page.tsx              # OTP code entry form
│   ├── dashboard/
│   │   └── page.tsx                  # Main operational dashboard
│   ├── patients/
│   │   └── page.tsx                  # Patient registry + add form
│   ├── doctors/
│   │   └── page.tsx                  # Doctor directory + add form
│   ├── appointments/
│   │   └── page.tsx                  # Appointments list, calendar, booking
│   ├── inpatient/
│   │   └── page.tsx                  # Bed/ward management, admissions
│   ├── pharmacy/
│   │   └── page.tsx                  # Inventory, dispensing queue
│   ├── laboratory/
│   │   └── page.tsx                  # Test requests, department workload
│   ├── billing/
│   │   └── page.tsx                  # Invoices, insurance claims
│   ├── reports/
│   │   └── page.tsx                  # Report categories and generation
│   └── settings/
│       └── page.tsx                  # Hospital profile, access control
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
│   └── dashboard/                    # Empty — reserved for dashboard widgets
│
├── lib/                              # Utilities and providers
│   ├── theme-provider.tsx            # Light/dark theme context + toggle
│   └── use-toast.tsx                 # Toast notification context
│
├── public/                           # Static assets
│   ├── caresync.svg                  # Care Sync logo/brand mark
│   └── ...                           # Default Next.js/Vercel placeholder SVGs
│
├── package.json                      # Dependencies and scripts
├── tsconfig.json                     # TypeScript configuration
├── next.config.ts                    # Next.js configuration
├── postcss.config.mjs                # PostCSS configuration (Tailwind)
├── eslint.config.mjs                 # ESLint flat config
├── .gitignore
├── design.md                         # Original design notes/spec
├── AGENTS.md                         # Empty file
└── CLAUDE.md                         # References AGENTS.md
```

---

## Application Architecture

### High-Level Data Flow

```
User Browser
    │
    ▼
┌─────────────────────────────────────────┐
│         Next.js 16 App Router            │
│                                          │
│  ┌──────────┐  ┌──────────────────────┐ │
│  │ Auth Pages│  │   Main App Pages     │ │
│  │ (no shell)│  │  (PageShell wrapper) │ │
│  └──────────┘  └──────────┬───────────┘ │
│                            │              │
│                    ┌───────▼───────────┐ │
│                    │   AppSidebar       │ │
│                    │ (desktop + mobile) │ │
│                    └───────────────────┘ │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │        Shared Components            │ │
│  │  PageHeader, StatCard, Card,        │ │
│  │  DataTable, StatusBadge, Modal,     │ │
│  │  ActionModal, FormField, Charts     │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  ┌─────────────────────────────────────┐ │
│  │         Context Providers           │ │
│  │   ThemeProvider (light/dark)        │ │
│  │   ToastProvider (notifications)     │ │
│  └─────────────────────────────────────┘ │
│                                          │
│  All data is currently hardcoded         │
│  mock data within each page file.        │
│  No API calls or data fetching.         │
└─────────────────────────────────────────┘
```

### Page Shell Pattern

Every main application page (non-auth) follows this structure:

```
┌──────────────────────────────────────────┐
│  PageShell (sidebar + scrollable area)   │
│  ┌──────────┬───────────────────────────┐│
│  │          │  PageHeader                ││
│  │ Sidebar  │  ├─ eyebrow (section label)││
│  │ (280px)  │  ├─ title (h1)             ││
│  │          │  ├─ description            ││
│  │          │  └─ actions (search + btns)││
│  │          │                            ││
│  │          │  StatCards (2×2 or 4-col)  ││
│  │          │                            ││
│  │          │  Data Section              ││
│  │          │  ├─ Card + DataTable       ││
│  │          │  └─ Card + List/Charts     ││
│  └──────────┴───────────────────────────┘│
└──────────────────────────────────────────┘
```

**Exception**: The Dashboard page does _not_ use `PageShell`. It manually constructs the sidebar + scrollable area layout inline. This is a known inconsistency.

---

## Routing & Page Organization

Care Sync uses the Next.js **App Router** with file-system based routing.

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Redirects to `/login` |
| `/login` | `app/(auth)/login/page.tsx` | User login form |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | Password recovery request |
| `/otp-verification` | `app/(auth)/otp-verification/page.tsx` | OTP code entry |
| `/dashboard` | `app/dashboard/page.tsx` | Main operational dashboard |
| `/patients` | `app/patients/page.tsx` | Patient registry |
| `/doctors` | `app/doctors/page.tsx` | Doctor directory |
| `/appointments` | `app/appointments/page.tsx` | Appointment management |
| `/inpatient` | `app/inpatient/page.tsx` | Bed & ward management |
| `/pharmacy` | `app/pharmacy/page.tsx` | Medication inventory |
| `/laboratory` | `app/laboratory/page.tsx` | Lab test requests |
| `/billing` | `app/billing/page.tsx` | Billing & insurance |
| `/reports` | `app/reports/page.tsx` | Report generation |
| `/settings` | `app/settings/page.tsx` | Hospital settings |

### Route Groups

- **`(auth)/`** — Route group with its own `layout.tsx`. The auth layout simply passes through children without wrapping them in `PageShell` or `AppSidebar`. Auth pages use the `AuthShell` component for the split-screen layout.

### Client vs Server Components

- Pages under `(auth)/login/` are **client components** (`"use client"`) because they manage form state with `useState`.
- All other auth pages are **server components** (no `"use client"` directive) — they render static forms.
- Most main app pages are **server components**. They import client components (e.g., `ActionModal`, `SearchInput`) as needed.
- The `AppSidebar` and any components using React hooks are client components.

---

## Component Hierarchy

```
RootLayout (app/layout.tsx)
├── ThemeProvider
│   └── ToastProvider
│       └── {children}
│
├── (auth) pages
│   └── AuthShell
│       ├── Brand panel (left)
│       │   ├── Logo (Image)
│       │   ├── Heading + description
│       │   └── Trust signals
│       └── Form card (right)
│           ├── Section heading
│           ├── Form fields
│           └── Button
│
├── Dashboard page (custom layout)
│   └── AppSidebar
│       ├── Desktop sidebar (lg+)
│       │   ├── Logo
│       │   ├── Nav items
│       │   ├── Theme toggle
│       │   ├── Logout link
│       │   └── Bed utilization widget
│       └── Mobile sidebar (checkbox toggle)
│   └── Content area
│       ├── Header (inline)
│       ├── StatCard grid
│       ├── Revenue chart (inline bar chart)
│       ├── Critical alerts panel
│       ├── Appointments table (inline)
│       └── Recent activities
│
└── Main app pages (PageShell pattern)
    ├── PageShell
    │   └── AppSidebar (shared)
    │   └── Content area
    │       └── PageHeader
    │           ├── eyebrow
    │           ├── title
    │           ├── description
    │           └── actions (SearchInput + ActionButton + ActionModal)
    │       └── StatCard grid
    │       └── Card + DataTable
    │       └── Card + side panels
```

---

## State Management

Care Sync does **not** use a dedicated state management library. State is managed through:

### 1. React Context (Global State)

| Context | File | Purpose |
|---------|------|---------|
| `ThemeContext` | `lib/theme-provider.tsx` | Light/dark theme toggle, persisted to `localStorage` |
| `ToastContext` | `lib/use-toast.tsx` | Toast notifications with auto-dismiss (3 seconds) |

Both contexts are wired in the root layout (`app/layout.tsx`) so they are available throughout the entire app.

### 2. Component Local State (useState)

- **Login form**: `email`, `password`, `errors` state
- **Modal open/close**: Each `ActionModal` manages its own `isOpen` state (with support for controlled and uncontrolled modes)
- **Search inputs**: Current input values (though search is not functional yet)
- **Form fields**: Individual field values within forms

### 3. No Server State / Data Fetching

There is currently no data fetching layer. All data displayed in tables, charts, and stat cards is hardcoded JavaScript arrays within each page file. When a backend is integrated, consider:

- **React Query / TanStack Query** for server state management
- **SWR** as a lighter alternative
- Or Next.js Server Components with `fetch()` for RSC-based data loading

---

## Styling Approach

### Tailwind CSS 4 + CSS Custom Properties

Care Sync uses **Tailwind CSS 4** with the `@tailwindcss/postcss` plugin. The project does not have a `tailwind.config.ts` file — Tailwind 4 configuration is done via CSS (`@theme inline`).

### Design Token System

All colors are defined as **CSS custom properties** in `app/globals.css`, with separate values for light and dark modes. This allows consistent theming without Tailwind config.

```
app/globals.css
├── :root              # Light mode tokens
│   ├── Brand colors   (--care-primary, --care-secondary, etc.)
│   ├── Semantic tokens (--card-bg, --text-primary, --border-default, etc.)
│   ├── Badge tokens    (--badge-warning-bg, --badge-danger-bg, etc.)
│   └── Shadow tokens   (--shadow-card, --shadow-sidebar)
│
├── .dark              # Dark mode token overrides
│
├── @theme inline      # Maps CSS variables to Tailwind theme
│   ├── --color-*      # Colors usable as bg-[var(--color)] or class names
│   └── --font-*       # Geist font families
│
├── Global styles      # body, scrollbars
│
├── Keyframes          # auth-panel-in, auth-card-in (entrance animations)
│
└── Utility classes    # .auth-panel, .auth-card, .care-brand-gradient
```

### Key Utility Classes

| Class | Usage |
|-------|-------|
| `care-brand-gradient` | Horizontal gradient from primary to secondary color |
| `care-brand-gradient-vertical` | Vertical gradient from primary to secondary color |
| `auth-panel` | Left panel on auth pages with radial/linear gradient background + entrance animation |
| `auth-card` | Right card on auth pages with entrance animation |

### How to Style New Components

1. **Always use CSS variables** — `text-[var(--text-primary)]`, `bg-[var(--card-bg)]`, `border-[var(--care-border)]`
2. This ensures automatic light/dark mode support with no extra effort
3. For brand colors: `care-primary`, `care-secondary`, `care-mint`, `care-accent`
4. For semantic colors: `text-primary`, `text-secondary`, `text-muted`, `border-default`, `card-bg`
5. Avoid hardcoding colors like `#ffffff` or `bg-white` — use the CSS variables instead

### Mobile Responsiveness

- Sidebar: hidden on mobile (`lg:hidden`), full sidebar on desktop (`lg:flex`)
- Mobile sidebar: checkbox-based CSS toggle (no JavaScript) with slide-in animation
- Stat cards: 1 column on mobile → 2 columns on `sm` → 4 columns on `xl`
- Main content: stacked on mobile, side-by-side on `xl`

---

## Custom Hooks & Utilities

### `lib/theme-provider.tsx`

```tsx
// Usage
const { theme, toggleTheme } = useTheme();

// Returns
{
  theme: "light" | "dark",
  toggleTheme: () => void  // Toggles light↔dark, persists to localStorage
}
```

- Reads initial theme from `localStorage` (key: `care-sync-theme`) or system preference (`prefers-color-scheme`)
- Adds/removes `.dark` class on `<html>` element
- All CSS variables respond to this class automatically

### `lib/use-toast.tsx`

```tsx
// Usage
const { toasts, addToast } = useToast();

// Show a toast
addToast("Patient added successfully", "success");
addToast("Stock is running low", "warning");

// Toast types: "success" | "info" | "warning"
```

- Toasts appear in the bottom-right corner
- Auto-dismiss after 3 seconds
- If used outside the provider, returns a no-op fallback (won't crash)

---

## Shared Modules & Reusable Components

### UI Components (`components/ui/`)

| Component | Props | Notes |
|-----------|-------|-------|
| **`Button`** | `variant`, `size`, `children`, `className`, standard HTML button attrs | 4 variants: `primary`, `secondary`, `ghost`, `danger`. 4 sizes: `sm`, `md`, `lg`, `link` |
| **`Card`** | `title`, `description?`, `action?`, `children` | Bordered section with header and optional action slot (e.g., "View all" link) |
| **`Modal`** | `open`, `onClose`, `title`, `subtitle?`, `children`, `footer?` | Generic modal. Handles Escape key close and scroll lock. Header sticky top, footer sticky bottom, body scrollable |
| **`ActionModal`** | `trigger`, `title`, `subtitle?`, `children`, `onConfirm?`, `confirmLabel?` | Wraps `Modal` with a form. The submit button in the footer is linked via `form="action-modal-form"`. Supports controlled (`open`/`onOpenChange`) and uncontrolled modes |
| **`ActionButton`** | `children`, `message?`, `type?`, `className?`, `icon?` | Brand-gradient button. If `message` provided, shows a toast on click |
| **`SecondaryButton`** | `children`, `message?`, `icon?`, `className?` | Outlined button for secondary actions |
| **`SearchInput`** | `placeholder?` | Styled search input with search icon. Not functionally wired to filter |
| **`ViewAllButton`** | `label`, `title`, `subtitle`, `reports` | Opens a modal showing all items in a report category |

### Form Components

| Component | Props | Notes |
|-----------|-------|-------|
| **`FormField`** | `label`, `value?`, `placeholder?`, `type?`, `options?`, `onChange?` | Renders text input, select (via react-select), textarea, date, or number based on `type`. `options` required for `type="select"` |
| **`FormSection`** | `title`, `children` | Section wrapper with uppercase title label |

### Data Display Components

| Component | Props | Notes |
|-----------|-------|-------|
| **`DataTable`** | `headers`, `children` | Renders a table with header row and scrollable body. Child `<tr>` elements go directly as children |
| **`StatusBadge`** | `children`, `variant?` | Colored pill badge. Variants: `default` (green/teal), `warning` (amber), `danger` (red), `info` (blue) |

### Chart Components

| Component | Props | Notes |
|-----------|-------|-------|
| **`BarChart`** | `data: BarChartItem[]`, `maxLabel?` | Each bar has a fixed `height` string (e.g., `"48%"`) |
| **`CompactBarChart`** | `data: { label, value }[]`, `maxValue`, `unit?` | Heights calculated as `(value / maxValue) * 100%`. Used for weekly volume charts |

### Layout Components

| Component | Props | Notes |
|-----------|-------|-------|
| **`PageShell`** | `activeHref`, `children` | Standard page layout with sidebar + scrollable content |
| **`PageHeader`** | `eyebrow`, `title`, `description`, `actions?` | Standard page header with eyebrow, h1, description, and action buttons |
| **`StatCard`** | `label`, `value`, `delta`, `detail`, `icon?`, `href?` | KPI stat card with optional icon and link |

---

## Authentication Flow

The authentication flow is **not yet implemented with real logic**. Here's how the current UI flow works:

```
┌─────────┐     submit form     ┌──────────┐     router.push     ┌───────────┐
│ /login  │ ───────────────────→ │ validate  │ ─────────────────→ │/dashboard │
│         │                     │ (6+ char) │                    │           │
└─────────┘                     └──────────┘                    └───────────┘

┌──────────────┐   form action  ┌─────────────────┐
│ /forgot-     │ ─────────────→ │ /otp-           │
│ password     │                │ verification    │
└──────────────┘                └─────────────────┘
```

- **Login** (`/login`): Validates that email is non-empty and password is ≥6 characters. On success, calls `router.push("/dashboard")`. No actual authentication service is called.
- **Forgot Password** (`/forgot-password`): Static form with `action="/otp-verification"` — navigates via HTML form action.
- **OTP Verification** (`/otp-verification`): Static form with 6-digit OTP input. No backend verification.

All auth pages use the `AuthShell` component which provides:
- Left panel: Brand logo, animated gradient background, trust signals
- Right panel: White card with form content

---

## API Integration & Data Patterns

### Current Data Pattern

All data is hardcoded in each page file as TypeScript arrays:

```typescript
// Example from app/patients/page.tsx
const patients = [
  { id: "P-1024", name: "Meera Iyer", gender: "F", age: 38, ... },
  { id: "P-1023", name: "Arjun Menon", gender: "M", age: 52, ... },
  // ...
];
```

### How to Integrate a Backend (Future)

When connecting to an API, the recommended approach:

1. **Create a `services/` directory** at the project root
2. **Define API client** with `fetch()` or a library like `axios`
3. **Create service modules** per domain: `services/patients.ts`, `services/doctors.ts`, etc.
4. **Use React Server Components** for initial data fetching where possible
5. **Use React Query / TanStack Query** for client-side data fetching and mutations

Example future structure:

```
services/
├── api-client.ts          # Base fetch wrapper with auth headers
├── patients.ts            # CRUD operations for patients
├── doctors.ts             # CRUD operations for doctors
├── appointments.ts        # Appointment operations
├── billing.ts             # Invoice and claims operations
├── pharmacy.ts            # Inventory operations
├── laboratory.ts          # Lab test operations
└── reports.ts             # Report generation
```

### Form Submission Pattern

All forms currently:
1. Use `ActionModal` for the create/add flows
2. The form has `id="action-modal-form"` (hardcoded — **potential ID conflict if multiple modals on same page**)
3. On submit, `onConfirm` is called and the modal closes
4. No actual data is persisted

---

## Environment Variables

**No environment variables are currently configured.** The project does not have a `.env` or `.env.example` file.

When setting up environment variables in the future:

1. Create a `.env.local` file (gitignored)
2. Create a `.env.example` file (committed) documenting all required variables
3. Prefix with `NEXT_PUBLIC_` for client-side accessible variables

Example future `.env.example`:

```bash
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api

# Auth
NEXT_PUBLIC_AUTH_DOMAIN=caresync.auth0.com
NEXT_PUBLIC_AUTH_CLIENT_ID=your-client-id

# Features
NEXT_PUBLIC_ENABLE_NOTIFICATIONS=true
```

---

## Development Workflow

### Local Development

```bash
npm run dev
# Starts at http://localhost:3000 with hot reload
```

- The dev server uses **Turbopack** (Next.js 16 default)
- Changes to any file in `app/` or `components/` trigger instant updates
- CSS changes in `globals.css` are reflected immediately

### Code Quality

```bash
npm run lint
# Runs ESLint with next/core-web-vitals and next/typescript configs
```

The ESLint configuration uses the flat config format (`eslint.config.mjs`). It includes:
- `eslint-config-next/core-web-vitals` — Core Web Vitals rules
- `eslint-config-next/typescript` — TypeScript-specific rules

### File Naming

| Type | Convention | Example |
|------|-----------|---------|
| Page files | `page.tsx` | `app/patients/page.tsx` |
| Layout files | `layout.tsx` | `app/layout.tsx` |
| Components | `kebab-case.tsx` | `app-sidebar.tsx`, `status-badge.tsx` |
| Utilities | `kebab-case.tsx` | `theme-provider.tsx`, `use-toast.tsx` |

### TypeScript

- Path alias `@/*` maps to the project root
- Import example: `import { Button } from "@/components/ui/button"`
- `strict: true` is enabled in `tsconfig.json`

---

## Build & Deployment

### Build

```bash
npm run build
# Creates an optimized production build in .next/
```

### Production Server

```bash
npm run start
# Starts the production server on port 3000
```

### Deploying to Vercel (Recommended)

Since Care Sync is a Next.js project, deploying to [Vercel](https://vercel.com) is the simplest path:

1. Push the repository to GitHub/GitLab/Bitbucket
2. Import the project in Vercel
3. Vercel auto-detects Next.js and configures the build
4. Deploy

For other platforms (Docker, AWS, etc.), use `npm run build` followed by `npm run start`.

---

## Naming Conventions & Coding Standards

### Component Props Pattern

Props are typed inline using object types:

```tsx
// ✅ Standard pattern
export function ComponentName({
  prop1,
  prop2,
}: {
  prop1: string;
  prop2?: ReactNode;
}) {
  // ...
}
```

### CSS Variable Usage

All colors reference CSS variables directly with arbitrary value syntax:

```tsx
// ✅ Correct
className="text-[var(--text-primary)] bg-[var(--card-bg)]"
className="border-[var(--care-border)]"

// ❌ Avoid raw color classes (breaks dark mode)
className="text-slate-950 bg-white"
```

There are a few exceptions where raw color classes are used (e.g., `text-slate-800` in auth forms, `text-red-600` for error messages). These should ideally be migrated to CSS variables for consistency.

### Component Exports

Components are **named exports** (not default exports):

```tsx
// ✅ Used throughout
export function PageShell({ ... }: Props) { ... }

// ❌ Not used
export default function PageShell() { ... }
```

### Import Order (Observed Pattern)

1. React and Next.js imports (`"use client"`, `import type { Metadata }`)
2. Third-party libraries (`lucide-react`, `react-select`)
3. Internal components (`@/components/...`)
4. Types and interfaces

### File Headers

Client components start with `"use client"` at line 1.

---

## Common Patterns & Best Practices

### 1. Page Structure Pattern

Every main page follows this structure (except Dashboard):

```tsx
export default function SomePage() {
  return (
    <PageShell activeHref="/route-path">
      <PageHeader
        eyebrow="Section Label"
        title="Page Title"
        description="Brief description"
        actions={<>...</>}  // SearchInput + ActionModal buttons
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(item => <StatCard key={...} {...item} />)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card title="..." description="...">
          <DataTable headers={[...]}>...</DataTable>
        </Card>
        {/* Side panel with secondary content */}
      </div>
    </PageShell>
  );
}
```

### 2. Modal with Form Pattern

```tsx
<ActionModal
  title="Add Something"
  subtitle="Description"
  confirmLabel="Add something"
  trigger={<ActionButton icon={<Plus />}>Add Something</ActionButton>}
>
  <FormSection title="Section 1">
    <FormField label="Field name" placeholder="..." />
  </FormSection>
  <FormSection title="Section 2">
    <FormField label="Select" type="select" options={[...]} />
  </FormSection>
</ActionModal>
```

### 3. Status Badge Pattern

```tsx
<StatusBadge variant={
  status === "Critical" ? "danger" :
  status === "Pending" ? "warning" :
  status === "Discharged" ? "info" :
  "default"
}>
  {status}
</StatusBadge>
```

### 4. Action Buttons with Toasts

```tsx
// With toast notification on click
<ActionButton message="Patient added successfully" type="success">
  Add Patient
</ActionButton>

// Without toast (used inside ActionModal trigger)
<ActionButton icon={<Plus className="size-4" />} message="">
  Add Patient
</ActionButton>
```

When the button is a trigger for an `ActionModal`, pass `message=""` to suppress the toast (the modal handles the action instead).

---

## Potential Confusion Points for New Developers

### 1. Dashboard Uses a Different Layout

The **Dashboard** (`app/dashboard/page.tsx`) does not use `PageShell` or `PageHeader`. It manually constructs:
- `<main>` with grid layout
- `<AppSidebar>` imported directly
- Inline header section
- Inline stat cards (not the shared `StatCard` component for some)

This means changes to the sidebar or page layout won't automatically apply to the dashboard. The dashboard should ideally be refactored to use `PageShell`.

### 2. Duplicate StatusBadge

There are **two** `StatusBadge` implementations:
1. **Shared component**: `components/data-display/status-badge.tsx` — used by patients, doctors, appointments, inpatient, pharmacy, billing, laboratory, reports, and settings pages
2. **Inline component**: Inside `app/dashboard/page.tsx` — a locally defined `StatusBadge` function that behaves differently (binary logic for "Waiting"/"Sample due" vs everything else)

Both render colored pills but have different styles. If you change one, the other won't update.

### 3. ActionModal Form ID Conflict

`ActionModal` renders `<form id="action-modal-form">` with a hardcoded ID. If a page has multiple `ActionModal` instances, the submit button in the second modal will submit the first form. This has not caused issues yet because modals are stacked (only one is open at a time), but it's fragile.

### 4. No Search/Filter Functionality

The `SearchInput` component renders a styled input field but does not actually filter any data. Search and filter functionality has not been implemented yet.

### 5. Form Fields Are Uncontrolled

`FormField` uses `defaultValue` (not `value`), making all form inputs **uncontrolled**. Form data is never collected or submitted — the "Confirm" buttons just close the modal. There's no form state management.

### 6. All Data Is Mock Data

Every page has hardcoded data arrays. When a "Create" modal is submitted, no data is actually persisted. New records don't appear in the tables. This is by design (backend not yet integrated).

### 7. Patient ID Duplication

In the `AddPatientForm` and several select dropdowns across the app, patient ID `P-1021` is used for both "Sita Verma" and a duplicate entry. This is a data error in the mock data.

### 8. Missing `lib/` Directory Documentation

The `lib/` directory contains only two files: `theme-provider.tsx` and `use-toast.tsx`. The original `design.md` references a `hooks/`, `types/`, and `services/` directory that don't exist yet.

### 9. Sidebar Navigation Label vs Page Title

The sidebar shows "Beds" but the page title is "Inpatient". The route is `/inpatient`. This inconsistency might confuse navigation.

### 10. CSS Variable Syntax

Tailwind 4's `@theme inline` block maps CSS variables to Tailwind utility classes. The syntax `var(--care-primary)` in class names uses Tailwind's arbitrary value syntax `bg-[var(--care-primary)]`. This is intentional but might look unusual to developers familiar with Tailwind 3's config-based approach.

---

## Areas for Improvement

### 🔴 Critical / Architectural

1. **Backend Integration**: The app has no API layer. Create a `services/` directory with API client and domain-specific service modules.
2. **Authentication**: Implement real authentication (NextAuth.js, Auth0, Clerk, or custom JWT-based auth).
3. **Form Handling**: Add proper form state management (React Hook Form or similar) with validation (Zod or Yup).
4. **Fix ActionModal ID Conflict**: Generate unique form IDs or use a ref-based approach instead of hardcoded `id="action-modal-form"`.

### 🟡 Important / Consistency

5. **Refactor Dashboard Layout**: Make the dashboard use `PageShell` and `PageHeader` like all other pages.
6. **Consolidate StatusBadge**: Remove the inline `StatusBadge` from the dashboard and use the shared component.
7. **Add Search/Filter**: Wire up the `SearchInput` components to actually filter data.
8. **Create Type Definitions**: Move shared types (Patient, Doctor, Appointment, etc.) into a `types/` directory.
9. **Create an `.env.example`**: Document environment variables needed for API URLs, auth config, etc.

### 🟢 Nice to Have / Polish

10. **Fix Duplicate Patient IDs**: Clean up mock data to avoid duplicate `P-1021` entries.
11. **Add Loading/Error States**: Pages currently render immediately with mock data. Add loading skeletons and error boundaries.
12. **Add Unit Tests**: No test files exist. Consider Vitest + React Testing Library.
13. **Add E2E Tests**: Consider Playwright or Cypress for critical user flows.
14. **Add a `components/dashboard/` Widget**: The directory exists but is empty. Extract dashboard-specific components.
15. **Create a Shared `StatCard` Data Pattern**: The `stats` array pattern is repeated on every page with slightly different shapes. A generic `StatCard` data type would help.
16. **Rename Sidebar "Beds" to "Inpatient"**: Match the actual page title and route name.
17. **Add Accessibility**: Add ARIA labels, keyboard navigation for modals, and focus management.
18. **Add a 404 Page**: Create a `not-found.tsx` for better UX on invalid routes.
19. **Add a Loading Page**: Create `loading.tsx` files for route segments.
20. **Populate AGENTS.md and CLAUDE.md**: These files are currently empty or placeholder. Add project-specific instructions for AI coding agents.
21. **Hide Empty `components/dashboard/` Directory**: Either add content or remove it to avoid confusion.
22. **Migrate Remaining Hardcoded Colors to CSS Variables**: Some auth forms use `text-slate-950`, `text-slate-800`, `text-slate-600` directly instead of CSS variables.

---

## Diagrams

### Application Routing Map

```
                          /
                          │
                     redirect to
                          │
                          ▼
                    ┌──────────┐
                    │  /login  │
                    └────┬─────┘
                         │ on success
                         ▼
                   ┌────────────┐
                   │ /dashboard │
                   └─────┬──────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼─────┐   ┌──────▼──────┐  ┌─────▼──────┐
   │ /patients│   │  /doctors   │  │/appointments│
   └──────────┘   └─────────────┘  └────────────┘
        │                │                │
   ┌────▼─────┐   ┌──────▼──────┐  ┌─────▼──────┐
   │/inpatient│   │  /pharmacy  │  │/laboratory │
   └──────────┘   └─────────────┘  └────────────┘
        │                │                │
   ┌────▼─────┐   ┌──────▼──────┐  ┌─────▼──────┐
   │ /billing │   │  /reports   │  │ /settings  │
   └──────────┘   └─────────────┘  └────────────┘

Auth routes (separate from main shell):
   /login  ──→  /forgot-password  ──→  /otp-verification
```

### Component Dependency Graph

```
                     AppSidebar
                         │
              ┌──────────┼──────────┐
              │          │          │
          useTheme   lucide-react  next/image
              │
         ThemeProvider

                    PageShell
                         │
              ┌──────────┼──────────┐
              │          │          │
         AppSidebar  PageHeader  {children}
                         │
              ┌──────────┼──────────┐
              │          │          │
          StatCard   SearchInput  ActionButton
                                    │
                               ActionModal
                                    │
                              ┌─────┴──────┐
                              │            │
                            Modal     FormField
                                        │
                                   react-select

                     Card
                      │
              ┌───────┼────────┐
              │                │
          DataTable       StatusBadge
              │
         {children}
         (<tr> rows)
```

---

_Last updated: June 2026_