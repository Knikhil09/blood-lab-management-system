import { apiRequest } from './apiClient.js';
import { apiPaths } from './apiRoutes.js';

export function login(credentials) {
  return apiRequest(apiPaths.authLogin, { method: 'POST', body: credentials });
}

export function logout() {
  return apiRequest(apiPaths.authLogout, { method: 'POST' });
}
