// src/lib/apiClient.ts
import * as SecureStore from 'expo-secure-store';
import { AppError } from './errors';
import { withRefreshMutex } from './refreshMutex';
import { router } from 'expo-router';
import { Config } from '../constants/Config';

export { AppError, ApiError, isAppError, ERROR_CODES } from './errors';

export const AUTH_ACCESS_TOKEN_KEY = 'auth_access_token';
export const AUTH_REFRESH_TOKEN_KEY = 'auth_refresh_token';

export const tokenStore = {
  getAccess: () => SecureStore.getItemAsync(AUTH_ACCESS_TOKEN_KEY),
  getRefresh: () => SecureStore.getItemAsync(AUTH_REFRESH_TOKEN_KEY),
  setTokens: (access: string, refresh: string) =>
    Promise.all([
      SecureStore.setItemAsync(AUTH_ACCESS_TOKEN_KEY, access),
      SecureStore.setItemAsync(AUTH_REFRESH_TOKEN_KEY, refresh),
    ]),
  clearTokens: () =>
    Promise.all([
      SecureStore.deleteItemAsync(AUTH_ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(AUTH_REFRESH_TOKEN_KEY),
    ]),
};

// Backward-compatibility helpers
export const getTokens = async () => {
  const [access, refresh] = await Promise.all([
    tokenStore.getAccess(),
    tokenStore.getRefresh(),
  ]);
  return { accessToken: access, refreshToken: refresh };
};

export const saveTokens = (access: string, refresh?: string) =>
  refresh ? tokenStore.setTokens(access, refresh) : SecureStore.setItemAsync(AUTH_ACCESS_TOKEN_KEY, access);

export const clearTokens = tokenStore.clearTokens;

export const authStorage = {
  getAccessToken: tokenStore.getAccess,
  getRefreshToken: tokenStore.getRefresh,
  setTokens: tokenStore.setTokens,
  clear: tokenStore.clearTokens,
};

const BASE_URL = Config.apiUrl.replace(/\/+$/, '');

export function apiUrl(path: string): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${BASE_URL}${normalizedPath}`;
}

async function parseError(res: Response): Promise<AppError> {
  const body = await res.json().catch(() => ({}));
  const code = body?.code || body?.error || 'UNKNOWN_ERROR';
  const message = body?.message || body?.error || `HTTP ${res.status}: Request failed`;
  return new AppError(code, message, body?.details, res.status);
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  params?: Record<string, string | number | boolean | undefined>;
  auth?: boolean;
  _retry?: boolean;
  body?: unknown;
}

async function request<T>(path: string, options: RequestOptions = {}, isRetry = false): Promise<T> {
  const { params, auth = true, _retry = false, headers = {}, body, ...init } = options;

  const accessToken = await tokenStore.getAccess(); // Always await — never cache in module variable

  let urlString = path.startsWith('http://') || path.startsWith('https://') ? path : apiUrl(path);
  if (params) {
    const url = new URL(urlString);
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) url.searchParams.set(k, String(v));
    });
    urlString = url.toString();
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
  const reqHeaders: Record<string, string> = {
    Accept: 'application/json',
    'x-client-platform': 'mobile',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...(headers as Record<string, string>),
  };

  const payload: BodyInit | undefined = isFormData
    ? (body as FormData)
    : body !== undefined && typeof body !== 'string'
    ? JSON.stringify(body)
    : (body as string | undefined);

  const res = await fetch(urlString, {
    ...init,
    headers: reqHeaders,
    body: payload,
  });

  // Handle 401 token refresh retry on mobile
  if (res.status === 401 && !isRetry && !path.includes('/auth/login') && !path.includes('/auth/refresh')) {
    await withRefreshMutex(async () => {
      const refreshToken = await tokenStore.getRefresh();
      if (!refreshToken) {
        await tokenStore.clearTokens();
        router.replace('/welcome');
        throw new AppError('TOKEN_EXPIRED', 'Session expired.', undefined, 401);
      }

      const refresh = await fetch(apiUrl('/auth/refresh'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'x-client-platform': 'mobile',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!refresh.ok) {
        await tokenStore.clearTokens();
        router.replace('/welcome');
        throw new AppError('TOKEN_EXPIRED', 'Session expired.', undefined, 401);
      }

      const data = await refresh.json();
      const newAccess = data.data?.newAccessToken || data.newAccessToken || data.accessToken || data.data?.accessToken;
      const newRefresh = data.data?.newRefreshToken || data.newRefreshToken || data.refreshToken || data.data?.refreshToken;

      if (newAccess) {
        await tokenStore.setTokens(newAccess, newRefresh || refreshToken);
      }
    });
    return request<T>(path, options, true);
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

const jsonInit = (body: unknown, init?: RequestOptions): RequestOptions => ({
  ...init,
  body,
});

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'GET', ...options }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'POST', ...jsonInit(body, options) }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', ...jsonInit(body, options) }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { method: 'PUT', ...jsonInit(body, options) }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: 'DELETE', ...options }),
  postForm: <T>(path: string, form: FormData, options?: RequestOptions) =>
    request<T>(path, { method: 'POST', ...options, body: form }),
  patchForm: <T>(path: string, form: FormData, options?: RequestOptions) =>
    request<T>(path, { method: 'PATCH', ...options, body: form }),
};

// Backward-compatible apiRequest export
export const apiRequest = request;
export default apiClient;