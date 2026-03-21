import { apiClient } from './client';
import type { ApiResponse, RecordMap } from './types';

export const paymentsService = {
  async getAll(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/payments');
    return res.data;
  },

  async getById(id: string): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>(`/api/payments/${id}`);
    return res.data;
  },

  async create(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/payments', data);
    return res.data;
  },

  async update(id: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.put<ApiResponse<RecordMap>>(`/api/payments/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/payments/${id}`);
  },

  async getByStudent(studentId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/payments/student/${studentId}`);
    return res.data;
  },

  async getDashboard(): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>('/api/payments/dashboard');
    return res.data;
  },

  async sendReminders(): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/payments/send-reminders');
    return res.data;
  },

  // ─── Exports ────────────────────────────────────────────────────────────

  async exportExcel(): Promise<void> {
    await apiClient.download('/api/payments/export/excel', 'payments.xlsx');
  },

  async exportPdf(): Promise<void> {
    await apiClient.download('/api/payments/export/pdf', 'payments.pdf');
  },
};
