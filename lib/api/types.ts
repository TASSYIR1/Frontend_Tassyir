// ─── Enums ──────────────────────────────────────────────────────────────────

export type Role = 'SUPER_ADMIN' | 'ADMIN' | 'SECRETAIRE' | 'ENSEIGNANT' | 'ETUDIANT' | 'PARENT';
export type SchoolType = 'NORMALE' | 'COURS_SUPPLEMENTAIRES';
export type SchoolLevel = 'PRIMAIRE' | 'MOYENNE' | 'SECONDAIRE';
export type SchoolRequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// ─── Generic API Response ───────────────────────────────────────────────────

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T;
  timestamp: string;
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  role: Role;
  userId: string;
  tenantId: string;
  matricule: string;
  fullName: string;
}

export interface AuthenticatedUser {
  userId: string;
  tenantId: string;
  role: Role;
  matricule: string;
  fullName: string;
}

export interface SchoolLoginRequest {
  matricule: string;
  password: string;
}

export interface PlatformLoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

// ─── Users ───────────────────────────────────────────────────────────────────

export interface UserResponse {
  id: string;
  matricule: string;
  email: string;
  role: Role;
  fullName: string;
  phone: string;
  active: boolean;
  temporaryPassword: boolean;
  createdAt: string;
}

export interface StudentResponse extends UserResponse {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  className?: string;
  levelLabel?: string;
  parentFullName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

export interface UserCreateRequest {
  role: Role;
  fullName: string;
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  className?: string;
  levelLabel?: string;
  parentFullName?: string;
  parentEmail?: string;
  parentPhone?: string;
}

export interface UserUpdateRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

// ─── School ──────────────────────────────────────────────────────────────────

export interface GalleryImageResponse {
  id: number;
  imageUrl: string;
  caption: string;
}

export interface SchoolResponse {
  id: string;
  name: string;
  slug: string;
  schemaName: string;
  type: SchoolType;
  schoolLevel: SchoolLevel;
  themeKey: string;
  logoUrl: string;
  active: boolean;
  requestStatus: SchoolRequestStatus;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutDescription: string;
  aboutValues: string;
  establishedYear: number | null;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  googleMapsLink: string;
  gallery: GalleryImageResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchoolRequest {
  name: string;
  type: SchoolType;
  schoolLevel?: SchoolLevel;
  themeKey?: string;
  logoUrl?: string;
  adminFullName: string;
  adminEmail: string;
}

export interface LandingHeroUpdateRequest {
  heroTitle?: string;
  heroSubtitle?: string;
  heroImageUrl?: string;
}

export interface LandingAboutUpdateRequest {
  aboutDescription?: string;
  aboutValues?: string;
  establishedYear?: number;
}

export interface LandingContactUpdateRequest {
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;
  googleMapsLink?: string;
}

export interface LandingGalleryCreateRequest {
  imageUrl: string;
  caption?: string;
}

// ─── Generic map-based records (used by many endpoints) ─────────────────────
// Many backend endpoints return Map<String, Object> — we type these loosely.

export type RecordMap = Record<string, unknown>;
