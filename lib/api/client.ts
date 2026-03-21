import type { ApiResponse } from './types';

// ─── Configuration ──────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const TOKEN_KEY = 'tassyir_access_token';
const REFRESH_KEY = 'tassyir_refresh_token';
const SCHOOL_ID_KEY = 'tassyir_school_id';

// ─── Token helpers ──────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_KEY);
}

export function getSchoolId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SCHOOL_ID_KEY);
}

export function setTokens(accessToken: string, refreshToken: string): void {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function setSchoolId(schoolId: string): void {
  localStorage.setItem(SCHOOL_ID_KEY, schoolId);
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(SCHOOL_ID_KEY);
}

// ─── Refresh logic ──────────────────────────────────────────────────────────

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  // Deduplicate concurrent refresh calls
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      clearAuth();
      if (typeof window !== 'undefined') {
        window.location.href = '/Tamkin/login';
      }
      throw new Error('Token refresh failed');
    }

    const json: ApiResponse<{ accessToken: string; refreshToken: string }> = await res.json();
    setTokens(json.data.accessToken, json.data.refreshToken);
    return json.data.accessToken;
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

// ─── Core fetch wrapper ─────────────────────────────────────────────────────

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  skipAuth?: boolean;
  schoolId?: string; // override for specific calls
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { body, skipAuth, schoolId, headers: extraHeaders, ...rest } = options;

  const headers: Record<string, string> = {
    ...(extraHeaders as Record<string, string> || {}),
  };

  // JSON body
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  // Auth header
  if (!skipAuth) {
    const token = getAccessToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Multi-tenant header
  const sid = schoolId || getSchoolId();
  if (sid) {
    headers['X-School-ID'] = sid;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  let res = await fetch(url, {
    ...rest,
    headers,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  // 401 → attempt token refresh and retry once
  if (res.status === 401 && !skipAuth) {
    try {
      const newToken = await refreshAccessToken();
      headers['Authorization'] = `Bearer ${newToken}`;
      res = await fetch(url, {
        ...rest,
        headers,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
      });
    } catch {
      throw new Error('Session expired. Please log in again.');
    }
  }

  // Handle non-JSON responses (file downloads)
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/octet-stream') ||
      contentType.includes('application/pdf') ||
      contentType.includes('spreadsheetml')) {
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    return (await res.blob()) as unknown as T;
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.message || `Request failed: ${res.status}`);
  }

  return json;
}

// ─── Public API client ──────────────────────────────────────────────────────

export const apiClient = {
  get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body });
  },

  put<T>(endpoint: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'PUT', body });
  },

  delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
  },

  /** Download a file as a Blob */
  async download(endpoint: string, filename: string, options?: RequestOptions): Promise<void> {
    const blob = await request<Blob>(endpoint, { ...options, method: 'GET' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  },

  /** Upload a file as multipart/form-data */
  upload<T>(endpoint: string, formData: FormData, options?: RequestOptions): Promise<T> {
    return request<T>(endpoint, { ...options, method: 'POST', body: formData });
  },

  /** Create an SSE EventSource (for notifications/live streams) */
  createEventSource(endpoint: string): EventSource {
    const token = getAccessToken();
    const schoolId = getSchoolId();
    const params = new URLSearchParams();
    if (token) params.set('accessToken', token);
    if (schoolId) params.set('schoolId', schoolId);

    const url = `${API_BASE_URL}${endpoint}${params.toString() ? '?' + params.toString() : ''}`;
    return new EventSource(url);
  },
};

export { API_BASE_URL };
