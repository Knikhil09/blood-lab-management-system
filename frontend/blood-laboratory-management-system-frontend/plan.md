# Blood Laboratory Management System — Implementation Plan

## Scope and approach

Build a responsive React application with Vite for the Blood Laboratory Management System, based on the attached seven-page frontend requirements. The product is a frontend shell for the existing Spring Boot microservices, and all real service calls will go through one configurable API Gateway base URL (the backend document specifies gateway port 8081). The project has no real gateway endpoints or credentials configured, so the delivered experience will include an explicitly labelled demo/mock mode and a separate gateway-backed API path; mock behavior must not be presented as real persistence.

Use React Router for a consistent authenticated application shell and the following routes: `/login`, `/` (dashboard), `/add-test`, `/reports`, `/patients/:patientId/reports`, `/reports/:reportId`, and `/update-values`. Put reusable shell, field, status, table, modal, feedback, and report components in shared folders. Keep authentication, patients, tests, and reports API modules separate while centralizing URL construction, JSON/error handling, auth headers, and gateway configuration in one client. Sample catalogues belong to mock data only; real catalogue results come from Test Service.

### Workflow coverage

- **Login:** required username/email and password, show/hide password, missing/invalid feedback, loading state, demo-mode explanation, session state, protected routes, and logout. Real authentication is routed through the gateway.
- **Dashboard:** clear entry points for Add Test, Reports, and Update Values; signed-in identity and logout; useful operational summary.
- **Add Test:** new/existing patient choice; existing-patient lookup by code, name, or mobile; required demographics and age validation; optional 10-digit mobile validation when entered; today's registration date/time defaults; no client-generated patient code for new patients. Search/load available tests through Test Service; support multiple unique selections, parameter-config-driven numeric and qualitative results, units/reference intervals/interpretation, per-test draft preservation, required/format validation, preview, duplicate-save protection, confirmed-save feedback and saved-report PDF action/error state.
- **Reports:** searchable patients with ID, demographic, mobile and registration details; clear filters and empty states; patient report history sorted newest first; report detail using the saved historical reference-range snapshot; edit only in the UI flow and route persistence through the API; print-friendly output and PDF download/error feedback.
- **Update Values:** test search by name or ID; edit numeric limits or qualitative choices for configured parameters; reject lower limits above upper limits; show explicit save/loading/success/error and permission-denied states. The backend remains responsible for authorization and historical snapshot preservation.
- **Common behavior:** accessible labels and keyboard/focus support, responsive desktop/tablet behavior, loading/empty/error/permission states, field-level validation, request-failure input preservation, retry affordances, and confirmation before leaving a long unsaved report.

## Implementation and integration

- Stack: React, Vite, React Router, plain CSS, JavaScript modules, and Lucide React icons; pin the selected package-manager version in project metadata and include its lockfile.
- Configuration: `VITE_API_BASE_URL` defaults to the documented gateway (`http://localhost:8081` for a locally run Spring setup); `VITE_USE_MOCK_API` explicitly selects the frontend demo adapter. No microservice URLs or credentials are embedded in UI components.
- Mock mode: seeded sample patients, tests, parameter definitions and reports for interface exploration. Clearly label demo records and simulated persistence; do not claim that mock writes reached the backend. Isolate mock state/data from the gateway client so a configured gateway can replace the adapter.
- Production/static build: `pnpm build` outputs `dist/`; development server listens on `0.0.0.0:3000`, matching the project runtime. The project has no managed server or database enabled or required.
- Keep `public/manus-routes.json` synchronized with the complete route list before starting Vite.

## Project structure

```text
blms/
├── public/
│   ├── manus-routes.json
│   └── clearline-mark.svg
├── src/
│   ├── api/
│   │   ├── apiClient.js       # Gateway URL, headers, response/error mapping
│   │   ├── authApi.js         # Login/session/logout adapter
│   │   ├── patientApi.js      # Patient registration/search/retrieval
│   │   ├── testApi.js         # Catalogue and parameter definitions
│   │   └── reportApi.js       # Save/history/detail/edit/PDF operations
│   ├── app/                   # App root, route guards, route configuration
│   ├── components/            # Sidebar/topbar, tables, search, field, toast, modal, loaders
│   ├── data/                  # Demo fixtures and isolated mock adapter/store
│   ├── pages/                 # Login, dashboard, add test, patient reports, report detail, update values
│   ├── styles/                # Design tokens, global/accessibility, shared component styles
│   ├── reactRuntime.js        # Normalized React/ReactDOM imports for Vite's JSX transform
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── app.config.ts
├── index.html
├── package.json / lockfile
├── vite.config.js
├── plan.md
├── TODO.md
└── tests/
    └── mock-api.smoke.mjs
```

## Design direction

- **Design movement:** contemporary clinical editorial design, borrowing the precision of laboratory information systems while softening the typical hospital-admin dashboard.
- **Core principles:** calm hierarchy; high-density but breathable information; traceable patient/report context; purposeful color reserved for state and action.
- **Color philosophy:** warm chalk canvas and lightly tinted panels reduce glare; deep ink teal makes navigation and headings steady; a distinctive mineral teal anchors primary actions; restrained oxblood marks specimen-related emphasis, not errors by default; semantic green/amber/red communicate status with text as well as color.
- **Layout paradigm:** left-side vertical navigation as a laboratory “specimen rail,” followed by a broad working canvas. Use asymmetric content sections and compact horizontal metrics rather than a centered, uniform card grid. On mobile/tablet, collapse navigation and keep tables/forms usable through responsive reflow and horizontal overflow where necessary.
- **Signature elements:** (1) custom assay/drop emblem built from a specimen droplet and three result bars; (2) slim numbered/accession-style context labels and monospaced identifiers; (3) fine ruled dividers and restrained capsule status labels.
- **Interaction philosophy:** make patient/report context explicit before destructive or persistent actions; maintain drafts when navigating within a report; keep focus visible; use direct, calm, specific labels; provide inline validation and clear confirmation only after mock/API outcome is resolved.
- **Animation:** short 120–180ms transitions for hover, focus and panel entry; subtle loading shimmer/spinner; respect `prefers-reduced-motion`; avoid looping decorative motion or motion that delays data entry.
- **Typography system:** Manrope for headings and interface labels with system sans-serif fallback; IBM Plex Mono for IDs, timestamps, and measured values with system monospace fallback. Use a compact but clear hierarchy, tabular numerals for values, and no tiny essential text.
- **Brand essence:** a dependable workspace for independent laboratory teams to register patients and produce traceable reports; **precise, composed, accountable**.
- **Brand voice:** concise, plain-language, operational. Example lines: “Patient details verified. Select assays to continue.” and “Changes to reference values affect new reports only.”
- **Wordmark & logo:** “Clearline Lab” logotype paired with a bespoke circular specimen-drop mark containing three short assay bars; the small product descriptor reads “LABORATORY WORKSPACE.” This is UI branding only, not a claim of a real lab identity.
- **Signature brand color:** mineral teal (`#267A73`), used for primary actions, selected navigation and key links, paired with accessible contrast treatments.

## Material constraints

The supplied specification describes integrations but does not include actual Spring Boot endpoint mappings, authentication semantics, or a PDF endpoint contract. The gateway path and endpoint methods will therefore be centralized and clearly documented/configurable rather than scattered or guessed. Demo fixtures and mock persistence are for interface evaluation only; no real patient service or clinical data is provided. Patient/report content in demo records is synthetic. Frontend permissions are presentation only; authorization must be enforced by backend services.
