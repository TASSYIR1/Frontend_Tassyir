import { apiClient } from './client';
import type { ApiResponse, RecordMap } from './types';

export const attendanceService = {
  async getBySession(sessionId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/attendance/session/${sessionId}`);
    return res.data;
  },

  async getByStudent(studentId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/attendance/student/${studentId}`);
    return res.data;
  },

  async getByClass(classId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/attendance/class/${classId}`);
    return res.data;
  },

  async record(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/attendance', data);
    return res.data;
  },

  async update(id: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.put<ApiResponse<RecordMap>>(`/api/attendance/${id}`, data);
    return res.data;
  },

  async getSessionSummary(sessionId: string): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>(`/api/attendance/session/${sessionId}/summary`);
    return res.data;
  },

  // ─── Exports ────────────────────────────────────────────────────────────

  async exportPdf(params?: string): Promise<void> {
    const query = params ? `?${params}` : '';
    await apiClient.download(`/api/attendance/export/pdf${query}`, 'attendance.pdf');
  },

  async exportExcel(params?: string): Promise<void> {
    const query = params ? `?${params}` : '';
    await apiClient.download(`/api/attendance/export/excel${query}`, 'attendance.xlsx');
  },
};
