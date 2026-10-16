const gatewayBase = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081').replace(/\/$/, '');

// Gateway route defaults are examples because service/controller mappings were not supplied.
// Override them in the gateway layer or replace this centralized map to match deployed routes.
export const apiConfig = Object.freeze({
  baseUrl: gatewayBase,
  mockMode: import.meta.env.VITE_USE_MOCK_API !== 'false',
});

const envPath = (key, fallback) => import.meta.env[key] || fallback;
const encode = (value) => encodeURIComponent(String(value));

export const apiPaths = Object.freeze({
  authLogin: envPath('VITE_AUTH_LOGIN_PATH', '/api/auth/login'),
  authLogout: envPath('VITE_AUTH_LOGOUT_PATH', '/api/auth/logout'),
  patients: envPath('VITE_PATIENTS_PATH', '/api/patients'),
  patient: (id) => `${envPath('VITE_PATIENTS_PATH', '/api/patients')}/${encode(id)}`,
  tests: envPath('VITE_TESTS_PATH', '/api/tests'),
  test: (id) => `${envPath('VITE_TESTS_PATH', '/api/tests')}/${encode(id)}`,
  testParameters: (id) => `${envPath('VITE_TESTS_PATH', '/api/tests')}/${encode(id)}/parameters`,
  reports: envPath('VITE_REPORTS_PATH', '/api/reports'),
  report: (id) => `${envPath('VITE_REPORTS_PATH', '/api/reports')}/${encode(id)}`,
  reportPdf: (id) => `${envPath('VITE_REPORTS_PATH', '/api/reports')}/${encode(id)}/pdf`,
  patientReports: (id) => `${envPath('VITE_PATIENTS_PATH', '/api/patients')}/${encode(id)}/reports`,
});
