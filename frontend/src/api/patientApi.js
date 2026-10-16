import { apiRequest } from './apiClient.js';
import { apiPaths } from './apiRoutes.js';

export function searchPatients(query = '') {
  return apiRequest(apiPaths.patients, { query: { query } });
}

export function getPatient(patientId) {
  return apiRequest(apiPaths.patient(patientId));
}

export function registerPatient(patient) {
  return apiRequest(apiPaths.patients, { method: 'POST', body: patient });
}
