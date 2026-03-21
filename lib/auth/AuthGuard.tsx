'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';
import type { Role } from '@/lib/api/types';

interface AuthGuardProps {
  children: ReactNode;
  allowedRoles: Role[];
  redirectTo?: string;
}

/** Route guard that checks authentication + role-based access */
export function AuthGuard({ children, allowedRoles, redirectTo = '/Tamkin/login' }: AuthGuardProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(redirectTo);
      return;
    }

    if (role && !allowedRoles.includes(role)) {
      // Redirect to role-appropriate dashboard
      const roleRoutes: Record<Role, string> = {
        SUPER_ADMIN: '/tayssir_dashboard',
        ADMIN: '/admin',
        SECRETAIRE: '/secretaire',
        ENSEIGNANT: '/teacher',
        ETUDIANT: '/etudiant',
        PARENT: '/Parent',
      };
      router.replace(roleRoutes[role] || '/');
    }
  }, [isAuthenticated, isLoading, role, allowedRoles, router, redirectTo]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f4f4f8]" dir="rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#e01c8a]/30 border-t-[#e01c8a] rounded-full animate-spin" />
          <p className="text-gray-500 font-bold text-sm">جاري التحقق من الجلسة...</p>
        </div>
      </div>
    );
  }

  // Not authenticated or wrong role
  if (!isAuthenticated || (role && !allowedRoles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
