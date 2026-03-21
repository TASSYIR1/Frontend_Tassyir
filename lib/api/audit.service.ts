import { apiClient } from './client';
import type { ApiResponse, RecordMap } from './types';

export const auditService = {
  async getLogs(params?: {
    entityType?: string;
    actionType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
  }): Promise<RecordMap[]> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.set(key, String(value));
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/audit${query}`);
    return res.data;
  },

  async getLogsByUser(userId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/audit/logs/user/${userId}`);
    return res.data;
  },

  async exportLogs(format: 'pdf' | 'excel' = 'excel'): Promise<void> {
    const ext = format === 'pdf' ? 'pdf' : 'xlsx';
    await apiClient.download(`/api/audit/export?format=${format}`, `audit_logs.${ext}`);
  },
};
