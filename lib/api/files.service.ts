import { apiClient } from './client';
import type { ApiResponse, RecordMap } from './types';

export const filesService = {
  async listByScope(scope: string, scopeId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/files?scopeType=${scope}&scopeId=${scopeId}`);
    return res.data;
  },

  async listByClass(classId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/files/class/${classId}`);
    return res.data;
  },

  async listBySession(sessionId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/files/session/${sessionId}`);
    return res.data;
  },

  async upload(file: File, scope: string, scopeId: string, sessionId?: string): Promise<RecordMap> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('scopeType', scope);
    formData.append('scopeId', scopeId);
    if (sessionId) formData.append('sessionId', sessionId);
    const res = await apiClient.upload<ApiResponse<RecordMap>>('/api/files', formData);
    return res.data;
  },

  async download(fileId: string, filename: string): Promise<void> {
    await apiClient.download(`/api/files/${fileId}/download`, filename);
  },

  async delete(fileId: string): Promise<void> {
    await apiClient.delete(`/api/files/${fileId}`);
  },

  async getVersions(fileId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/files/${fileId}/versions`);
    return res.data;
  },

  async getVersionsByScope(scope: string, scopeId: string, filename: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(
      `/api/files/versions?scopeType=${scope}&scopeId=${scopeId}&filename=${encodeURIComponent(filename)}`
    );
    return res.data;
  },
};
