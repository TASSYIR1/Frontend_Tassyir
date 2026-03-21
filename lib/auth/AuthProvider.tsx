'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { authService } from '@/lib/api/auth.service';
import { schoolService } from '@/lib/api/school.service';
import { getAccessToken, getRefreshToken, getSchoolId, clearAuth, setSchoolId } from '@/lib/api/client';
import type { AuthenticatedUser, Role, SchoolType, SchoolLoginRequest, PlatformLoginRequest } from '@/lib/api/types';

// ─── Auth State ─────────────────────────────────────────────────────────────

interface AuthState {
  user: AuthenticatedUser | null;
  role: Role | null;
  schoolId: string | null;
  schoolType: SchoolType | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  loginSchool: (schoolIdentifier: string, credentials: SchoolLoginRequest) => Promise<void>;
  loginPlatform: (credentials: PlatformLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    role: null,
    schoolId: null,
    schoolType: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setState(prev => ({ ...prev, isLoading: false }));
      return;
    }

    // Try to restore session
    authService.getMe()
      .then(async (user) => {
        let schoolType: SchoolType | null = null;
        try {
          const school = await schoolService.getCurrentSchool();
          schoolType = school.type;
        } catch {
          // ignore — platform admin may not have a school
        }

        setState({
          user,
          role: user.role,
          schoolId: getSchoolId(),
          schoolType,
          isAuthenticated: true,
          isLoading: false,
        });
      })
      .catch(() => {
        clearAuth();
        setState({
          user: null,
          role: null,
          schoolId: null,
          schoolType: null,
          isAuthenticated: false,
          isLoading: false,
        });
      });
  }, []);

  const loginSchool = useCallback(async (schoolIdentifier: string, credentials: SchoolLoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true }));
    const authRes = await authService.schoolLogin(schoolIdentifier, credentials);

    let schoolType: SchoolType | null = null;
    try {
      const school = await schoolService.getCurrentSchool();
      schoolType = school.type;
    } catch {
      // ignore
    }

    setState({
      user: {
        userId: authRes.userId,
        tenantId: authRes.tenantId,
        role: authRes.role,
        matricule: authRes.matricule,
        fullName: authRes.fullName,
      },
      role: authRes.role,
      schoolId: authRes.tenantId,
      schoolType,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const loginPlatform = useCallback(async (credentials: PlatformLoginRequest) => {
    setState(prev => ({ ...prev, isLoading: true }));
    const authRes = await authService.platformLogin(credentials);

    setState({
      user: {
        userId: authRes.userId,
        tenantId: authRes.tenantId,
        role: authRes.role,
        matricule: authRes.matricule,
        fullName: authRes.fullName,
      },
      role: authRes.role,
      schoolId: null,
      schoolType: null,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    await authService.logout();
    setState({
      user: null,
      role: null,
      schoolId: null,
      schoolType: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, loginSchool, loginPlatform, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
