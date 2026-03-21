import { apiClient } from './client';
import type { ApiResponse, UserResponse, UserCreateRequest, UserUpdateRequest, StudentResponse, RecordMap } from './types';

export const usersService = {
  // ─── Generic Users ──────────────────────────────────────────────────────

  async getAll(): Promise<UserResponse[]> {
    const res = await apiClient.get<ApiResponse<UserResponse[]>>('/api/users');
    return res.data;
  },

  async getById(id: string): Promise<UserResponse> {
    const res = await apiClient.get<ApiResponse<UserResponse>>(`/api/users/${id}`);
    return res.data;
  },

  async create(data: UserCreateRequest): Promise<UserResponse> {
    const res = await apiClient.post<ApiResponse<UserResponse>>('/api/users', data);
    return res.data;
  },

  async update(id: string, data: UserUpdateRequest): Promise<UserResponse> {
    const res = await apiClient.put<ApiResponse<UserResponse>>(`/api/users/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/api/users/${id}`);
  },

  async resetPassword(id: string, newPassword: string): Promise<void> {
    await apiClient.put(`/api/auth/school/users/${id}/reset-password`, { newPassword });
  },

  // ─── Students ───────────────────────────────────────────────────────────

  async getStudents(): Promise<StudentResponse[]> {
    const res = await apiClient.get<ApiResponse<StudentResponse[]>>('/api/students');
    return res.data;
  },

  async getStudentById(id: string): Promise<StudentResponse> {
    const res = await apiClient.get<ApiResponse<StudentResponse>>(`/api/students/${id}`);
    return res.data;
  },

  // ─── Teachers ───────────────────────────────────────────────────────────

  async getTeachers(): Promise<UserResponse[]> {
    const res = await apiClient.get<ApiResponse<UserResponse[]>>('/api/teachers');
    return res.data;
  },

  async getTeacherById(id: string): Promise<UserResponse> {
    const res = await apiClient.get<ApiResponse<UserResponse>>(`/api/users/${id}`);
    return res.data;
  },

  // ─── Bulk Import ────────────────────────────────────────────────────────

  async downloadImportTemplate(): Promise<void> {
    await apiClient.download('/api/users/import/template', 'import_template.xlsx');
  },

  async importUsers(file: File): Promise<RecordMap> {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.upload<ApiResponse<RecordMap>>('/api/users/import', formData);
    return res.data;
  },
};
