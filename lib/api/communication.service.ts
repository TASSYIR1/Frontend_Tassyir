import { apiClient } from './client';
import type { ApiResponse, RecordMap } from './types';

export const communicationService = {
  // ─── Announcements ──────────────────────────────────────────────────────

  async getAnnouncements(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/announcements');
    return res.data;
  },

  async getAnnouncementById(id: string): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>(`/api/announcements/${id}`);
    return res.data;
  },

  async createAnnouncement(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/announcements', data);
    return res.data;
  },

  async deleteAnnouncement(id: string): Promise<void> {
    await apiClient.delete(`/api/announcements/${id}`);
  },

  // ─── Messages ───────────────────────────────────────────────────────────

  async getInbox(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/messages/inbox');
    return res.data;
  },

  async getConversation(otherUserId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/messages/${otherUserId}`);
    return res.data;
  },

  async getThread(userId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/messages/thread/${userId}`);
    return res.data;
  },

  async sendMessage(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/messages', data);
    return res.data;
  },

  async deleteMessage(id: string): Promise<void> {
    await apiClient.delete(`/api/messages/${id}`);
  },
};
