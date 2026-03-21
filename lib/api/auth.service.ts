import { apiClient, setTokens, setSchoolId, clearAuth } from './client';
import type { ApiResponse, AuthResponse, SchoolLoginRequest, PlatformLoginRequest, AuthenticatedUser } from './types';

export const authService = {
  /** Login via school-specific login (for students, teachers, parents, secretaries) */
  async schoolLogin(schoolIdentifier: string, credentials: SchoolLoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/auth/school/login',
      credentials,
      { skipAuth: true, schoolId: schoolIdentifier }
    );
    const data = res.data;
    setTokens(data.accessToken, data.refreshToken);
    setSchoolId(data.tenantId);
    return data;
  },

  /** Login via platform login (for super admin) */
  async platformLogin(credentials: PlatformLoginRequest): Promise<AuthResponse> {
    const res = await apiClient.post<ApiResponse<AuthResponse>>(
      '/api/auth/platform/login',
      credentials,
      { skipAuth: true }
    );
    const data = res.data;
    setTokens(data.accessToken, data.refreshToken);
    return data;
  },

  /** Logout — clears backend session and local tokens */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/auth/logout');
    } finally {
      clearAuth();
    }
  },

  /** Get current authenticated user info */
  async getMe(): Promise<AuthenticatedUser> {
    const res = await apiClient.get<ApiResponse<AuthenticatedUser>>('/api/auth/me');
    return res.data;
  },
};
