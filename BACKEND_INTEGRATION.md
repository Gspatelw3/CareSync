# Care Sync - Backend Integration Guide

This document outlines all the backend integration points for the Care Sync hospital management system. All data is currently stored in LocalStorage with Zustand state management. Below are the recommended API endpoints and integration strategies.

## LocalStorage Keys Used

The application uses the following LocalStorage keys for data persistence:

- `care-sync-patients` - Patient records
- `care-sync-doctors` - Doctor records
- `care-sync-appointments` - Appointment records
- `care-sync-admissions` - Inpatient admission records
- `care-sync-inventory` - Pharmacy inventory items
- `care-sync-lab-tests` - Laboratory test requests
- `care-sync-invoices` - Billing invoices
- `care-sync-notifications` - Notification records
- `care-sync-settings` - Organization and notification settings
- `care-sync-auth` - Authentication session data
- `care-sync-theme` - Theme preference (light/dark)

## Authentication Endpoints

### Replace Mock Authentication

**Current Implementation:** `lib/stores/use-auth-store.ts`

**Recommended Endpoints:**
```
POST   /api/auth/login          - User login
POST   /api/auth/logout         - User logout
POST   /api/auth/refresh        - Refresh access token
POST   /api/auth/forgot-password - Request password reset
POST   /api/auth/reset-password  - Reset password with token
GET    /api/auth/me             - Get current user profile
```

**Integration Points:**
- `app/(auth)/login/page.tsx` - Line 67: Replace `login()` function
- `lib/stores/use-auth-store.ts` - Replace entire store with API calls

## Patient Management Endpoints

**Current Implementation:** `lib/stores/use-patient-store.ts`

**Recommended Endpoints:**
```
GET    /api/patients            - List all patients (with pagination, search, filters)
GET    /api/patients/:id        - Get patient details
POST   /api/patients            - Create new patient
PUT    /api/patients/:id        - Update patient
DELETE /api/patients/:id        - Delete patient
GET    /api/patients/search     - Search patients
GET    /api/patients/stats      - Get patient statistics
```

**Integration Points:**
- `components/patients/patient-form.tsx` - Line 78: Replace `addPatient()` call
- `components/patients/patient-form.tsx` - Line 82: Replace `updatePatient()` call
- `app/patients/page.tsx` - Line 36: Replace `initializeMockPatients()`

## Doctor Management Endpoints

**Current Implementation:** `lib/stores/use-doctor-store.ts`

**Recommended Endpoints:**
```
GET    /api/doctors             - List all doctors
GET    /api/doctors/:id         - Get doctor details
POST   /api/doctors             - Create new doctor
PUT    /api/doctors/:id         - Update doctor
DELETE /api/doctors/:id         - Delete doctor
GET    /api/doctors/schedule    - Get doctor schedules
PUT    /api/doctors/:id/status  - Update doctor status
```

**Integration Points:**
- `components/doctors/doctor-form.tsx` - Line 78: Replace `addDoctor()` call
- `components/doctors/doctor-form.tsx` - Line 82: Replace `updateDoctor()` call
- `app/doctors/page.tsx` - Line 36: Replace `initializeMockDoctors()`

## Appointment Management Endpoints

**Current Implementation:** `lib/stores/use-appointment-store.ts`

**Recommended Endpoints:**
```
GET    /api/appointments        - List appointments
GET    /api/appointments/:id    - Get appointment details
POST   /api/appointments        - Book appointment
PUT    /api/appointments/:id    - Update appointment
DELETE /api/appointments/:id    - Cancel appointment
GET    /api/appointments/calendar - Get calendar view
PUT    /api/appointments/:id/status - Update appointment status
```

**Integration Points:**
- `components/appointments/appointment-form.tsx` - Line 78: Replace `addAppointment()` call
- `components/appointments/appointment-form.tsx` - Line 82: Replace `updateAppointment()` call
- `app/appointments/page.tsx` - Line 36: Replace `initializeMockAppointments()`

## Inpatient/Bed Management Endpoints

**Current Implementation:** `lib/stores/use-admission-store.ts`

**Recommended Endpoints:**
```
GET    /api/admissions          - List all admissions
GET    /api/admissions/:id      - Get admission details
POST   /api/admissions          - Admit patient
PUT    /api/admissions/:id      - Update admission
DELETE /api/admissions/:id      - Discharge patient
GET    /api/beds/available      - Get available beds
GET    /api/wards               - Get ward information
PUT    /api/beds/:id/allocate   - Allocate bed
```

**Integration Points:**
- `app/inpatient/page.tsx` - Line 36: Replace `initializeMockAdmissions()`
- `app/inpatient/page.tsx` - Line 156: Add bed allocation API call

## Pharmacy/Inventory Endpoints

**Current Implementation:** `lib/stores/use-inventory-store.ts`

**Recommended Endpoints:**
```
GET    /api/inventory           - List inventory items
GET    /api/inventory/:id       - Get item details
POST   /api/inventory           - Add inventory item
PUT    /api/inventory/:id       - Update inventory
DELETE /api/inventory/:id       - Delete item
GET    /api/inventory/low-stock - Get low stock alerts
PUT    /api/inventory/:id/stock - Update stock levels
```

**Integration Points:**
- `app/pharmacy/page.tsx` - Line 36: Replace `initializeMockInventory()`
- `app/pharmacy/page.tsx` - Line 156: Add inventory CRUD operations

## Laboratory Endpoints

**Current Implementation:** `lib/stores/use-lab-store.ts`

**Recommended Endpoints:**
```
GET    /api/lab-tests           - List lab test requests
GET    /api/lab-tests/:id       - Get test details
POST   /api/lab-tests           - Create test request
PUT    /api/lab-tests/:id       - Update test status
DELETE /api/lab-tests/:id       - Delete test request
POST   /api/lab-tests/:id/result - Upload test results
GET    /api/lab-tests/pending   - Get pending tests
```

**Integration Points:**
- `app/laboratory/page.tsx` - Line 36: Replace `initializeMockLabTests()`
- `app/laboratory/page.tsx` - Line 156: Add lab test CRUD operations

## Billing Endpoints

**Current Implementation:** `lib/stores/use-billing-store.ts`

**Recommended Endpoints:**
```
GET    /api/invoices            - List invoices
GET    /api/invoices/:id        - Get invoice details
POST   /api/invoices            - Create invoice
PUT    /api/invoices/:id        - Update invoice
DELETE /api/invoices/:id        - Delete invoice
POST   /api/invoices/:id/payment - Record payment
GET    /api/invoices/stats      - Get billing statistics
GET    /api/insurance/claims    - Get insurance claims
```

**Integration Points:**
- `app/billing/page.tsx` - Line 36: Replace `initializeMockInvoices()`
- `app/billing/page.tsx` - Line 156: Add invoice CRUD operations

## Notifications Endpoints

**Current Implementation:** `lib/stores/use-notification-store.ts`

**Recommended Endpoints:**
```
GET    /api/notifications        - List notifications
GET    /api/notifications/unread - Get unread notifications
PUT    /api/notifications/:id/read - Mark as read
PUT    /api/notifications/read-all - Mark all as read
DELETE /api/notifications/:id    - Delete notification
POST   /api/notifications/send   - Send notification (admin)
```

**Integration Points:**
- `lib/stores/use-notification-store.ts` - Replace all store methods with API calls
- `app/notifications/page.tsx` - Line 24: Replace `initializeMockNotifications()`

## Settings Endpoints

**Current Implementation:** `lib/stores/use-settings-store.ts`

**Recommended Endpoints:**
```
GET    /api/settings/organization - Get organization settings
PUT    /api/settings/organization - Update organization settings
GET    /api/settings/notifications - Get notification preferences
PUT    /api/settings/notifications - Update notification preferences
GET    /api/settings/theme        - Get theme settings
PUT    /api/settings/theme        - Update theme settings
```

**Integration Points:**
- `lib/stores/use-settings-store.ts` - Replace all store methods with API calls
- `app/settings/page.tsx` - Line 59: Replace `updateOrganization()` call
- `app/settings/page.tsx` - Line 63: Replace `updateNotificationSettings()` call

## Dashboard Analytics Endpoints

**Current Implementation:** `app/dashboard/page.tsx`

**Recommended Endpoints:**
```
GET    /api/dashboard/stats      - Get dashboard statistics
GET    /api/dashboard/revenue    - Get revenue data
GET    /api/dashboard/appointments - Get today's appointments
GET    /api/dashboard/alerts     - Get critical alerts
GET    /api/dashboard/activities - Get recent activities
```

**Integration Points:**
- `app/dashboard/page.tsx` - Line 36: Replace store initialization
- `app/dashboard/page.tsx` - Line 45: Replace static stats with API data

## Reports Endpoints

**Current Implementation:** `app/reports/page.tsx`

**Recommended Endpoints:**
```
GET    /api/reports              - List available reports
GET    /api/reports/:id         - Get report details
POST   /api/reports/generate    - Generate new report
GET    /api/reports/:id/download - Download report
GET    /api/reports/categories  - Get report categories
```

**Integration Points:**
- `app/reports/page.tsx` - Line 156: Add report generation API call
- `app/reports/page.tsx` - Line 165: Add report download functionality

## File Upload Endpoints

**Recommended Endpoints:**
```
POST   /api/upload/documents    - Upload patient documents
POST   /api/upload/reports      - Upload lab reports
POST   /api/upload/prescriptions - Upload prescriptions
GET    /api/upload/:id          - Get uploaded file
DELETE /api/upload/:id          - Delete uploaded file
```

## Real-time Features (WebSocket)

**Recommended WebSocket Events:**
```
ws://api/notifications          - Real-time notifications
ws://api/appointments/updates   - Appointment status changes
ws://api/lab-results            - Lab result updates
ws://api/inventory/alerts       - Inventory alerts
```

## Implementation Strategy

### Phase 1: Core Infrastructure
1. Set up API client with axios/fetch wrapper
2. Implement authentication flow
3. Create API error handling middleware
4. Set up request/response interceptors

### Phase 2: Replace Mock Data
1. Replace all `initializeMock*()` calls with API calls
2. Implement proper loading states
3. Add error boundaries
4. Implement retry logic

### Phase 3: Enhanced Features
1. Add real-time updates via WebSocket
2. Implement file uploads
3. Add advanced search with Elasticsearch/Meilisearch
4. Implement caching strategy

### Phase 4: Production Ready
1. Add rate limiting
2. Implement proper logging
3. Add monitoring and analytics
4. Set up CI/CD pipeline

## Notes

- All TODO comments in the codebase mark where API integration is needed
- The current implementation uses LocalStorage for persistence - replace with API calls
- Mock data generators should be removed once backend is ready
- Consider using React Query or SWR for data fetching and caching
- Implement proper error handling and user feedback
- Add loading skeletons for better UX during API calls

## Testing Strategy

1. **Unit Tests:** Test all store methods and utility functions
2. **Integration Tests:** Test API endpoints with mock servers
3. **E2E Tests:** Test complete user flows with Playwright/Cypress
4. **Performance Tests:** Test with large datasets
5. **Security Tests:** Test authentication and authorization

## Deployment Checklist

- [ ] Set up environment variables for API endpoints
- [ ] Configure CORS on backend
- [ ] Set up SSL certificates
- [ ] Configure CDN for static assets
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Perform security audit
- [ ] Load testing
- [ ] Documentation