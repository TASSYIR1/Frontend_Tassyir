import { apiClient } from './client';
import type { ApiResponse, RecordMap } from './types';

export const notificationsService = {
  async getAll(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/notifications');
    return res.data;
  },

  async markAsRead(id: string): Promise<void> {
    await apiClient.put(`/api/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<void> {
    await apiClient.put('/api/notifications/read-all');
  },

  async getSettings(): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>('/api/notifications/settings');
    return res.data;
  },

  async updateSettings(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.put<ApiResponse<RecordMap>>('/api/notifications/settings', data);
    return res.data;
  },

  /** Subscribe to real-time notification stream via SSE */
  subscribeStream(): EventSource {
    return apiClient.createEventSource('/api/notifications/stream');
  },
};
