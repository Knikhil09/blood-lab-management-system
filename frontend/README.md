# Clearline Lab — Blood Laboratory Management System

A React + Vite frontend for patient registration, assay results, laboratory reports, and reference-value maintenance.

## Run locally

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open `http://localhost:3000`. The initial demo sign-in is `lab@clearline.test` / `Clearline123!` (the login screen can fill these details). Demo records are synthetic and demo edits are stored in this browser's local storage only; they are not sent to a laboratory system.

## Gateway integration

Set `VITE_USE_MOCK_API=false` and set `VITE_API_BASE_URL` to the Spring Boot API Gateway (the supplied requirements identify port 8081). Review and adjust the centralized endpoint templates in `src/api/apiRoutes.js` to match the actual gateway routes and PatientController mappings. The requirements did not include those endpoint contracts. Access tokens are kept in memory for the current page session; no credentials or tokens are logged or persisted. Configure any agreed production token lifecycle and refresh behavior with the backend team.

## Build

```bash
pnpm build
pnpm preview
```

The build output is `dist/`. The UI includes patient search and report history, a multi-test workflow with configured numeric/qualitative parameters, a pre-save preview, demo PDF generation, report viewing/editing/printing, and reference-value management.
