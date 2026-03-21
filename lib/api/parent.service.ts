import { apiClient } from './client';
import type { ApiResponse, RecordMap } from './types';

export const parentService = {
  // ─── Admin-facing parent CRUD ───────────────────────────────────────────

  async getAll(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/parents');
    return res.data;
  },

  async getById(id: string): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>(`/api/parents/${id}`);
    return res.data;
  },

  async create(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/parents', data);
    return res.data;
  },

  async update(id: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.put<ApiResponse<RecordMap>>(`/api/parents/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/parents/${id}`);
  },

  async getChildren(parentId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/parents/${parentId}/children`);
    return res.data;
  },

  // ─── Self-service (logged-in parent) ────────────────────────────────────

  async getMyChildren(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/parents/me/children');
    return res.data;
  },

  async getChildPayment(childId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/parents/me/children/${childId}/payment`);
    return res.data;
  },

  async getChildAttendance(childId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/parents/me/children/${childId}/attendance`);
    return res.data;
  },

  async getChildSchedule(childId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/parents/me/children/${childId}/schedule`);
    return res.data;
  },

  async getChildAnnouncements(childId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/parents/me/children/${childId}/announcements`);
    return res.data;
  },

  // ─── Parent Messages ────────────────────────────────────────────────────

  async getMyMessages(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/parents/me/messages');
    return res.data;
  },

  async sendMyMessage(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/parents/me/messages', data);
    return res.data;
  },
};
