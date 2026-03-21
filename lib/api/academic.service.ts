import { apiClient } from './client';
import type { ApiResponse, RecordMap } from './types';

export const academicService = {
  // ─── Classes ────────────────────────────────────────────────────────────

  async getClasses(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/classes');
    return res.data;
  },

  async getClassById(id: string): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>(`/api/classes/${id}`);
    return res.data;
  },

  async createClass(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/classes', data);
    return res.data;
  },

  async updateClass(id: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.put<ApiResponse<RecordMap>>(`/api/classes/${id}`, data);
    return res.data;
  },

  async deleteClass(id: string): Promise<void> {
    await apiClient.delete(`/api/classes/${id}`);
  },

  async assignStudentsToClass(classId: string, studentIds: string[]): Promise<void> {
    await apiClient.post(`/api/classes/${classId}/students`, studentIds);
  },

  async assignTeachersToClass(classId: string, teacherIds: string[]): Promise<void> {
    await apiClient.post(`/api/classes/${classId}/teachers`, teacherIds);
  },

  // ─── Subjects ───────────────────────────────────────────────────────────

  async getSubjects(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/subjects');
    return res.data;
  },

  async getSubjectById(id: string): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>(`/api/subjects/${id}`);
    return res.data;
  },

  async createSubject(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/subjects', data);
    return res.data;
  },

  async updateSubject(id: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.put<ApiResponse<RecordMap>>(`/api/subjects/${id}`, data);
    return res.data;
  },

  async deleteSubject(id: string): Promise<void> {
    await apiClient.delete(`/api/subjects/${id}`);
  },

  async getSubjectPricing(id: string): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>(`/api/subjects/${id}/pricing`);
    return res.data;
  },

  async updateSubjectPricing(id: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.put<ApiResponse<RecordMap>>(`/api/subjects/${id}/pricing`, data);
    return res.data;
  },

  // ─── Groups ─────────────────────────────────────────────────────────────

  async getGroups(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/groups');
    return res.data;
  },

  async getGroupById(id: string): Promise<RecordMap> {
    const res = await apiClient.get<ApiResponse<RecordMap>>(`/api/groups/${id}`);
    return res.data;
  },

  async createGroup(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/groups', data);
    return res.data;
  },

  async updateGroup(id: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.put<ApiResponse<RecordMap>>(`/api/groups/${id}`, data);
    return res.data;
  },

  async deleteGroup(id: string): Promise<void> {
    await apiClient.delete(`/api/groups/${id}`);
  },

  async getGroupStudents(id: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/groups/${id}/students`);
    return res.data;
  },

  // ─── Subscriptions ──────────────────────────────────────────────────────

  async getSubscriptions(): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>('/api/subscriptions');
    return res.data;
  },

  async getSubscriptionsByStudent(studentId: string): Promise<RecordMap[]> {
    const res = await apiClient.get<ApiResponse<RecordMap[]>>(`/api/subscriptions/student/${studentId}`);
    return res.data;
  },

  async createSubscription(data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.post<ApiResponse<RecordMap>>('/api/subscriptions', data);
    return res.data;
  },

  async updateSubscription(id: string, data: RecordMap): Promise<RecordMap> {
    const res = await apiClient.put<ApiResponse<RecordMap>>(`/api/subscriptions/${id}`, data);
    return res.data;
  },

  async deleteSubscription(id: string): Promise<void> {
    await apiClient.delete(`/api/subscriptions/${id}`);
  },
};
