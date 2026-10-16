import { apiRequest } from './apiClient.js';
import { apiPaths } from './apiRoutes.js';

export function createReport(payload) {
  return apiRequest(apiPaths.reports, { method: 'POST', body: payload });
}

export function getRecentReports() {
  return apiRequest(apiPaths.reports, { query: { sort: 'date_desc', limit: 10 } });
}

export function getReport(reportId) {
  return apiRequest(apiPaths.report(reportId));
}

export function getPatientReports(patientId) {
  return apiRequest(apiPaths.patientReports(patientId));
}

export function updateReport(reportId, payload) {
  return apiRequest(apiPaths.report(reportId), { method: 'PUT', body: payload });
}

export function downloadReportPdf(reportId) {
  return apiRequest(apiPaths.reportPdf(reportId), { responseType: 'blob' });
}
