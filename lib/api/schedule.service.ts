import { apiClient } from './client';
import type { ApiResponse, RecordMap } from './types';

export const scheduleService = {
  // ─── Class / Group Schedules ────────────────────────────────────────────

  async getClassSchedule(classId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/schedules/class/${classId}`);
    return res.data;
  },

  async getGroupSchedule(groupId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/schedules/group/${groupId}`);
    return res.data;
  },

  // ─── My Schedules (role-specific) ───────────────────────────────────────

  async getTeacherSchedule(teacherId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/schedules/teacher/${teacherId}`);
    return res.data;
  },

  async getMySchedule(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/schedules/me');
    return res.data;
  },

  // ─── Session CRUD ───────────────────────────────────────────────────────

  async createClassSession(classId: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>(`/api/schedules/class/${classId}/sessions`, data);
    return res.data;
  },

  async createGroupSession(groupId: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>(`/api/schedules/group/${groupId}/sessions`, data);
    return res.data;
  },

  async updateSession(id: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.put<ApiResponse<RecordMap>>(`/api/schedules/sessions/${id}`, data);
    return res.data;
  },

  async deleteSession(id: string): Promise<void> {
    await apiClient.delete(`/api/schedules/sessions/${id}`);
  },

  // ─── Conflicts ──────────────────────────────────────────────────────────

  async checkRoomConflict(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/schedules/rooms/conflicts');
    return res.data;
  },

  async checkTeacherConflict(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/schedules/teacher/conflicts');
    return res.data;
  },

  // ─── Change Requests ────────────────────────────────────────────────────

  async getChangeRequests(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/schedules/change-requests');
    return res.data;
  },

  async createChangeRequest(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/schedules/change-requests', data);
    return res.data;
  },

  async approveChangeRequest(id: string): Promise<void> {
    await apiClient.put(`/api/schedules/change-requests/${id}/approve`);
  },

  // ─── Live Dashboard (SSE) ──────────────────────────────────────────────

  subscribeLiveDashboard(): EventSource {
    return apiClient.createEventSource('/api/schedules/dashboard/live');
  },
};
