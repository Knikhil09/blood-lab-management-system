import { apiRequest } from './apiClient.js';
import { apiPaths } from './apiRoutes.js';

export function searchTests(query = '') {
  return apiRequest(apiPaths.tests, { query: { query } });
}

export async function getTestConfiguration(test) {
  if (Array.isArray(test.parameters) && test.parameters.length) return test;
  const configured = await apiRequest(apiPaths.testParameters(test.id));
  const parameters = Array.isArray(configured) ? configured : configured?.parameters;
  if (!Array.isArray(parameters)) throw new Error(`Parameter configuration is unavailable for ${test.name}.`);
  return { ...test, parameters };
}

export function updateTestParameters(testId, parameters) {
  return apiRequest(apiPaths.testParameters(testId), { method: 'PUT', body: { parameters } });
}
