import { apiConfig, apiPaths } from './apiRoutes.js';
import { mockRequest } from './mockApi.js';

let accessToken = null;
let unauthorizedHandler = null;

export function setAccessToken(token) {
  accessToken = token || null;
}

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

function safeMessage(status, body, path) {
  const serverMessage = typeof body?.message === 'string' ? body.message : '';
  if (status === 400) return serverMessage || 'Check the highlighted fields and try again.';
  if (status === 401 && path === apiPaths.authLogin) return 'That email or password is incorrect.';
  if (status === 401) return 'Your session is missing or expired. Please sign in again.';
  if (status === 403) return 'You do not have permission to complete this action.';
  if (status === 404) return 'The requested record could not be found.';
  if (status === 409) return serverMessage || 'This action conflicts with an existing record.';
  if (status >= 500) return 'The service is temporarily unavailable. Please try again.';
  return serverMessage || 'Something went wrong. Please try again.';
}

export async function apiRequest(path, { method = 'GET', body, query, responseType = 'json' } = {}) {
  if (apiConfig.mockMode) {
    return mockRequest(path, { method, body, query, responseType });
  }

  const search = query ? new URLSearchParams(Object.entries(query).filter(([, value]) => value !== undefined && value !== '')).toString() : '';
  const url = `${apiConfig.baseUrl}${path}${search ? `${path.includes('?') ? '&' : '?'}${search}` : ''}`;
  let response;
  try {
    response = await fetch(url, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError('Could not reach the API Gateway. Check the connection and retry.');
  }

  if (!response.ok) {
    let data = null;
    try { data = await response.json(); } catch { /* keep the mapped safe message */ }
    if (response.status === 401 && path !== apiPaths.authLogin) {
      setAccessToken(null);
      unauthorizedHandler?.();
    }
    throw new ApiError(safeMessage(response.status, data, path), response.status, data);
  }
  if (responseType === 'blob') return response.blob();
  if (response.status === 204) return null;
  return response.json();
}
