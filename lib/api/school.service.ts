import { apiClient } from './client';
import type {
  ApiResponse, SchoolResponse, CreateSchoolRequest,
  LandingHeroUpdateRequest, LandingAboutUpdateRequest,
  LandingContactUpdateRequest, LandingGalleryCreateRequest,
  GalleryImageResponse, RecordMap,
} from './types';

export const schoolService = {
  // ─── Admin / Platform ───────────────────────────────────────────────────

  async listSchools(): Promise<SchoolResponse[]> {
    const res = await apiClient.get<ApiResponse<SchoolResponse[]>>('/api/admin/schools');
    return res.data;
  },

  async createSchool(data: CreateSchoolRequest): Promise<SchoolResponse> {
    const res = await apiClient.post<ApiResponse<SchoolResponse>>('/api/admin/schools', data);
    return res.data;
  },

  async getSchoolById(id: string): Promise<SchoolResponse> {
    const res = await apiClient.get<ApiResponse<SchoolResponse>>(`/api/admin/schools/${id}`);
    return res.data;
  },

  async approveSchoolRequest(id: string): Promise<SchoolResponse> {
    const res = await apiClient.put<ApiResponse<SchoolResponse>>(`/api/admin/schools/${id}/approve`);
    return res.data;
  },

  async rejectSchoolRequest(id: string): Promise<SchoolResponse> {
    const res = await apiClient.put<ApiResponse<SchoolResponse>>(`/api/admin/schools/${id}/reject`);
    return res.data;
  },

  /** Get current school (from X-School-ID header) */
  async getCurrentSchool(): Promise<SchoolResponse> {
    const res = await apiClient.get<ApiResponse<SchoolResponse>>('/api/schools/me');
    return res.data;
  },

  // ─── Public (by slug) ──────────────────────────────────────────────────

  async getBySlug(slug: string): Promise<SchoolResponse> {
    const res = await apiClient.get<ApiResponse<SchoolResponse>>(`/api/schools/${slug}`, { skipAuth: true });
    return res.data;
  },

  async getLanding(slug: string): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>(`/api/schools/${slug}/landing`, { skipAuth: true });
    return res.data;
  },

  // ─── Landing Customization ─────────────────────────────────────────────

  async updateHero(slug: string, data: LandingHeroUpdateRequest): Promise<SchoolResponse> {
    const res = await apiClient.put<ApiResponse<SchoolResponse>>(`/api/schools/${slug}/landing/hero`, data);
    return res.data;
  },

  async updateAbout(slug: string, data: LandingAboutUpdateRequest): Promise<SchoolResponse> {
    const res = await apiClient.put<ApiResponse<SchoolResponse>>(`/api/schools/${slug}/landing/about`, data);
    return res.data;
  },

  async updateContact(slug: string, data: LandingContactUpdateRequest): Promise<SchoolResponse> {
    const res = await apiClient.put<ApiResponse<SchoolResponse>>(`/api/schools/${slug}/landing/contact`, data);
    return res.data;
  },

  async addGalleryImage(slug: string, data: LandingGalleryCreateRequest): Promise<GalleryImageResponse> {
    const res = await apiClient.post<ApiResponse<GalleryImageResponse>>(`/api/schools/${slug}/landing/gallery`, data);
    return res.data;
  },

  async removeGalleryImage(slug: string, imageId: number): Promise<void> {
    await apiClient.delete(`/api/schools/${slug}/landing/gallery/${imageId}`);
  },
};
