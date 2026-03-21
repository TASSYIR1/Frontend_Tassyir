'use client';

import { AuthProvider } from './AuthProvider';
import type { ReactNode } from 'react';

/** Client-side wrapper for AuthProvider (needed because layout.tsx is a Server Component) */
export function AuthProviderWrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
